/**
 * EcoEcho Public Tunnel Gateway
 * =============================
 * Creates an instant, secure public HTTPS URL for your AI Server (Port 5000)
 * Allows remote ESP32-CAMs and mobile phones anywhere in the world to connect.
 * 
 * Run with: npm run tunnel
 */

import localtunnel from 'localtunnel';

const PORT = 5000;

(async () => {
  console.log('=======================================================');
  console.log(`🌾 EcoEcho Remote Field Gateway - Opening Tunnel on Port ${PORT}...`);
  console.log('=======================================================\n');

  try {
    const tunnel = await localtunnel({ port: PORT });

    console.log('🚀 PUBLIC HTTPS TUNNEL IS LIVE!');
    console.log(`🔗 Public URL: ${tunnel.url}`);
    console.log(`📡 Forwarding to: http://127.0.0.1:${PORT}\n`);
    console.log('-------------------------------------------------------');
    console.log('📱 FOR MOBILE DASHBOARD:');
    console.log(`   In EcoEcho Settings -> AI Server URL: ${tunnel.url}`);
    console.log('\n📷 FOR REMOTE ESP32-CAM (esp32_cam_remote_stream.ino):');
    console.log(`   const char* serverUrl = "${tunnel.url}/api/detect";`);
    console.log('-------------------------------------------------------\n');
    console.log('Press Ctrl+C to close the tunnel.\n');

    tunnel.on('close', () => {
      console.log('🛑 Tunnel closed.');
    });

    tunnel.on('error', (err) => {
      console.error('⚠️ Tunnel error:', err);
    });

  } catch (err) {
    console.error('❌ Failed to create tunnel:', err);
  }
})();
