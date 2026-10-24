import { 
  Platform, 
  StrategyType, 
  StudioFormInput, 
  Suggestion, 
  SuggestionProvider,
  ContentLanguage 
} from '../types';

export const STRATEGY_METADATA: Record<StrategyType, { label: string; description: string }> = {
  'search-seo': {
    label: 'Search-Focused SEO',
    description: 'High-intent devotional keywords, high-clarity title, and structured metadata for search discovery.'
  },
  'curiosity-hook': {
    label: 'Curiosity-Driven Hook',
    description: 'Thought-provoking spiritual inquiry that highlights spiritual significance without sensationalism.'
  },
  'emotional-story': {
    label: 'Emotional Storytelling',
    description: 'Heart-centered devotional narrative emphasizing surrender, bhakti, divine grace, and solace.'
  },
  'community-engagement': {
    label: 'Community Engagement',
    description: 'Interactive spiritual reflections, prayer intentions, and community-driven chants.'
  },
  'calm-meditative': {
    label: 'Calm & Meditative',
    description: 'Tranquil, grounding spiritual resonance designed for quiet contemplation, peace, and mindfulness.'
  }
};

const STRATEGY_ORDER: StrategyType[] = [
  'search-seo',
  'curiosity-hook',
  'emotional-story',
  'community-engagement',
  'calm-meditative'
];

/**
 * Clean and normalize keywords
 */
function extractKeywords(input: StudioFormInput): string[] {
  const primary = (input.primaryKeywords || '')
    .split(/[,;\n]+/)
    .map(k => k.trim())
    .filter(Boolean);
  const secondary = (input.secondaryKeywords || '')
    .split(/[,;\n]+/)
    .map(k => k.trim())
    .filter(Boolean);
  
  const combined = [...primary, ...secondary];
  if (combined.length === 0) {
    return [
      input.category,
      `${input.category} Bhakti`,
      'Daily Prayer',
      'Peaceful Chants',
      'Spiritual Growth'
    ];
  }
  return combined;
}

/**
 * Deterministic hash from string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Language greeting & ending terms
 */
function getLanguageNuances(language: ContentLanguage) {
  switch (language) {
    case 'Hindi':
      return {
        invocation: '॥ ॐ श्री गणेशाय नमः ॥',
        greeting: 'जय श्री राम | हर हर महादेव',
        call: 'कमेंट में अपनी प्रार्थना या "हर हर महादेव" अवश्य लिखें।',
        blessing: 'ईश्वर की कृपा आप और आपके परिवार पर सदा बनी रहे।',
        share: 'इस भक्ति भाव को अपने प्रियजनों के साथ अवश्य साझा करें।'
      };
    case 'Sanskrit':
      return {
        invocation: '॥ ॐ तत्सत् ॥',
        greeting: 'सर्वे भवन्तु सुखिनः',
        call: 'टिप्पणीपुटे "ॐ नमः शिवाय" अथवा स्वप्रार्थनाम् लिखन्तु।',
        blessing: 'शुभं भवतु, कल्याणं भवतु।',
        share: 'सदाचार-भक्ति-प्रसारार्थं सङ्कल्पं कुर्मः।'
      };
    case 'Hinglish':
      return {
        invocation: 'Om Shanti & Har Har Mahadev',
        greeting: 'Pranam & Welcome to sacred bhakti moments',
        call: 'Drop "Jai Shree Ram" or your prayer intention in the comments below.',
        blessing: 'May divine blessings bring peace, strength and prosperity to your home.',
        share: 'Share this devotional energy with your family and WhatsApp spiritual groups.'
      };
    default:
      return {
        invocation: 'Sacred Devotional Chants & Prayers',
        greeting: 'Divine Blessings & Peace to All',
        call: 'Share your sincere prayer or reflection in the comments below.',
        blessing: 'May this sacred remembrance fill your day with serenity, strength, and grace.',
        share: 'Share this spiritual devotion with those seeking tranquility today.'
      };
  }
}

/**
 * Core builder for a single suggestion
 */
function buildSuggestion(
  input: StudioFormInput,
  platform: Platform,
  strategy: StrategyType,
  variantIndex: number = 0
): Suggestion {
  const topic = input.videoTitle.trim() || input.category;
  const category = input.category;
  const keywords = extractKeywords(input);
  const primaryKw = keywords[0] || category;
  const secondaryKw = keywords[1] || `${category} Daily`;
  const nuances = getLanguageNuances(input.language);
  const toneDesc = input.tone || 'Reverent';

  // Deterministic seed
  const seed = hashString(`${topic}-${category}-${platform}-${strategy}-${variantIndex}`);

  let title = '';
  let hook = '';
  let description = '';
  let hashtags: string[] = [];
  let thumbnailIdea = '';
  let thumbnailHeadline = '';
  let cta = '';
  let targetAudience = input.targetAudience || 'Devotees, seekers, and families practicing daily prayer';
  let editorialRationale = '';
  let pinnedComment = '';
  let tags: string[] = [];
  let onScreenText = '';
  let subtitleGuidance = '';
  let reelCoverText = '';
  let communityAngle = '';

  // Tailor based on Platform and Strategy
  if (platform === 'youtube') {
    hashtags = [
      `#${category.replace(/\s+/g, '')}`,
      `#${primaryKw.replace(/[^a-zA-Z0-9]/g, '')}`,
      '#BhaktiSangrah',
      '#DailyPrayer',
      '#SanatanDharma',
      '#SpiritualPeace'
    ];
    tags = [
      category,
      primaryKw,
      secondaryKw,
      `${category} full path`,
      `${category} peaceful chanting`,
      'morning prayer for positive energy',
      'devotional peace',
      `${input.language} bhakti`
    ];

    switch (strategy) {
      case 'search-seo':
        title = variantIndex === 0
          ? `${topic} | Complete ${category} Chanting & Meaning (${input.language})`
          : `Most Peaceful ${topic} — ${primaryKw} for Daily Peace & Prosperity`;
        hook = `Looking for peace and positive spiritual energy? Immerse yourself in ${topic}.`;
        description = `${nuances.invocation}\n\nExperience the divine resonance of ${topic}. This recitation of ${category} is rendered with utmost devotion (${toneDesc.toLowerCase()} tone) to invite spiritual clarity, dispel negativity, and awaken inner calm.\n\n✨ Focus Keywords: ${keywords.slice(0, 4).join(', ')}\n\n🙏 ${nuances.blessing}\n\n🔔 Subscribe to our devotional channel for daily spiritual guidance, aartis, and authentic mantras.\n\n${nuances.call}`;
        thumbnailHeadline = `DIVINE PEACE\n${category.toUpperCase()}`;
        thumbnailIdea = `Deep spiritual background with golden diya warm radiance, subtle lotus silhouette, saffron accents, and high-contrast bold typography: "${thumbnailHeadline}".`;
        cta = `Subscribe for daily morning prayers and share your prayer in the comments below.`;
        editorialRationale = `Optimized for high-volume YouTube search terms around ${category} and daily peaceful chanting.`;
        pinnedComment = `🌸 ${nuances.greeting}! May this sacred ${category} bring profound peace to your heart. Which line or verse touches your soul the most? Let us chant together.`;
        break;

      case 'curiosity-hook':
        title = variantIndex === 0
          ? `The Spiritual Secret of ${topic}: Why Sages Recommend Reciting Daily`
          : `What Happens When You Listen to ${topic} With Full Devotion?`;
        hook = `Did you know that each vibration of ${category} transforms both mind and surroundings?`;
        description = `${nuances.invocation}\n\nWhy has ${topic} remained the cornerstone of devotional practice for generations? In this devotional video, experience the spiritual power and depth of ${category}.\n\nWhen recited with sincerity and reverence, divine vibrations cleanse anxiety and cultivate mental tranquility.\n\n🌿 Let this sacred audio play in your home during morning or evening prayers.\n\n${nuances.call}\n\n${nuances.blessing}`;
        thumbnailHeadline = `SACRED POWER\n${topic.slice(0, 24).toUpperCase()}`;
        thumbnailIdea = `Dramatic spiritual composition with soft golden halo lighting, subtle temple bells, serene devotional deity silhouette, and curiosity-provoking saffron overlay.`;
        cta = `Watch until the final chant and experience the wave of tranquility. Comment your reflection!`;
        editorialRationale = `Curiosity hook grounds the audience in genuine spiritual significance without resorting to false promises or clickbait.`;
        pinnedComment = `✨ Pure devotion needs no complicated rituals—only a pure heart. What spiritual shift did you feel while listening?`;
        break;

      case 'emotional-story':
        title = variantIndex === 0
          ? `In Times of Heavy Hearts, Turn to ${topic} — Solace & Divine Grace`
          : `Finding Strength Through Sincere Devotion: ${topic} (${category})`;
        hook = `Whenever life feels overwhelming, this sacred prayer reminds us that we are never alone.`;
        description = `${nuances.invocation}\n\nEvery soul walks through seasons of doubt, fatigue, and trial. In those quiet moments, surrender to the divine grace of ${category}.\n\nThis rendering of ${topic} is crafted as a sanctuary for your mind—a reminder that faith transforms hardship into resilience and peace.\n\n🕊️ Listen with closed eyes and let the warmth of bhakti envelop you.\n\n${nuances.call}\n\n${nuances.share}`;
        thumbnailHeadline = `HEALING FAITH\nDIVINE SOLACE`;
        thumbnailIdea = `Warm and comforting devotional imagery: a glowing earthen diya floating amidst peaceful waters and soft marigold petals, emphasizing divine comfort.`;
        cta = `If this prayer brought solace to your soul today, pass it along to a family member or friend in need of peace.`;
        editorialRationale = `Emotional storytelling taps deeply into the authentic seeker's desire for emotional shelter, comfort, and sincere surrender.`;
        pinnedComment = `❤️ Surrender every burden at the divine feet. May peace replace every worry in your life today. ॐ शान्तिः।`;
        break;

      case 'community-engagement':
        title = variantIndex === 0
          ? `Let's Chant Together: ${topic} Community Prayer for Global Peace`
          : `Joint Family Prayer: Reciting ${topic} Together For Prosperity & Harmony`;
        hook = `Leave your family's prayer in the comments—our devotional community chants as one.`;
        description = `${nuances.invocation}\n\nWelcome to our community satsang. When devotees come together with singular devotion, collective bhakti elevates every household.\n\nJoin us today in reciting ${topic}.\n\n💬 Community Question: From which city or temple are you chanting today? Share your family prayer request in the comment section.\n\n${nuances.call}\n\n${nuances.blessing}`;
        thumbnailHeadline = `COMMUNITY SATSANG\nCHANT TOGETHER`;
        thumbnailIdea = `Vibrant saffron and gold frame showing multiple traditional diyas together, symbolizing collective prayer, temple arches, and warm sacred light.`;
        cta = `Comment with your name and city to join our daily collective prayer circle.`;
        editorialRationale = `Designed to foster YouTube comment velocity and community bond, encouraging viewers to leave heartfelt prayers.`;
        pinnedComment = `🙏 Welcome to today's prayer circle. Type your prayer or family name below so we can keep each other in our prayers!`;
        break;

      case 'calm-meditative':
        title = variantIndex === 0
          ? `Deep Meditative Chanting: ${topic} for Inner Silence & Calm Sleep`
          : `15 Minutes of Pure Serenity: ${topic} (${category} Chants)`;
        hook = `Take a deep breath, release all daily tension, and let sacred silence speak through ${category}.`;
        description = `${nuances.invocation}\n\nDesigned specifically for quiet morning contemplation, evening relaxation, and mindful meditation.\n\nAllow the gentle rhythm of ${topic} to slow down overactive thoughts, ground your breath, and center your awareness on divine peace.\n\n🧘 Best experienced with headphones in a quiet space or as peaceful ambient sound in your prayer room.\n\n${nuances.blessing}`;
        thumbnailHeadline = `INNER SILENCE\nMEDITATIVE PEACE`;
        thumbnailIdea = `Deep midnight navy background with a luminous soft golden mandala and subtle water ripple effect, clean minimalist typography, no clutter.`;
        cta = `Bookmark or add this to your Daily Prayer playlist for peaceful mornings and restful nights.`;
        editorialRationale = `Targets mindfulness and meditation seekers who value stillness, calm pacing, and pristine auditory serenity.`;
        pinnedComment = `🌿 Close your eyes for three quiet breaths before you begin. May stillness and serenity stay with you throughout the day.`;
        break;
    }
  } else if (platform === 'instagram') {
    hashtags = [
      `#${category.replace(/\s+/g, '')}`,
      '#BhaktiReels',
      '#SanatanDharma',
      '#DailyDarshan',
      '#SpiritualReels',
      '#IndianDevotion',
      `#${primaryKw.replace(/[^a-zA-Z0-9]/g, '')}`,
      '#PositiveVibesOnly'
    ];

    switch (strategy) {
      case 'search-seo':
        title = `${topic} — Daily ${category} Chants`;
        hook = `Save this for your morning pooja routine 🪔`;
        description = `${nuances.invocation}\n\nStart your morning on the highest spiritual frequency with ${topic}.\n\nReciting ${category} cleanses the household aura and aligns your focus with inner strength.\n\n📌 Save this Reel so you never miss your daily prayer chant.\n\n${nuances.call}\n\n${hashtags.join(' ')}`;
        reelCoverText = `DAILY MORNING\n${category.toUpperCase()}`;
        thumbnailHeadline = `MORNING CHANT`;
        thumbnailIdea = `Vertical 9:16 portrait: Clean glowing diya center frame, gold sacred typography on top third, dark charcoal vignette for high readability on Reels feed.`;
        cta = `Double tap if you began your day with gratitude, and save for tomorrow's morning routine!`;
        onScreenText = `Start your morning with ${category} ✨\nListen with full devotion`;
        subtitleGuidance = `Bold saffron subtitle centered at 45% screen height with smooth word-by-word fade.`;
        editorialRationale = `Optimized for the Instagram Save metric and search discovery under devotional prayer hashtags.`;
        break;

      case 'curiosity-hook':
        title = `The Sacred Meaning Behind ${topic}`;
        hook = `Pause your scrolling for 15 seconds. This chant was meant for you today. 🌿`;
        description = `Nothing in devotion is a coincidence.\n\nIf ${topic} appeared on your feed, take it as a gentle reminder from the divine to slow down, breathe, and surrender your current anxiety.\n\nRepeat this sacred vibration of ${category} and feel peace settle into your heart.\n\n${nuances.blessing}\n\n${hashtags.join(' ')}`;
        reelCoverText = `WHY THIS CHANT\nFOUND YOU TODAY`;
        thumbnailHeadline = `PAUSE & LISTEN`;
        thumbnailIdea = `9:16 vertical reel cover: Soft focus divine temple glow with prominent gold hook text placed carefully inside Instagram's safe zones.`;
        cta = `Share this gentle reminder on your Story to bless someone else's feed today!`;
        onScreenText = `Pause your scroll 🛑\nAllow this sacred vibration to bring you peace.`;
        subtitleGuidance = `Single sentence high-contrast white text with gold drop shadow at bottom center.`;
        editorialRationale = `Strong scroll-stopping hook that resonates emotionally without clickbait deceit.`;
        break;

      case 'emotional-story':
        title = `When You Have Nothing Left, Surrender to ${topic}`;
        hook = `For the soul carrying quiet battles no one else knows about... 🙏`;
        description = `Some days are harder than others. But remember: where human effort exhausts itself, divine grace begins.\n\nLet the sacred rhythm of ${topic} remind you that you are held, protected, and guided by the divine.\n\nBreathe in faith, exhale fear.\n\n${nuances.call}\n\n${hashtags.join(' ')}`;
        reelCoverText = `FOR TIRED HEARTS\n${category.toUpperCase()}`;
        thumbnailHeadline = `DIVINE GRACE`;
        thumbnailIdea = `9:16 vertical frame: Warm diya flame casting soft golden glow on folded hands in prayer (Anjali Mudra), devotional and deeply emotive.`;
        cta = `Tag someone who needs divine comfort and peaceful blessings today.`;
        onScreenText = `You are never alone.\nDivine grace walks beside you in every trial.`;
        subtitleGuidance = `Soft elegant typography with high contrast for mobile screens.`;
        editorialRationale = `Taps directly into universal human vulnerability and the restorative warmth of Bhakti.`;
        break;

      case 'community-engagement':
        title = `Drop a 'Jai Shree Ram' / 'Har Har Mahadev' in the Comments!`;
        hook = `Let's fill the comments with 10,000 chants today! 🪔`;
        description = `When a thousand voices chant together, the energy transforms our world.\n\nAdd your voice to today's sacred circle by writing "${nuances.greeting}" or your personal prayer in the comments.\n\nMay this ${category} shower divine joy upon everyone participating!\n\n${hashtags.join(' ')}`;
        reelCoverText = `CHANT TOGETHER\nCOMMENT BELOW 💬`;
        thumbnailHeadline = `JOIN CHANT`;
        thumbnailIdea = `9:16 cover: Saffron gradient with decorative mandala vector, large speech bubble icon with prayer hands emoji and bold headline.`;
        cta = `Type your prayer below and like comments from other devotees to send them blessings!`;
        onScreenText = `Add your sacred voice ✨\nWrite your prayer below!`;
        subtitleGuidance = `Vibrant dynamic subtitles synced to rhythmic chanting audio.`;
        editorialRationale = `Maximizes Instagram comments and algorithmic reach through mutual devotee interaction.`;
        break;

      case 'calm-meditative':
        title = `30 Seconds of Spiritual Calm with ${topic}`;
        hook = `Put on your headphones. Close your eyes. Just listen. 🎧`;
        description = `Step away from the noise of the digital world for just a moment.\n\nImmerse yourself in the calming sacred soundscape of ${topic}.\n\nFeel your heart rate slow and your spirit return to stillness.\n\nSave this for whenever you need an oasis of peace today.\n\n${hashtags.join(' ')}`;
        reelCoverText = `DEEP SERENITY\nMEDITATIVE CHANT`;
        thumbnailHeadline = `HEADPHONES ON`;
        thumbnailIdea = `9:16 vertical cover: Minimalist dark indigo background with glowing gold sacred geometric mandala softly pulsing.`;
        cta = `Save this post to return to this peaceful sanctuary whenever you feel stressed.`;
        onScreenText = `Close your eyes.\nListen with your soul. 🕊️`;
        subtitleGuidance = `Subtle, slow-fading captions that do not disrupt the viewer's contemplative state.`;
        editorialRationale = `Attracts mindful audiences seeking an antidote to chaotic social media feeds.`;
        break;
    }
  } else {
    // Facebook
    hashtags = [
      `#${category.replace(/\s+/g, '')}`,
      '#SanatanBhakti',
      '#DailyPrayer',
      '#HinduDevotion',
      '#FamilySatsang',
      '#BhaktiMarg'
    ];

    switch (strategy) {
      case 'search-seo':
        title = `${topic} — Daily Family Prayer & Meaning (${category})`;
        hook = `Begin your day with family devotion and divine blessings. 🪔`;
        description = `${nuances.invocation}\n\nDear Devotee Family, reciting ${topic} every morning brings positive energy, spiritual protection, and auspicious vibrations to the entire household.\n\nShare this video with your family and WhatsApp devotional groups so that everyone can start their day with sacred thoughts.\n\n👉 Focus: ${category} | Tone: ${toneDesc}\n\n${nuances.blessing}\n\n${nuances.call}`;
        thumbnailHeadline = `DAILY FAMILY PRAYER\n${category.toUpperCase()}`;
        thumbnailIdea = `16:9 landscape format: Traditional home temple setting with brass diya, fresh marigold flowers, and clear devotional title in Hindi & English script.`;
        cta = `Share this video on your Facebook timeline and spread divine positivity with your family.`;
        communityAngle = `Tailored for multi-generational family audiences who value traditional values and daily pooja routines.`;
        pinnedComment = `🌸 Pranam! May this divine prayer bless your home. Please write where you are watching from today.`;
        editorialRationale = `Targets Facebook's strong community and family sharing culture with respectful, traditional presentation.`;
        break;

      case 'curiosity-hook':
        title = `Why Did Our Elders Always Chant ${topic} at Dawn?`;
        hook = `Have you ever wondered why morning chants have such a profound effect on our peace of mind?`;
        description = `In traditional wisdom, the early morning hours (Brahma Muhurta) carry pure, untainted energy. When you chant or listen to ${topic} during this time, its vibrations bring extraordinary clarity and calm to the mind.\n\nExperience this sacred recitation of ${category} and feel the difference in your day.\n\n${nuances.call}\n\n${nuances.share}`;
        thumbnailHeadline = `THE SACRED TRADITION\n${topic.slice(0, 24).toUpperCase()}`;
        thumbnailIdea = `16:9 landscape: Warm sunrise over an ancient Indian temple courtyard, silhouettes of devotees offering morning arghya, golden aura.`;
        cta = `Did your grandparents or parents teach you this prayer? Share your childhood devotional memory below!`;
        communityAngle = `Ignites nostalgic family discussions around cultural heritage, parenting, and spiritual upbringing.`;
        pinnedComment = `🪔 What is your favorite devotional tradition passed down by your parents? Let us celebrate our roots together!`;
        editorialRationale = `Evokes generational pride and nostalgic family reflection, which drives organic shares and long-form commentary on Facebook.`;
        break;

      case 'emotional-story':
        title = `A Prayer for Strength in Difficult Times: ${topic}`;
        hook = `When words fail, prayer speaks. Turn your worries into faith today.`;
        description = `Life often brings storms we cannot control, but devotion gives us the courage to anchor our souls.\n\nThis heartfelt recitation of ${topic} is dedicated to all brothers and sisters who are praying for their families, healing, or peace of mind today.\n\nNever forget: faith doesn't make things easy, but it makes all things possible with divine grace.\n\n${nuances.call}\n\n${nuances.blessing}`;
        thumbnailHeadline = `FAITH & HOPE\n${category.toUpperCase()}`;
        thumbnailIdea = `16:9 landscape: Expressive close-up of folded hands with sacred tulsi beads and soft warm candlelight from an oil lamp.`;
        cta = `Leave a prayer request for your loved ones in the comments. Our community prays together.`;
        communityAngle = `Creates an empathetic safe space for mutual spiritual support, elder care prayers, and family well-being.`;
        pinnedComment = `🙏 If someone in your family is facing hardship or illness, write their name below so we may send them prayers of healing.`;
        editorialRationale = `Deeply resonates with mature Facebook users who look for compassion, prayer circles, and sincere empathy.`;
        break;

      case 'community-engagement':
        title = `Devotional Circle: Reciting ${topic} Together as One Big Family`;
        hook = `Let us come together as a family of devotees. From which city are you joining our prayer today?`;
        description = `${nuances.invocation}\n\nToday we invite every devotee across the globe to chant ${topic} together. No matter where you live, our devotion connects our hearts.\n\n1. Type "${nuances.greeting}" in the comments.\n2. Tag a friend or family member who loves this prayer.\n3. Share to your favorite devotional group.\n\nMay the blessings of ${category} remain with your family forever!`;
        thumbnailHeadline = `GLOBAL SATSANG\nJOIN OUR PRAYER`;
        thumbnailIdea = `16:9 landscape: Indian map motif adorned with glowing diyas across all states, festive and unifying devotional imagery.`;
        cta = `Write your city and state in the comments to be part of today's global devotional map!`;
        communityAngle = `High-engagement geography-based question that naturally triggers thousands of proud regional responses.`;
        pinnedComment = `📍 Mark your attendance in our prayer circle! Mention your city/town below. Har Har Mahadev!`;
        editorialRationale = `Proven format for Facebook groups and pages to achieve viral organic reach through geographical identity.`;
        break;

      case 'calm-meditative':
        title = `Serene Evening Peace: ${topic} for Stress Relief and Restful Night`;
        hook = `Before you sleep tonight, let this peaceful chant wash away the fatigue of the day.`;
        description = `After a long and busy day, your soul deserves calm and quiet.\n\nLet the soothing cadence of ${topic} settle your thoughts and prepare your home for a peaceful, restful night.\n\nPlay this gently in the background while relaxing with your family.\n\n${nuances.blessing}\n\n${nuances.share}`;
        thumbnailHeadline = `EVENING PEACE\nRESTFUL NIGHT`;
        thumbnailIdea = `16:9 landscape: Serene twilight temple by the river ghats with floating diyas and quiet evening lamps, deep blue and soft amber hues.`;
        cta = `Share this with someone who needs peaceful sleep and positive thoughts tonight.`;
        communityAngle = `Appeals to evening and bedtime routines, providing a calm digital alternative to distressing news feeds.`;
        pinnedComment = `🌙 Shubh Ratri! May your night be filled with divine dreams and peaceful rest. ॐ शान्तिः।`;
        editorialRationale = `Captures peak nighttime Facebook consumption with soothing, non-intrusive devotional relaxation.`;
        break;
    }
  }

  const id = `${platform}-${strategy}-${seed.toString(36).slice(0, 6)}-${variantIndex}`;

  return {
    id,
    platform,
    strategy,
    strategyLabel: STRATEGY_METADATA[strategy].label,
    title,
    hook,
    description,
    hashtags,
    searchKeywords: keywords.slice(0, 6),
    thumbnailIdea,
    thumbnailHeadline,
    cta,
    targetAudience,
    contentFormat: input.videoFormat || `${platform === 'youtube' ? 'YouTube Long-form' : platform === 'instagram' ? 'Instagram Reel' : 'Facebook Video'}`,
    editorialRationale,
    evidenceStatus: 'editorial', // Original devotional editorial strategy
    pinnedComment,
    tags: platform === 'youtube' ? tags : undefined,
    onScreenText: platform === 'instagram' ? onScreenText : undefined,
    subtitleGuidance: platform === 'instagram' ? subtitleGuidance : undefined,
    reelCoverText: platform === 'instagram' ? reelCoverText : undefined,
    communityAngle: platform === 'facebook' ? communityAngle : undefined,
    createdAt: new Date().toISOString()
  };
}

/**
 * Main engine implementation adhering to SuggestionProvider interface
 */
export class LocalSuggestionEngine implements SuggestionProvider {
  /**
   * Generates suggestions for a single platform (always exactly 5 distinct strategies)
   */
  generate(input: StudioFormInput, platform: Platform): Suggestion[] {
    return STRATEGY_ORDER.map(strategy => buildSuggestion(input, platform, strategy, 0));
  }

  /**
   * Regenerates a single suggestion while strictly preserving its strategy
   */
  regenerate(suggestionId: string, currentSuggestions: Suggestion[], input: StudioFormInput): Suggestion {
    const existing = currentSuggestions.find(s => s.id === suggestionId);
    if (!existing) {
      throw new Error(`Suggestion with ID ${suggestionId} not found.`);
    }

    // Determine new variant index
    const seed = Math.floor(Math.random() * 1000) + 1;
    const updated = buildSuggestion(input, existing.platform, existing.strategy, seed);
    // Ensure new ID maintains deterministic structure
    return {
      ...updated,
      id: `${existing.platform}-${existing.strategy}-${Date.now().toString(36)}-regen`
    };
  }
}

// Singleton provider instance
export const suggestionEngine = new LocalSuggestionEngine();

/**
 * Helper to generate suggestions across all chosen platforms
 * 1 platform = exactly 5
 * 2 platforms = exactly 10
 * 3 platforms = exactly 15
 */
export function generateSuggestions(input: StudioFormInput, platforms: Platform[]): Suggestion[] {
  if (!platforms || platforms.length === 0) {
    return [];
  }

  const results: Suggestion[] = [];
  for (const platform of platforms) {
    const platformSuggestions = suggestionEngine.generate(input, platform);
    results.push(...platformSuggestions);
  }

  return results;
}
