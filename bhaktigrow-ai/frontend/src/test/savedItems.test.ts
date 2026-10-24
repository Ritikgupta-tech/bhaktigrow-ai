import { describe, it, expect, beforeEach } from 'vitest';
import { safeGetItem, safeSetItem, STORAGE_KEYS } from '../lib/storage';
import { Suggestion } from '../types';

describe('Saved Items Shared Store & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const dummySuggestion: Suggestion = {
    id: 'test-yt-seo-1',
    platform: 'youtube',
    strategy: 'search-seo',
    strategyLabel: 'Search-Focused SEO',
    title: 'Peaceful Hanuman Chalisa Morning Chants',
    hook: 'Start your morning with spiritual energy.',
    description: 'Reciting Hanuman Chalisa brings peace and removes obstacles.',
    hashtags: ['#HanumanChalisa', '#Bhakti'],
    searchKeywords: ['Hanuman Chalisa', 'Morning prayer'],
    thumbnailIdea: 'Golden diya glowing against a dark blue temple silhouette.',
    thumbnailHeadline: 'PEACE & STRENGTH',
    cta: 'Subscribe for daily prayers.',
    targetAudience: 'Devotees of Bajrangbali',
    contentFormat: 'YouTube Long-form',
    editorialRationale: 'Designed for daily routine search discovery.',
    evidenceStatus: 'editorial',
    createdAt: new Date().toISOString()
  };

  it('saves an item and persists to localStorage', () => {
    const list = [dummySuggestion];
    safeSetItem(STORAGE_KEYS.SAVED_ITEMS, list);

    const retrieved = safeGetItem<Suggestion[]>(STORAGE_KEYS.SAVED_ITEMS, []);
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].title).toBe('Peaceful Hanuman Chalisa Morning Chants');
  });

  it('prevents duplicate items when saving by unique id', () => {
    const currentList: Suggestion[] = [dummySuggestion];
    
    // Simulate save logic with deduplication
    const saveNew = (item: Suggestion, existing: Suggestion[]) => {
      if (existing.some(e => e.id === item.id)) return existing;
      return [item, ...existing];
    };

    const attempt1 = saveNew(dummySuggestion, currentList);
    expect(attempt1).toHaveLength(1);

    const newSuggestion: Suggestion = { ...dummySuggestion, id: 'test-ig-hook-2' };
    const attempt2 = saveNew(newSuggestion, currentList);
    expect(attempt2).toHaveLength(2);
  });

  it('recovers gracefully from malformed localStorage data', () => {
    localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, '{invalid_json--corrupted');
    const recovered = safeGetItem<Suggestion[]>(STORAGE_KEYS.SAVED_ITEMS, []);
    expect(recovered).toEqual([]);
  });
});
