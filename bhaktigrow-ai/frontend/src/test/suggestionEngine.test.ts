import { describe, it, expect } from 'vitest';
import { generateSuggestions, suggestionEngine } from '../lib/suggestionEngine';
import { StudioFormInput } from '../types';

describe('Local Content Suggestion Engine', () => {
  const sampleInput: StudioFormInput = {
    videoTitle: 'Sacred Hanuman Chalisa for Strength and Courage',
    category: 'Hanuman Chalisa',
    language: 'Hindi',
    videoFormat: 'YouTube Long-form',
    platforms: ['youtube'],
    primaryKeywords: 'Hanuman Chalisa, Bajrangbali Aarti, Sankat Mochan',
    targetAudience: 'Daily morning prayer devotees',
    tone: 'Reverent'
  };

  it('generates exactly 5 suggestions for a single platform', () => {
    const results = generateSuggestions(sampleInput, ['youtube']);
    expect(results).toHaveLength(5);
    expect(results.every(r => r.platform === 'youtube')).toBe(true);
  });

  it('generates exactly 10 suggestions for two platforms', () => {
    const results = generateSuggestions(sampleInput, ['youtube', 'instagram']);
    expect(results).toHaveLength(10);
    const ytCount = results.filter(r => r.platform === 'youtube').length;
    const igCount = results.filter(r => r.platform === 'instagram').length;
    expect(ytCount).toBe(5);
    expect(igCount).toBe(5);
  });

  it('generates exactly 15 suggestions when all three platforms are selected', () => {
    const results = generateSuggestions(sampleInput, ['youtube', 'instagram', 'facebook']);
    expect(results).toHaveLength(15);
    expect(results.filter(r => r.platform === 'youtube')).toHaveLength(5);
    expect(results.filter(r => r.platform === 'instagram')).toHaveLength(5);
    expect(results.filter(r => r.platform === 'facebook')).toHaveLength(5);
  });

  it('contains all 5 distinct strategies per platform', () => {
    const expectedStrategies = [
      'search-seo',
      'curiosity-hook',
      'emotional-story',
      'community-engagement',
      'calm-meditative'
    ];

    for (const platform of ['youtube', 'instagram', 'facebook'] as const) {
      const results = generateSuggestions(sampleInput, [platform]);
      const strategies = results.map(r => r.strategy);
      expect(strategies).toEqual(expectedStrategies);
    }
  });

  it('has no duplicate titles or hooks within the same platform result set', () => {
    for (const platform of ['youtube', 'instagram', 'facebook'] as const) {
      const results = generateSuggestions(sampleInput, [platform]);
      const titles = results.map(r => r.title.trim().toLowerCase());
      const hooks = results.map(r => r.hook.trim().toLowerCase());
      
      const uniqueTitles = new Set(titles);
      const uniqueHooks = new Set(hooks);

      expect(uniqueTitles.size).toBe(5);
      expect(uniqueHooks.size).toBe(5);
    }
  });

  it('handles sparse input gracefully without crashing or returning empty placeholders', () => {
    const sparseInput: StudioFormInput = {
      videoTitle: '',
      category: 'Shiva Mantra',
      language: 'English',
      videoFormat: 'Instagram Reel',
      platforms: ['instagram'],
      primaryKeywords: '',
      targetAudience: '',
      tone: 'Peaceful/Meditative'
    };

    const results = generateSuggestions(sparseInput, ['instagram']);
    expect(results).toHaveLength(5);
    results.forEach(s => {
      expect(s.title).toBeTruthy();
      expect(s.hook).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.hashtags.length).toBeGreaterThan(0);
      expect(s.searchKeywords.length).toBeGreaterThan(0);
      expect(s.thumbnailIdea).toBeTruthy();
      expect(s.thumbnailHeadline).toBeTruthy();
      expect(s.cta).toBeTruthy();
      expect(s.targetAudience).toBeTruthy();
      expect(s.editorialRationale).toBeTruthy();
      expect(s.evidenceStatus).toBe('editorial');
    });
  });

  it('is deterministic for initial generation with the same input', () => {
    const run1 = generateSuggestions(sampleInput, ['youtube']);
    const run2 = generateSuggestions(sampleInput, ['youtube']);

    expect(run1[0].title).toBe(run2[0].title);
    expect(run1[0].hook).toBe(run2[0].hook);
    expect(run1[0].description).toBe(run2[0].description);
  });

  it('regenerates a single suggestion preserving its strategy', () => {
    const initial = generateSuggestions(sampleInput, ['youtube']);
    const target = initial[0]; // search-seo
    
    const regenerated = suggestionEngine.regenerate(target.id, initial, sampleInput);
    expect(regenerated.strategy).toBe(target.strategy);
    expect(regenerated.platform).toBe(target.platform);
    expect(regenerated.id).not.toBe(target.id);
  });

  it('provides platform-specific metadata', () => {
    const yt = generateSuggestions(sampleInput, ['youtube']);
    expect(yt[0].tags).toBeDefined();
    expect(yt[0].pinnedComment).toBeDefined();

    const ig = generateSuggestions(sampleInput, ['instagram']);
    expect(ig[0].onScreenText).toBeDefined();
    expect(ig[0].subtitleGuidance).toBeDefined();
    expect(ig[0].reelCoverText).toBeDefined();

    const fb = generateSuggestions(sampleInput, ['facebook']);
    expect(fb[0].communityAngle).toBeDefined();
    expect(fb[0].pinnedComment).toBeDefined();
  });
});
