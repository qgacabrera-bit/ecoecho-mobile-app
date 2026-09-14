/**
 * EcoEcho Field Protection Activity Log Cache Database
 * ====================================================
 * Provides persistent, resilient client-side storage for pest detection logs.
 * Combines IndexedDB (for structured browser database storage) with localStorage
 * (for instant zero-latency hydration on page reloads/refreshes).
 */

import { AIDetectionEvent } from '../types';

const DB_NAME = 'EcoEchoFieldLogsDB';
const DB_VERSION = 1;
const STORE_NAME = 'field_protection_logs';
const LOCAL_STORAGE_KEY = 'ecoecho_cached_field_logs';
const MAX_LOGS_CAPACITY = 200;

// Initialize IndexedDB
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('pestType', 'pestType', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load cached detection logs synchronously from localStorage for instant initial render.
 */
export function loadCachedDetectionLogs(): AIDetectionEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_LOGS_CAPACITY);
    }
  } catch (err) {
    console.warn('[EcoEcho DB] Error reading cached logs from localStorage:', err);
  }
  return [];
}

/**
 * Save detection logs to both localStorage and IndexedDB.
 */
export async function saveDetectionLogs(logs: AIDetectionEvent[]): Promise<void> {
  const cappedLogs = logs.slice(0, MAX_LOGS_CAPACITY);

  // 1. Sync to localStorage for instant reload availability
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cappedLogs));
  } catch (err) {
    console.warn('[EcoEcho DB] localStorage write warning (quota/private mode):', err);
  }

  // 2. Persist to IndexedDB object store
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear old store contents and write current logs
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      cappedLogs.forEach(item => {
        store.put(item);
      });
    };

    transaction.oncomplete = () => {
      db.close();
    };
  } catch (err) {
    // Graceful fallback to localStorage
    console.debug('[EcoEcho DB] IndexedDB write fallback to localStorage:', err);
  }
}

/**
 * Load logs from IndexedDB (asynchronous fallback/sync check on startup).
 */
export async function loadLogsFromIndexedDb(): Promise<AIDetectionEvent[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as AIDetectionEvent[]) || [];
        // Sort descending by timestamp
        results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        db.close();
        resolve(results.slice(0, MAX_LOGS_CAPACITY));
      };

      request.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  } catch {
    return [];
  }
}

/**
 * Clear all detection logs from both localStorage and IndexedDB.
 */
export async function clearDetectionLogsDb(): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (err) {
    console.warn('[EcoEcho DB] localStorage clear error:', err);
  }

  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
    transaction.oncomplete = () => db.close();
  } catch (err) {
    console.debug('[EcoEcho DB] IndexedDB clear note:', err);
  }
}
