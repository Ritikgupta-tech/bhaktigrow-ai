import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Suggestion } from '../types';
import { safeGetItem, safeSetItem, STORAGE_KEYS } from '../lib/storage';
import { api } from '../lib/apiClient';
import { useAuth } from './AuthContext';

interface SavedItemsContextType {
  savedItems: Suggestion[];
  saveItem: (item: Suggestion) => boolean;
  unsaveItem: (id: string) => void;
  isSaved: (id: string) => boolean;
  updateSavedItem: (id: string, updates: Partial<Suggestion>) => void;
  clearAllSaved: () => void;
  totalSavedCount: number;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const [savedItems, setSavedItems] = useState<Suggestion[]>(() => {
    return safeGetItem<Suggestion[]>(STORAGE_KEYS.SAVED_ITEMS, []);
  });

  // Sync to localStorage always for offline support
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SAVED_ITEMS, savedItems);
  }, [savedItems]);

  // Sync with MongoDB backend when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const fetchRemote = async () => {
      setSyncStatus('syncing');
      try {
        const res = await api.suggestions.getAll();
        if (res.success && Array.isArray(res.data) && isMounted) {
          const remoteItems: Suggestion[] = (res.data as any[]).map(doc => ({
            id: doc.suggestionId || doc._id,
            platform: doc.platform || 'youtube',
            strategy: doc.strategy || 'search-seo',
            strategyLabel: doc.strategyLabel || doc.strategyAngle || 'Devotional Strategy',
            title: doc.title,
            hook: doc.hook || '',
            description: doc.description || '',
            hashtags: doc.hashtags || [],
            searchKeywords: doc.searchKeywords || [],
            thumbnailIdea: doc.thumbnailIdea || doc.thumbnailConcept?.visualPrompt || 'Sacred devotional scene',
            thumbnailHeadline: doc.thumbnailHeadline || doc.thumbnailConcept?.textOverlay || doc.title,
            cta: doc.cta || doc.callToAction || 'Subscribe for daily prayers',
            targetAudience: doc.targetAudience || 'Devotees and spiritual seekers',
            contentFormat: doc.contentFormat || 'Devotional Video',
            editorialRationale: doc.editorialRationale || doc.editorialRecommendation || 'Optimized for devotional discoverability',
            evidenceStatus: doc.evidenceStatus || 'editorial',
            createdAt: doc.createdAt || new Date().toISOString()
          }));

          // Merge local and remote
          setSavedItems(prev => {
            const map = new Map<string, Suggestion>();
            // Add remote items first
            remoteItems.forEach(item => map.set(item.id, item));
            // Add local items
            prev.forEach(item => {
              if (!map.has(item.id)) {
                map.set(item.id, item);
                // Also asynchronously save local item to remote
                api.suggestions.save(item).catch(() => {});
              }
            });
            return Array.from(map.values());
          });
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

  const isSaved = useCallback((id: string): boolean => {
    return savedItems.some(item => item.id === id);
  }, [savedItems]);

  const saveItem = useCallback((item: Suggestion): boolean => {
    let wasAdded = false;
    setSavedItems(prev => {
      if (prev.some(existing => existing.id === item.id)) {
        return prev;
      }
      wasAdded = true;
      return [item, ...prev];
    });

    // Cloud save if authenticated
    if (isAuthenticated) {
      api.suggestions.save(item).catch(() => {});
    }

    return wasAdded;
  }, [isAuthenticated]);

  const unsaveItem = useCallback((id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    if (isAuthenticated) {
      api.suggestions.delete(id).catch(() => {});
    }
  }, [isAuthenticated]);

  const updateSavedItem = useCallback((id: string, updates: Partial<Suggestion>) => {
    setSavedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
    if (isAuthenticated) {
      api.suggestions.update(id, updates).catch(() => {});
    }
  }, [isAuthenticated]);

  const clearAllSaved = useCallback(() => {
    setSavedItems([]);
    if (isAuthenticated) {
      api.suggestions.clearAll().catch(() => {});
    }
  }, [isAuthenticated]);

  return (
    <SavedItemsContext.Provider
      value={{
        savedItems,
        saveItem,
        unsaveItem,
        isSaved,
        updateSavedItem,
        clearAllSaved,
        totalSavedCount: savedItems.length,
        syncStatus
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
};

export function useSavedItems(): SavedItemsContextType {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
}
