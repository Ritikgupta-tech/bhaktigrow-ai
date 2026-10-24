import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CalendarEntry } from '../types';
import { safeGetItem, safeSetItem, STORAGE_KEYS } from '../lib/storage';
import { SEED_CALENDAR_ENTRIES } from '../data/seedData';
import { api } from '../lib/apiClient';
import { useAuth } from './AuthContext';

interface CalendarContextType {
  entries: CalendarEntry[];
  addEntry: (entry: Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'>) => CalendarEntry;
  updateEntry: (id: string, updates: Partial<CalendarEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => CalendarEntry | undefined;
  resetToDefaults: () => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const [entries, setEntries] = useState<CalendarEntry[]>(() => {
    const stored = safeGetItem<CalendarEntry[]>(STORAGE_KEYS.CALENDAR_ENTRIES, []);
    if (!stored || stored.length === 0) {
      return SEED_CALENDAR_ENTRIES;
    }
    return stored;
  });

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.CALENDAR_ENTRIES, entries);
  }, [entries]);

  // Sync with MongoDB backend when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const fetchRemote = async () => {
      setSyncStatus('syncing');
      try {
        const res = await api.calendar.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          const remoteEntries: CalendarEntry[] = (res.data as any[]).map(doc => ({
            id: doc._id || doc.id,
            title: doc.title,
            platform: doc.platform || 'youtube',
            category: doc.category || 'Hanuman Chalisa',
            plannedDateTime: doc.scheduledDate ? new Date(doc.scheduledDate).toISOString() : new Date().toISOString(),
            status: (doc.status === 'published' ? 'Published Demo' : doc.status === 'scheduled' ? 'Scheduled Demo' : 'Draft'),
            notes: doc.auspiciousNotes || doc.notes || '',
            createdAt: doc.createdAt || new Date().toISOString(),
            updatedAt: doc.updatedAt || new Date().toISOString()
          }));

          setEntries(remoteEntries);
          setSyncStatus('synced');
        }
      } catch {
        if (isMounted) setSyncStatus('error');
      }
    };

    fetchRemote();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const addEntry = useCallback((entry: Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'>): CalendarEntry => {
    const newEntry: CalendarEntry = {
      ...entry,
      id: `cal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEntries(prev => [newEntry, ...prev]);

    if (isAuthenticated) {
      api.calendar.create(newEntry).catch(() => {});
    }

    return newEntry;
  }, [isAuthenticated]);

  const updateEntry = useCallback((id: string, updates: Partial<CalendarEntry>) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
          : entry
      )
    );

    if (isAuthenticated) {
      api.calendar.update(id, updates).catch(() => {});
    }
  }, [isAuthenticated]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));

    if (isAuthenticated) {
      api.calendar.delete(id).catch(() => {});
    }
  }, [isAuthenticated]);

  const getEntryById = useCallback((id: string): CalendarEntry | undefined => {
    return entries.find(e => e.id === id);
  }, [entries]);

  const resetToDefaults = useCallback(() => {
    setEntries(SEED_CALENDAR_ENTRIES);
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryById,
        resetToDefaults,
        syncStatus
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
