import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserPreferences } from '../types';
import { safeGetItem, safeSetItem, safeRemoveItem, STORAGE_KEYS } from '../lib/storage';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  preferredLanguage: 'Hindi',
  defaultPlatforms: ['youtube', 'instagram', 'facebook'],
  defaultTone: 'Reverent',
  reducedMotion: false
};

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetAllData: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return safeGetItem<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  });

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.PREFERENCES, preferences);
    // Apply reduced motion to HTML if requested
    if (preferences.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [preferences]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const resetAllData = useCallback(() => {
    safeRemoveItem(STORAGE_KEYS.SAVED_ITEMS);
    safeRemoveItem(STORAGE_KEYS.CALENDAR_ENTRIES);
    safeRemoveItem(STORAGE_KEYS.RECENT_STUDIO);
    safeRemoveItem(STORAGE_KEYS.PREFERENCES);
    setPreferences(DEFAULT_PREFERENCES);
    window.location.reload();
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetAllData
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
