import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  offlineMode: boolean;
  autoSync: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (key: keyof Settings, value: boolean) => void;
  toggleDarkMode: () => void;
}

const defaultSettings: Settings = {
  darkMode: false,
  notifications: true,
  sound: true,
  vibration: true,
  offlineMode: false,
  autoSync: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('kishu-settings', defaultSettings);

  // Apply dark mode on mount and change
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const updateSettings = (key: keyof Settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleDarkMode = () => {
    updateSettings('darkMode', !settings.darkMode);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
