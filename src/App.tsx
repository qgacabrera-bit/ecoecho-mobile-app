import React from 'react';
import { DeviceProvider, useDevice } from './context/DeviceContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useDevice();

  return (
    <AppLayout>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'analytics' && <AnalyticsPage />}
      {activeTab === 'about' && <AboutPage />}
      {activeTab === 'support' && <SupportPage />}
      {activeTab === 'settings' && <SettingsPage />}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <DeviceProvider>
      <AppContent />
    </DeviceProvider>
  );
};

export default App;
