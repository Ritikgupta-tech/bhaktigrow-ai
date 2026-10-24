import { 
  CalendarEntry, 
  DevotionalCategory, 
  LibraryItem, 
  ResearchItem 
} from '../types';

export const DEVOTIONAL_CATEGORIES: DevotionalCategory[] = [
  'Hanuman Chalisa',
  'Shiva Mantra',
  'Krishna Bhajan',
  'Ram Bhakti',
  'Durga Stuti',
  'Ganesh Aarti',
  'Gayatri Mantra',
  'Vishnu Mantra',
  'Meditation',
  'Devotional Stories',
  'Morning Prayers',
  'Evening Aarti',
  'Other'
];

/**
 * Seed Research Items with strictly labeled evidenceStatus
 * Marked clearly as illustrative or editorial demo research data
 */
export const SEED_RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: 'res-1',
    term: 'Hanuman Chalisa Fast Chanting 11 Times',
    category: 'Hanuman Chalisa',
    platform: 'youtube',
    language: 'Hindi',
    searchIntent: 'Devotional Practice',
    contentGapIdea: 'Most existing videos lack on-screen synchronized Sanskrit/Hindi lyrics with clear English pronunciation for diaspora youth.',
    editorialAngle: 'Paced for morning commutes: clear, steady, rhythm-focused recitation with modern minimalist audio engineering.',
    suggestedConcept: '11 Repetitions with audio bead counter (Mala indicator) and morning sunrise ambiance.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 94
  },
  {
    id: 'res-2',
    term: 'Maha Mrityunjaya Mantra 108 Times Healing',
    category: 'Shiva Mantra',
    platform: 'youtube',
    language: 'Sanskrit',
    searchIntent: 'Meditation',
    contentGapIdea: 'Seekers search for acoustic bell resonance and quiet 432Hz tuning rather than loud synthesizer tracks.',
    editorialAngle: 'Deep acoustic resonance with authentic Himalayan bell chimes and quiet breathing intervals.',
    suggestedConcept: '108 Recitations with calm counting bead animation and tranquil dark indigo temple aesthetic.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 88
  },
  {
    id: 'res-3',
    term: 'Krishna Flute Morning Meditation for Calm Mind',
    category: 'Krishna Bhajan',
    platform: 'instagram',
    language: 'Hindi',
    searchIntent: 'Meditation',
    contentGapIdea: 'Short-form Reels rarely provide peaceful looping audio without voiceovers or intrusive text banners.',
    editorialAngle: 'Pure acoustic bamboo flute melody set against early morning Vrindavan forest atmosphere.',
    suggestedConcept: '15-second ambient loop with soft golden lotus petal falling animation and single grounding thought.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 82
  },
  {
    id: 'res-4',
    term: 'Ram Raksha Stotra Meaning in Simple Hindi',
    category: 'Ram Bhakti',
    platform: 'youtube',
    language: 'Hindi',
    searchIntent: 'Informational',
    contentGapIdea: 'Many videos chant rapidly without explaining how Sri Ram Raksha Stotra protects against mental stress.',
    editorialAngle: 'Educational verse-by-verse breakdown highlighting how ancient verses correspond to inner mental armor.',
    suggestedConcept: 'Explainer series with clean infographics and word-by-word meaning cards.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 76
  },
  {
    id: 'res-5',
    term: 'Aigiri Nandini Durga Stuti High Energy',
    category: 'Durga Stuti',
    platform: 'instagram',
    language: 'Sanskrit',
    searchIntent: 'Devotional Practice',
    contentGapIdea: 'Reels often clip abruptly; creators need seamless 30-second rhythmic loops for Navratri and Friday devotion.',
    editorialAngle: 'Dynamic traditional percussion (dhol/damru) highlighting divine feminine strength and willpower.',
    suggestedConcept: 'Vertical reel featuring bold crimson typography and synchronized drum beats.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 91
  },
  {
    id: 'res-6',
    term: 'Jai Ganesh Deva Evening Aarti Family Singalong',
    category: 'Ganesh Aarti',
    platform: 'facebook',
    language: 'Hindi',
    searchIntent: 'Ritual / Pooja',
    contentGapIdea: 'Facebook families share videos that include large, easy-to-read lyrics so children and grandparents can sing along together.',
    editorialAngle: 'Warm, communal temple atmosphere with brass bell resonance and clear karaoke-style lyrical highlight.',
    suggestedConcept: '16:9 family evening pooja video with warm marigold borders and large Devanagari lyrics.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 85
  },
  {
    id: 'res-7',
    term: 'Gayatri Mantra 21 Times for Focus & Students',
    category: 'Gayatri Mantra',
    platform: 'youtube',
    language: 'Hindi',
    searchIntent: 'Devotional Practice',
    contentGapIdea: 'Students seek short study-session chants with gentle ambient alpha waves and no sudden loud cymbals.',
    editorialAngle: 'Gentle morning clarity session tailored for exams, focus, and quiet dawn awakening.',
    suggestedConcept: '21 gentle recitations with calm sunrise time-lapse and study encouragement note in pinned comment.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 79
  },
  {
    id: 'res-8',
    term: 'Vishnu Sahasranamam Simplified Benefits',
    category: 'Vishnu Mantra',
    platform: 'facebook',
    language: 'English',
    searchIntent: 'Informational',
    contentGapIdea: 'Diaspora seekers want to understand the life lessons hidden in Sri Vishnu’s 1,000 divine names.',
    editorialAngle: 'Relatable lifestyle lessons drawn from sacred names like Shantakaram and Padmanabham.',
    suggestedConcept: 'Micro-documentary series on finding peace amid career uncertainty.',
    evidenceStatus: 'editorial',
    sourceUrl: null,
    retrievedAt: null,
    sampleVolumeScore: 68
  }
];

/**
 * Curated Bhakti Content Library items
 */
export const SEED_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib-1',
    topic: 'Hanuman Chalisa: 5 Chaupais That Give Unshakable Courage',
    category: 'Hanuman Chalisa',
    potentialAudience: 'Youth, working professionals, and devotees seeking inner strength',
    suggestedFormat: 'YouTube Long-form',
    searchKeywords: ['Hanuman Chalisa courage', 'Sankat Te Hanuman Chhudavai', 'Bhakti confidence'],
    creativeAngle: 'Focus on overcoming fear and self-doubt through contemplative chanting.',
    suggestedHook: 'Whenever you feel anxiety creeping in, these 5 verses act like a shield for your mind.',
    sampleDescription: 'A devotional reflection on how Sri Hanuman Chalisa instills unwavering courage in modern daily challenges.'
  },
  {
    id: 'lib-2',
    topic: 'Shiva Dhun: 15-Minute Inner Silence Chanting',
    category: 'Shiva Mantra',
    potentialAudience: 'Seekers of meditation, yoga practitioners, and evening relaxation lovers',
    suggestedFormat: 'YouTube Long-form',
    searchKeywords: ['Om Namah Shivaya meditation', 'Shiva dhun calm', 'evening peaceful chants'],
    creativeAngle: 'Slow, hypnotic, grounding repetition designed to lower cortisol and induce tranquility.',
    suggestedHook: 'Sit back, close your eyes, and let this ancient vibration quiet your mental storm.',
    sampleDescription: 'Gentle acoustic recitation of Om Namah Shivaya tuned to natural harmonic resonance for restorative calm.'
  },
  {
    id: 'lib-3',
    topic: 'Radha Krishna Bhajan: The Purest Essence of Surrender',
    category: 'Krishna Bhajan',
    potentialAudience: 'Devotees of Sri Radha Krishna, families, and morning prayer seekers',
    suggestedFormat: 'Instagram Reel',
    searchKeywords: ['Krishna bhajan', 'Radha Krishna bhakti', 'morning prayer Vrindavan'],
    creativeAngle: 'Joyful, heart-centered melody celebrating unconditional divine love.',
    suggestedHook: 'Let this sweet melody remind you that devotion is simply love without conditions.',
    sampleDescription: 'A soulful Krishna bhajan highlighting divine surrender and joy for daily devotion.'
  },
  {
    id: 'lib-4',
    topic: 'The Story of Shabari’s Devotion: Love Beyond Formal Rituals',
    category: 'Devotional Stories',
    potentialAudience: 'Families, children, and seekers seeking emotional inspiration',
    suggestedFormat: 'Facebook Video',
    searchKeywords: ['Shabari Ram katha', 'Devotional stories Hindi', 'Ram bhakti simplicity'],
    creativeAngle: 'Narrative storytelling showing that purity of heart matters more than lavish offerings.',
    suggestedHook: 'Lord Ram did not look for gold or royal banquets; He came looking for Shabari’s pure berries.',
    sampleDescription: 'An inspiring devotional retelling of Mother Shabari’s patient faith and Lord Ram’s compassion.'
  },
  {
    id: 'lib-5',
    topic: 'Ganesh Aarti: Welcoming Auspicious Beginnings and Removing Obstacles',
    category: 'Ganesh Aarti',
    potentialAudience: 'Families starting new ventures, students, and festive gatherings',
    suggestedFormat: 'Instagram Reel',
    searchKeywords: ['Ganesh aarti morning', 'Jai Ganesh Deva lyrics', 'Vighnaharta blessings'],
    creativeAngle: 'Uplifting festive energy with brass bells and traditional singing.',
    suggestedHook: 'Before starting any new venture, take 30 seconds to seek Sri Ganesha’s blessings.',
    sampleDescription: 'Traditional Ganesh Aarti rendered with heartfelt harmony to clear obstacles and bring clarity.'
  },
  {
    id: 'lib-6',
    topic: 'Gayatri Mantra for Mindful Awakening: 11 Morning Breaths',
    category: 'Gayatri Mantra',
    potentialAudience: 'Morning routine seekers, students, and mindfulness enthusiasts',
    suggestedFormat: 'YouTube Shorts',
    searchKeywords: ['Gayatri Mantra morning routine', 'Daily focus chants', 'Surya Gayatri'],
    creativeAngle: 'Integrates sacred chanting with mindful diaphragmatic breathing.',
    suggestedHook: 'Replace your morning alarm with this sacred sunrise invocation.',
    sampleDescription: 'Eleven gentle repetitions of the Gayatri Mantra to illuminate intellect and welcome dawn tranquility.'
  },
  {
    id: 'lib-7',
    topic: 'Durga Kavach: Spiritual Protection for Your Family',
    category: 'Durga Stuti',
    potentialAudience: 'Mothers, families, and Navratri devotees',
    suggestedFormat: 'YouTube Long-form',
    searchKeywords: ['Durga Kavach path', 'Maa Durga raksha', 'Sacred protection stuti'],
    creativeAngle: 'Solemn, powerful traditional recitation invoking motherly protection.',
    suggestedHook: 'A mother’s protective prayer: why Durga Kavach is chanted for family well-being.',
    sampleDescription: 'Recitation of the sacred Durga Kavach to invoke spiritual peace and ward off negative energies.'
  },
  {
    id: 'lib-8',
    topic: 'Evening Sandhya Aarti: Releasing the Day’s Fatigue',
    category: 'Evening Aarti',
    potentialAudience: 'Household devotees and evening prayer communities',
    suggestedFormat: 'Facebook Video',
    searchKeywords: ['Sandhya aarti', 'Evening prayer peace', 'Home temple peaceful routine'],
    creativeAngle: 'Cosy, comforting twilight pooja setting with flickering oil lamps.',
    suggestedHook: 'As dusk falls, light the evening diya and surrender the day’s worries.',
    sampleDescription: 'A serene evening aarti sequence designed for quiet reflection with family before dinner.'
  }
];

/**
 * Seed Calendar Entries
 * Clearly labeled as demo planning entries
 */
export const SEED_CALENDAR_ENTRIES: CalendarEntry[] = [
  {
    id: 'cal-1',
    title: 'Tuesday Morning Hanuman Chalisa (11 Chants)',
    platform: 'youtube',
    category: 'Hanuman Chalisa',
    plannedDateTime: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    status: 'Scheduled Demo',
    notes: 'Include Sanskrit subtitles and mala bead visual counter.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cal-2',
    title: 'Instagram Reel: 30-Sec Shiva Serenity Loop',
    platform: 'instagram',
    category: 'Shiva Mantra',
    plannedDateTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'Draft',
    notes: 'Focus on calming 432Hz bell chimes and subtle mandala animation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cal-3',
    title: 'Facebook Family Aarti: Jai Ganesh Deva',
    platform: 'facebook',
    category: 'Ganesh Aarti',
    plannedDateTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'Draft',
    notes: 'Large Devanagari lyrics overlay for family singalong.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cal-4',
    title: 'Radha Krishna Morning Bhajan Video',
    platform: 'youtube',
    category: 'Krishna Bhajan',
    plannedDateTime: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'Published Demo',
    notes: 'Demo entry showing published status.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cal-5',
    title: 'Ram Bhakti Evening Story: The Bridge of Stones',
    platform: 'facebook',
    category: 'Ram Bhakti',
    plannedDateTime: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'Draft',
    notes: 'Community engagement question on family bedtime stories.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
