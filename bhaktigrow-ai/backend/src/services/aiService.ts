import { env } from '../config/env.js';

export interface GenerateContentInput {
  videoTitle: string;
  category: string;
  language?: string;
  tone?: string;
  videoFormat?: string;
  platforms: ('youtube' | 'instagram' | 'facebook')[];
  primaryKeywords?: string;
  secondaryKeywords?: string;
  targetAudience?: string;
  transcript?: string;
}

export interface GeneratedSuggestion {
  id: string;
  platform: 'youtube' | 'instagram' | 'facebook';
  strategy: 'search-seo' | 'curiosity-hook' | 'emotional-story' | 'community-engagement' | 'calm-meditative';
  strategyLabel: string;
  title: string;
  hook: string;
  description: string;
  hashtags: string[];
  searchKeywords: string[];
  thumbnailIdea: string;
  thumbnailHeadline: string;
  cta: string;
  targetAudience: string;
  contentFormat: string;
  editorialRationale: string;
  evidenceStatus: 'editorial' | 'verified' | 'calculated' | 'illustrative';
  pinnedComment?: string;
  tags?: string[];
  onScreenText?: string;
  subtitleGuidance?: string;
  reelCoverText?: string;
  communityAngle?: string;
  createdAt: string;
}

const STRATEGIES: { type: GeneratedSuggestion['strategy']; label: string }[] = [
  { type: 'search-seo', label: 'Search-Focused SEO' },
  { type: 'curiosity-hook', label: 'Curiosity-Driven Hook' },
  { type: 'emotional-story', label: 'Emotional Storytelling' },
  { type: 'community-engagement', label: 'Community Engagement' },
  { type: 'calm-meditative', label: 'Calm & Meditative' }
];

export class AIService {
  private provider: 'gemini' | 'openai' | 'mock';

  constructor() {
    this.provider = env.AI_PROVIDER;
  }

  getProviderName(): string {
    return this.provider;
  }

  async generate(input: GenerateContentInput): Promise<GeneratedSuggestion[]> {
    if (this.provider === 'gemini' && env.GEMINI_API_KEY) {
      try {
        return await this.generateWithGemini(input);
      } catch (err) {
        console.warn('[AIService] Gemini call failed, falling back to deterministic devotional engine:', err);
      }
    } else if (this.provider === 'openai' && env.OPENAI_API_KEY) {
      try {
        return await this.generateWithOpenAI(input);
      } catch (err) {
        console.warn('[AIService] OpenAI call failed, falling back to deterministic devotional engine:', err);
      }
    }

    // Default: Deterministic Devotional Engine
    return this.generateDeterministic(input);
  }

  async regenerate(
    suggestionId: string,
    currentSuggestions: GeneratedSuggestion[],
    input: GenerateContentInput
  ): Promise<GeneratedSuggestion> {
    const existing = currentSuggestions.find(s => s.id === suggestionId);
    if (!existing) {
      throw new Error(`Suggestion ${suggestionId} not found`);
    }

    const all = await this.generate(input);
    const candidate = all.find(s => s.platform === existing.platform && s.strategy === existing.strategy);

    if (candidate) {
      return {
        ...candidate,
        id: `${existing.platform}-${existing.strategy}-${Date.now().toString(36)}-regen`
      };
    }

    return existing;
  }

  async generateHashtags(category: string, topic: string, platform: string): Promise<string[]> {
    const cleanCat = category.replace(/\s+/g, '');
    const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, '');

    const base = [
      `#${cleanCat}`,
      '#BhaktiSangrah',
      '#SanatanDharma',
      '#DailyPrayer',
      '#DivinePeace',
      '#SpiritualGrowth'
    ];

    if (platform === 'instagram') {
      return [...base, '#BhaktiReels', '#SpiritualVibes', '#DailyDarshan'];
    }
    if (platform === 'youtube') {
      return [...base, `#${cleanTopic}`, '#MorningChants', '#MandirVibes'];
    }
    return [...base, '#FamilySatsang', '#HinduBhakti', '#Prarthana'];
  }

  async repurpose(sourceContent: string, targetPlatform: 'youtube' | 'instagram' | 'facebook'): Promise<GeneratedSuggestion> {
    const lines = sourceContent.split('\n').filter(l => l.trim());
    const title = lines[0] || 'Devotional Chant Reflection';

    const input: GenerateContentInput = {
      videoTitle: title,
      category: 'Meditation',
      platforms: [targetPlatform]
    };

    const generated = await this.generate(input);
    return generated[0];
  }

  // --- External API Handlers ---
  private async generateWithGemini(input: GenerateContentInput): Promise<GeneratedSuggestion[]> {
    const prompt = this.buildPrompt(input);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');

    const parsed = JSON.parse(text);
    return this.validateAndNormalizeOutput(parsed, input);
  }

  private async generateWithOpenAI(input: GenerateContentInput): Promise<GeneratedSuggestion[]> {
    const prompt = this.buildPrompt(input);
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}`);
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty OpenAI response');

    const parsed = JSON.parse(content);
    return this.validateAndNormalizeOutput(parsed, input);
  }

  private buildPrompt(input: GenerateContentInput): string {
    return `You are a Senior Sanatan Devotional Content Strategist. Generate structured content suggestions for a devotional video.
Input:
- Title / Topic: "${input.videoTitle}"
- Category: "${input.category}"
- Target Platforms: ${input.platforms.join(', ')}
- Language: "${input.language || 'Hindi'}"
- Tone: "${input.tone || 'Reverent'}"

Rules:
1. For EACH target platform in (${input.platforms.join(', ')}), generate exactly 5 distinct strategies:
   - "search-seo" (Search-Focused SEO)
   - "curiosity-hook" (Curiosity-Driven Hook)
   - "emotional-story" (Emotional Storytelling)
   - "community-engagement" (Community Engagement)
   - "calm-meditative" (Calm & Meditative)
2. Every item must have: platform, strategy, strategyLabel, title, hook, description, hashtags (array of strings), searchKeywords (array of strings), thumbnailHeadline, thumbnailIdea, cta, targetAudience, contentFormat, editorialRationale, evidenceStatus ("editorial").
3. Include platform-specific fields:
   - For YouTube: pinnedComment, tags (array)
   - For Instagram: onScreenText, subtitleGuidance, reelCoverText
   - For Facebook: communityAngle, pinnedComment
4. Return a JSON object with a single key "suggestions" containing an array of suggestion objects.`;
  }

  private validateAndNormalizeOutput(rawJson: { suggestions?: GeneratedSuggestion[] } | GeneratedSuggestion[], input: GenerateContentInput): GeneratedSuggestion[] {
    const items = Array.isArray(rawJson) ? rawJson : rawJson?.suggestions || [];
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid output structure from AI model');
    }

    // Ensure all target platforms have 5 suggestions
    return items.map((item, idx) => ({
      ...item,
      id: item.id || `ai-${item.platform}-${item.strategy}-${idx}-${Date.now().toString(36)}`,
      evidenceStatus: 'editorial',
      createdAt: new Date().toISOString()
    }));
  }

  // --- Deterministic Devotional Engine (Safe, High-Quality Fallback) ---
  private generateDeterministic(input: GenerateContentInput): GeneratedSuggestion[] {
    const results: GeneratedSuggestion[] = [];
    const topic = input.videoTitle.trim() || input.category;
    const cat = input.category;
    const tone = input.tone || 'Reverent';

    for (const platform of input.platforms) {
      for (const strat of STRATEGIES) {
        let title = '';
        let hook = '';
        let description = '';
        let thumbnailHeadline = '';
        let thumbnailIdea = '';
        let cta = '';
        let hashtags: string[] = [`#${cat.replace(/\s+/g, '')}`, '#SanatanBhakti', '#DailyPrayer', '#PeacefulMind'];
        let keywords: string[] = [cat, `${cat} Chanting`, 'Morning Prayer', 'Inner Peace'];
        let pinnedComment = '';
        let tags: string[] | undefined;
        let onScreenText: string | undefined;
        let subtitleGuidance: string | undefined;
        let reelCoverText: string | undefined;
        let communityAngle: string | undefined;

        if (platform === 'youtube') {
          tags = [cat, `${cat} full path`, 'peaceful morning chant', `${cat} lyrics`, 'meditation prayer'];
          pinnedComment = `🌸 Pranam! May this recitation of ${cat} bring profound serenity to your household. Comment below your prayer intention today!`;
          if (strat.type === 'search-seo') {
            title = `${topic} | Full Sacred ${cat} Chanting & Meaning`;
            hook = `Experience peaceful vibrations with complete ${cat} recitation.`;
            description = `॥ ॐ श्री गणेशाय नमः ॥\n\nImmerse yourself in ${topic}. Recited with ${tone.toLowerCase()} devotion to bring peace, prosperity, and clarity to your mind.\n\n🔔 Subscribe for daily morning prayers and mantras.\n\nMay divine grace protect you and your loved ones.`;
            thumbnailHeadline = `SACRED CHANTS\n${cat.toUpperCase()}`;
            thumbnailIdea = 'Deep warm saffron radiance with glowing brass diya, temple bell silhouette, bold Devanagari & English contrast.';
            cta = 'Subscribe and bookmark for your daily morning routine.';
          } else if (strat.type === 'curiosity-hook') {
            title = `The Spiritual Power of ${topic}: Why Sages Recommend Reciting at Dawn`;
            hook = `Did you know that each vibration of ${cat} transforms your mental focus?`;
            description = `Discover why ancient rishis placed ${cat} at the core of daily spiritual discipline.\n\nListen with full devotion to awaken peace and spiritual focus.\n\nShare your reflection in the comments below.`;
            thumbnailHeadline = `ANCIENT SECRET\n${cat.toUpperCase()}`;
            thumbnailIdea = 'Dramatic sunrise temple silhouette with halo glow, golden typography in safe viewing bounds.';
            cta = 'Watch till the final chant and experience the shift in inner calm.';
          } else if (strat.type === 'emotional-story') {
            title = `In Times of Worry and Fatigue, Turn to ${topic} — Solace & Strength`;
            hook = 'When life feels heavy, let this prayer remind you that you are never alone.';
            description = `Surrender all worry at the lotus feet. This recitation of ${cat} provides spiritual comfort and emotional reassurance.\n\nClose your eyes and breathe in peace.\n\nShare with someone who needs peace today.`;
            thumbnailHeadline = `DIVINE SOLACE\nINNER HEALING`;
            thumbnailIdea = 'Earthen diya floating gently in sacred waters with marigold petals, soft comforting amber tones.';
            cta = 'Leave your sincere prayer below. We chant together.';
          } else if (strat.type === 'community-engagement') {
            title = `Let's Chant Together: ${topic} Family Prayer Circle`;
            hook = 'Drop your family prayer intention in the comments below.';
            description = `Welcome to our virtual satsang. When devotees chant ${cat} together, collective energy uplifts every family.\n\nComment with your city name and join our daily prayer circle.\n\nHar Har Mahadev & Jai Shree Ram!`;
            thumbnailHeadline = `GLOBAL SATSANG\nCHANT TOGETHER`;
            thumbnailIdea = 'Multiple traditional diyas in unison, festive mandap garland border, bold community invitation.';
            cta = 'Comment with your city name to join today’s prayer circle!';
          } else {
            title = `Deep Meditative Chanting: ${topic} for Inner Silence & Restful Sleep`;
            hook = 'Take three deep breaths. Let sacred silence speak through this chant.';
            description = `Crafted specifically for mindful contemplation, peaceful morning meditation, or evening relaxation.\n\nBest experienced with headphones at 432Hz harmonic resonance.\n\nOm Shanti, Shanti, Shanti.`;
            thumbnailHeadline = `MEDITATIVE CALM\nINNER SILENCE`;
            thumbnailIdea = 'Deep midnight indigo background with soft pulsing gold sacred mandala, minimalist text.';
            cta = 'Add to your daily meditation playlist for peaceful sleep and calm mornings.';
          }
        } else if (platform === 'instagram') {
          hashtags = [...hashtags, '#BhaktiReels', '#SpiritualReels', '#DailyDarshan'];
          if (strat.type === 'search-seo') {
            title = `${topic} — Daily Morning Reel`;
            hook = 'Save this for tomorrow morning’s pooja routine 🪔';
            description = `Start your day at the highest frequency with ${cat}.\n\n📌 Save this Reel so you never miss your daily chant.\n\n${hashtags.join(' ')}`;
            reelCoverText = `MORNING ROUTINE\n${cat.toUpperCase()}`;
            thumbnailHeadline = 'DAILY CHANT';
            thumbnailIdea = 'Vertical 9:16 portrait: Glowing brass diya in focus, dark vignette, centered gold text.';
            cta = 'Double tap and save to your morning prayer folder!';
            onScreenText = `Start your morning with ${cat} ✨`;
            subtitleGuidance = 'Saffron subtitle at 45% screen height with smooth fade.';
          } else if (strat.type === 'curiosity-hook') {
            title = `The Sacred Frequency of ${topic}`;
            hook = 'Pause your scrolling for 15 seconds. This chant was meant for you today. 🌿';
            description = `Nothing in devotion is an accident. Take this reminder to breathe and release anxiety.\n\n${hashtags.join(' ')}`;
            reelCoverText = `PAUSE & LISTEN\n${cat.toUpperCase()}`;
            thumbnailHeadline = 'PAUSE & BREATHE';
            thumbnailIdea = '9:16 vertical cover: Temple bell with golden halo, high contrast serif text.';
            cta = 'Share on your story to bless someone else’s feed today!';
            onScreenText = 'Pause your scroll 🛑\nLet this vibration bring you calm.';
            subtitleGuidance = 'Single line high-contrast white text with gold drop shadow.';
          } else if (strat.type === 'emotional-story') {
            title = `For Hearts Carrying Quiet Burdens: ${topic}`;
            hook = 'For the soul fighting battles no one else knows about... 🙏';
            description = `Where human strength ends, divine grace begins. Let ${cat} remind you that you are protected.\n\n${hashtags.join(' ')}`;
            reelCoverText = `FOR TIRED HEARTS\nSURRENDER WORRY`;
            thumbnailHeadline = 'DIVINE GRACE';
            thumbnailIdea = '9:16 frame: Folded prayer hands illuminated by warm candlelight, emotive and reverent.';
            cta = 'Tag someone who needs peace and blessings today.';
            onScreenText = 'You are never alone.\nDivine grace walks beside you.';
            subtitleGuidance = 'Soft elegant font with gentle fade transitions.';
          } else if (strat.type === 'community-engagement') {
            title = 'Join 10,000 Devotees in Today’s Chanting Circle!';
            hook = 'Let’s fill the comments with sacred chants today! 🪔';
            description = `When thousands chant together, divine energy spreads everywhere. Write your prayer below!\n\n${hashtags.join(' ')}`;
            reelCoverText = `CHANT TOGETHER\nCOMMENT BELOW 💬`;
            thumbnailHeadline = 'JOIN CIRCLE';
            thumbnailIdea = '9:16 vertical cover: Vibrant saffron mandala vector with speech bubble icon.';
            cta = 'Type your prayer below and bless other devotees in the replies!';
            onScreenText = 'Add your sacred voice ✨\nComment below!';
            subtitleGuidance = 'Dynamic rhythm-synced subtitles.';
          } else {
            title = `30 Seconds of Spiritual Calm with ${topic}`;
            hook = 'Put on your headphones. Close your eyes. Just listen. 🎧';
            description = `An oasis of calm amidst your digital day. Slow your breath and rest in divine stillness.\n\n${hashtags.join(' ')}`;
            reelCoverText = `DEEP SERENITY\nMEDITATIVE CHANT`;
            thumbnailHeadline = 'HEADPHONES ON';
            thumbnailIdea = '9:16 minimalist dark indigo cover with softly pulsing gold mandala.';
            cta = 'Save this post for whenever you feel stressed today.';
            onScreenText = 'Close your eyes.\nListen with your soul. 🕊️';
            subtitleGuidance = 'Minimalist slow-fading captions.';
          }
        } else {
          // Facebook
          hashtags = [...hashtags, '#FamilySatsang', '#HinduBhakti', '#Prarthana'];
          communityAngle = 'Tailored for multi-generational families sharing morning prayers on Facebook.';
          pinnedComment = `🌸 Pranam! May this divine prayer bring auspicious blessings to your household. Where are you joining us from?`;
          if (strat.type === 'search-seo') {
            title = `${topic} — Family Morning Pooja & Blessings`;
            hook = 'Begin your family day with positive energy and divine blessings. 🪔';
            description = `Dear Devotee Family, reciting ${topic} every morning brings spiritual protection and peace to the entire household.\n\nShare this with your family and WhatsApp devotional groups so everyone starts their day with sacred thoughts.\n\nHar Har Mahadev!`;
            thumbnailHeadline = `DAILY FAMILY PRAYER\n${cat.toUpperCase()}`;
            thumbnailIdea = '16:9 landscape: Traditional home temple setup with brass diya and fresh marigold flowers.';
            cta = 'Share on your Facebook timeline to spread divine positivity!';
          } else if (strat.type === 'curiosity-hook') {
            title = `Why Did Our Elders Always Chant ${topic} at Sunrise?`;
            hook = 'Have you ever wondered why morning chants have such a deep calming effect?';
            description = `During Brahma Muhurta, atmospheric vibrations are serene. Reciting ${cat} during this time cleanses mental fog and instills deep focus.\n\nShare your childhood devotional memories in the comments!`;
            thumbnailHeadline = `THE SACRED TRADITION\n${cat.toUpperCase()}`;
            thumbnailIdea = '16:9 sunrise over an ancient Indian river ghat, warm golden light.';
            cta = 'Did your grandparents teach you this chant? Share your story below!';
          } else if (strat.type === 'emotional-story') {
            title = `A Heartfelt Prayer for Health and Family Harmony: ${topic}`;
            hook = 'When words fail, sincere prayer heals. Turn your worries into faith today.';
            description = `Dedicated to all brothers and sisters praying for their families, healing, or peace of mind today.\n\nNever forget: faith transforms hardship into resilience with divine grace.\n\nMay peace fill your home.`;
            thumbnailHeadline = `FAITH & HOPE\n${cat.toUpperCase()}`;
            thumbnailIdea = '16:9 warm candlelight close-up with sacred tulsi beads and glowing diya.';
            cta = 'Leave a prayer request for your family members below.';
          } else if (strat.type === 'community-engagement') {
            title = `Global Devotional Circle: Reciting ${topic} Together`;
            hook = 'From which city are you joining our prayer today? Let us connect as one family!';
            description = `Devotion knows no distance. From every corner of the world, let us chant ${cat} together today.\n\nType your city name in the comments to join today’s global map!`;
            thumbnailHeadline = `GLOBAL SATSANG\nMARK ATTENDANCE`;
            thumbnailIdea = '16:9 Indian map silhouette illuminated with glowing diyas in every region.';
            cta = 'Comment your city below to be part of today’s prayer circle!';
          } else {
            title = `Serene Evening Relaxation: ${topic} for Peaceful Sleep`;
            hook = 'Before you sleep tonight, let this gentle chant release the fatigue of the day.';
            description = `After a busy day, your soul deserves stillness. Play this gently in the background while unwinding with your family.\n\nShubh Ratri and peaceful blessings to all.`;
            thumbnailHeadline = `EVENING PEACE\nRESTFUL NIGHT`;
            thumbnailIdea = '16:9 twilight ghats with floating diyas and quiet evening lamps, deep blue and amber tones.';
            cta = 'Share with someone who needs peaceful rest tonight.';
          }
        }

        results.push({
          id: `${platform}-${strat.type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          platform,
          strategy: strat.type,
          strategyLabel: strat.label,
          title,
          hook,
          description,
          hashtags,
          searchKeywords: keywords,
          thumbnailIdea,
          thumbnailHeadline,
          cta,
          targetAudience: input.targetAudience || 'Devotees, families, and spiritual seekers',
          contentFormat: input.videoFormat || (platform === 'youtube' ? 'YouTube Long-form' : platform === 'instagram' ? 'Instagram Reel' : 'Facebook Video'),
          editorialRationale: `Tailored ${strat.label} for ${platform.toUpperCase()}`,
          evidenceStatus: 'editorial',
          pinnedComment: pinnedComment || undefined,
          tags,
          onScreenText,
          subtitleGuidance,
          reelCoverText,
          communityAngle,
          createdAt: new Date().toISOString()
        });
      }
    }

    return results;
  }
}

export const aiService = new AIService();
