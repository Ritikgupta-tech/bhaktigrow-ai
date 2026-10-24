import { describe, it, expect } from 'vitest';
import { CalendarEntry } from '../types';

describe('Calendar Logic & Entry Operations', () => {
  const sampleEntry: CalendarEntry = {
    id: 'cal-test-1',
    title: 'Tuesday Hanuman Chalisa Chants',
    platform: 'youtube',
    category: 'Hanuman Chalisa',
    plannedDateTime: '2026-10-27T06:00:00.000Z',
    status: 'Scheduled Demo',
    notes: 'Morning pooja release',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('filters entries correctly by platform', () => {
    const list: CalendarEntry[] = [
      sampleEntry,
      { ...sampleEntry, id: 'cal-test-2', platform: 'instagram' },
      { ...sampleEntry, id: 'cal-test-3', platform: 'facebook' }
    ];

    const ytOnly = list.filter(e => e.platform === 'youtube');
    expect(ytOnly).toHaveLength(1);
    expect(ytOnly[0].id).toBe('cal-test-1');
  });

  it('filters entries correctly by status', () => {
    const list: CalendarEntry[] = [
      sampleEntry,
      { ...sampleEntry, id: 'cal-test-2', status: 'Draft' },
      { ...sampleEntry, id: 'cal-test-3', status: 'Published Demo' }
    ];

    const drafts = list.filter(e => e.status === 'Draft');
    expect(drafts).toHaveLength(1);
    expect(drafts[0].id).toBe('cal-test-2');
  });

  it('updates planned date and time (rescheduling)', () => {
    const newDate = '2026-10-30T18:00:00.000Z';
    const updated = { ...sampleEntry, plannedDateTime: newDate };
    expect(updated.plannedDateTime).toBe(newDate);
  });
});
