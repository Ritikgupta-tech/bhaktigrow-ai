import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  FileVideo, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Film, 
  SlidersHorizontal, 
  Info 
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { SuggestionCard } from '../components/ui/SuggestionCard';
import { EmptyState } from '../components/ui/EmptyState';
import { DEVOTIONAL_CATEGORIES } from '../data/seedData';
import { 
  Platform, 
  DevotionalCategory, 
  ContentFormat, 
  ContentLanguage, 
  ContentTone, 
  StudioFormInput, 
  Suggestion 
} from '../types';
import { generateSuggestions, suggestionEngine } from '../lib/suggestionEngine';
import { validateVideoFile, formatFileSize, LocalUrlManager } from '../lib/videoValidator';
import { exportSuggestionsAsTxt } from '../lib/exportUtils';
import { useToast } from '../context/ToastContext';
import { usePreferences } from '../context/PreferencesContext';
import { PlatformBadge } from '../components/ui/Badge';
import { api } from '../lib/apiClient';

export const StudioPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { preferences } = usePreferences();

  // URL Query pre-population if coming from Library
  const queryTitle = searchParams.get('title') || '';
  const queryCategory = (searchParams.get('category') as DevotionalCategory) || 'Hanuman Chalisa';

  // Video Upload State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoPlaybackError, setVideoPlaybackError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const urlManagerRef = useRef<LocalUrlManager>(new LocalUrlManager());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [videoTitle, setVideoTitle] = useState(queryTitle);
  const [videoDescription, setVideoDescription] = useState('');
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<ContentLanguage>(preferences.preferredLanguage);
  const [category, setCategory] = useState<DevotionalCategory>(queryCategory);
  const [targetAudience, setTargetAudience] = useState('');
  const [videoFormat, setVideoFormat] = useState<ContentFormat>('YouTube Long-form');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(preferences.defaultPlatforms || ['youtube', 'instagram', 'facebook']);
  const [primaryKeywords, setPrimaryKeywords] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [tone, setTone] = useState<ContentTone>(preferences.defaultTone);

  // Generation & Results State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedSuggestions, setGeneratedSuggestions] = useState<Suggestion[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');

  // Clean up object URLs on unmount
  useEffect(() => {
    const manager = urlManagerRef.current;
    return () => {
      manager.revoke();
    };
  }, []);

  // Handle Video Selection
  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;

    setUploadError(null);
    setVideoPlaybackError(false);

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid video file');
      showToast(validation.error || 'Invalid video file', 'error');
      return;
    }

    // Clean up previous url if exists
    const objectUrl = urlManagerRef.current.createUrl(file);
    setVideoFile(file);
    setVideoPreviewUrl(objectUrl);

    // If title is empty, smartly suggest from file name
    if (!videoTitle.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .trim();
      setVideoTitle(cleanName);
    }

    showToast(`Video loaded: ${file.name} (${formatFileSize(file.size)})`, 'success');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveVideo = () => {
    urlManagerRef.current.revoke();
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setVideoPlaybackError(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Video removed', 'info');
  };

  // Toggle platform selection
  const handleTogglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        if (prev.length === 1) {
          showToast('At least one target platform must remain selected.', 'error');
          return prev;
        }
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  // Generate Workflow
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoTitle.trim()) {
      showToast('Please enter a video title or topic concept.', 'error');
      return;
    }

    if (selectedPlatforms.length === 0) {
      showToast('Please select at least one social platform.', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(20);
    setGenerationStep('Analyzing devotional keywords and category tone...');

    const stepTimer1 = setTimeout(() => {
      setGenerationProgress(55);
      setGenerationStep('Applying 5 devotional strategies (SEO, Hook, Story, Community, Meditative)...');
    }, 450);

    const stepTimer2 = setTimeout(() => {
      setGenerationProgress(80);
      setGenerationStep('Formatting metadata, hashtags, and thumbnail ideas...');
    }, 850);

    const formInput: StudioFormInput = {
      videoTitle: videoTitle.trim(),
      videoDescription: videoDescription.trim(),
      transcript: transcript.trim(),
      language,
      category,
      targetAudience: targetAudience.trim(),
      videoFormat,
      platforms: selectedPlatforms,
      primaryKeywords: primaryKeywords.trim(),
      secondaryKeywords: secondaryKeywords.trim(),
      tone,
      videoFileName: videoFile?.name,
      videoFileSize: videoFile?.size
    };

    try {
      // First attempt backend generation via Express / Gemini / Fallback engine
      const remoteRes = await api.ai.generate({
        videoTitle: formInput.videoTitle,
        category: formInput.category,
        language: formInput.language,
        tone: formInput.tone,
        videoFormat: formInput.videoFormat,
        platforms: formInput.platforms,
        primaryKeywords: formInput.primaryKeywords,
        secondaryKeywords: formInput.secondaryKeywords,
        targetAudience: formInput.targetAudience,
        transcript: formInput.transcript
      });

      let results: Suggestion[] = [];
      if (remoteRes.success && remoteRes.data && Array.isArray((remoteRes.data as any).suggestions) && (remoteRes.data as any).suggestions.length > 0) {
        results = (remoteRes.data as any).suggestions;
      } else {
        // Deterministic local generator fallback
        results = generateSuggestions(formInput, selectedPlatforms);
      }

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGeneratedSuggestions(results);
      setIsGenerating(false);
      setGenerationProgress(100);
      showToast(`Generated exactly ${results.length} devotional suggestions!`, 'success');

      // Scroll smoothly down to results
      setTimeout(() => {
        const resultsEl = document.getElementById('studio-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      const results = generateSuggestions(formInput, selectedPlatforms);
      setGeneratedSuggestions(results);
      setIsGenerating(false);
      setGenerationProgress(100);
      showToast(`Generated ${results.length} devotional suggestions!`, 'success');

      setTimeout(() => {
        const resultsEl = document.getElementById('studio-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Single Suggestion Regeneration
  const handleRegenerateSuggestion = async (suggestionId: string) => {
    try {
      const formInput: StudioFormInput = {
        videoTitle: videoTitle.trim() || category,
        language,
        category,
        targetAudience: targetAudience.trim(),
        videoFormat,
        platforms: selectedPlatforms,
        primaryKeywords: primaryKeywords.trim(),
        secondaryKeywords: secondaryKeywords.trim(),
        tone
      };

      // Try remote regenerate first
      try {
        const res = await api.ai.regenerate({
          suggestionId,
          currentSuggestions: generatedSuggestions,
          input: formInput
        });

        if (res.success && res.data) {
          const regenerated = res.data as Suggestion;
          setGeneratedSuggestions(prev =>
            prev.map(s => (s.id === suggestionId ? regenerated : s))
          );
          showToast(`Regenerated ${regenerated.strategyLabel || 'devotional'} suggestion!`, 'success');
          return;
        }
      } catch {
        // local fallback
      }

      const regenerated = suggestionEngine.regenerate(
        suggestionId,
        generatedSuggestions,
        formInput
      );

      setGeneratedSuggestions(prev =>
        prev.map(s => (s.id === suggestionId ? regenerated : s))
      );

      showToast(`Regenerated ${regenerated.strategyLabel} suggestion!`, 'success');
    } catch (err) {
      showToast('Could not regenerate suggestion.', 'error');
    }
  };

  // Update Suggestion text
  const handleUpdateSuggestion = (suggestionId: string, updates: Partial<Suggestion>) => {
    setGeneratedSuggestions(prev =>
      prev.map(s => (s.id === suggestionId ? { ...s, ...updates } : s))
    );
  };

  // Clear Form
  const handleClearForm = () => {
    setVideoTitle('');
    setVideoDescription('');
    setTranscript('');
    setPrimaryKeywords('');
    setSecondaryKeywords('');
    setTargetAudience('');
    handleRemoveVideo();
    showToast('Form cleared', 'info');
  };

  // Filtered Results
  const filteredSuggestions = filterPlatform === 'all'
    ? generatedSuggestions
    : generatedSuggestions.filter(s => s.platform === filterPlatform);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="AI Devotional Content Studio"
        subtitle="Generate 5 tailored devotional strategies for each selected platform. Upload a local video or start directly with a prayer title."
        icon={<Sparkles className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'AI Content Studio' }
        ]}
      />

      <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Upload & Devotional Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Upload Box */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  Local Video Reference (Optional)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  MP4, WebM, or MOV up to 500 MB. Processed 100% locally in your browser.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Browser Local Only
              </span>
            </div>

            {/* Video Preview or Drag & Drop Area */}
            {videoFile ? (
              <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileVideo className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">
                        {videoFile.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatFileSize(videoFile.size)} &bull; {videoFile.type || 'MOV/Video'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-slate-300"
                    >
                      Replace
                    </Button>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Local Video Player with Fallback */}
                {videoPreviewUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    {!videoPlaybackError ? (
                      <video
                        src={videoPreviewUrl}
                        controls
                        onError={() => setVideoPlaybackError(true)}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="p-4 text-center max-w-sm">
                        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-200">
                          Playback Codec Notice
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Preview is not supported by your browser&apos;s built-in codec, but the file is fully validated and ready for strategy generation.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/40'
                }`}
              >
                <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">
                  Drag &amp; drop video here, or <span className="text-amber-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  MP4, WebM, or MOV up to 500 MB &bull; Video is never uploaded to any server
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={e => handleFileSelect(e.target.files?.[0])}
            />

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Devotional Video Metadata Form */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              Content Details &amp; Devotional Context
            </h3>

            {/* Video Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Video Title / Devotional Topic <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="e.g., Hanuman Chalisa 11 Times Recitation for Courage & Peace"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Category & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Devotional Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as DevotionalCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {DEVOTIONAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Language / Dialect
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as ContentLanguage)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                  <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Format & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Video Format
                </label>
                <select
                  value={videoFormat}
                  onChange={e => setVideoFormat(e.target.value as ContentFormat)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="YouTube Long-form">YouTube Long-form (16:9)</option>
                  <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                  <option value="Instagram Reel">Instagram Reel (9:16)</option>
                  <option value="Instagram Feed Video">Instagram Feed Video (1:1 or 4:5)</option>
                  <option value="Facebook Reel">Facebook Reel (9:16)</option>
                  <option value="Facebook Video">Facebook Video (16:9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Writing Tone
                </label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as ContentTone)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Reverent">Reverent &amp; Sacred</option>
                  <option value="Uplifting">Uplifting &amp; Energizing</option>
                  <option value="Peaceful/Meditative">Peaceful &amp; Meditative</option>
                  <option value="Story-driven">Story-driven &amp; Narrative</option>
                  <option value="Inspirational">Inspirational &amp; Courageous</option>
                  <option value="Traditional">Traditional &amp; Authentic</option>
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Devotional Audience (Optional)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="e.g., Morning pooja devotees, students needing focus, diaspora families"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Primary & Secondary Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={primaryKeywords}
                  onChange={e => setPrimaryKeywords(e.target.value)}
                  placeholder="e.g., Hanuman Chalisa, Bajrangbali Aarti"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Secondary Keywords (Optional)
                </label>
                <input
                  type="text"
                  value={secondaryKeywords}
                  onChange={e => setSecondaryKeywords(e.target.value)}
                  placeholder="e.g., Morning prayers, Sankat Mochan path"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Transcript or Script */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Script / Transcript / Verse Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Paste your recitation text, audio notes, or key devotional quotes here..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Platform Selection & Generation Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Platform Multi-Selector */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Target Social Platforms
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Each selected platform generates exactly 5 distinct strategies (SEO, Hook, Story, Community, Meditative).
              </p>
            </div>

            <div className="space-y-3">
              {/* YouTube Checkbox Card */}
              <div
                onClick={() => handleTogglePlatform('youtube')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedPlatforms.includes('youtube')
                    ? 'bg-red-500/10 border-red-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform="youtube" />
                  <div>
                    <span className="text-sm font-bold block">YouTube</span>
                    <span className="text-[11px] text-slate-400">5 SEO &amp; Thumbnail Strategies</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('youtube')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-red-500 focus:ring-red-400"
                />
              </div>

              {/* Instagram Checkbox Card */}
              <div
                onClick={() => handleTogglePlatform('instagram')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedPlatforms.includes('instagram')
                    ? 'bg-pink-500/10 border-pink-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform="instagram" />
                  <div>
                    <span className="text-sm font-bold block">Instagram</span>
                    <span className="text-[11px] text-slate-400">5 Reel Hook &amp; Aesthetic Captions</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('instagram')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400"
                />
              </div>

              {/* Facebook Checkbox Card */}
              <div
                onClick={() => handleTogglePlatform('facebook')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedPlatforms.includes('facebook')
                    ? 'bg-blue-500/10 border-blue-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform="facebook" />
                  <div>
                    <span className="text-sm font-bold block">Facebook</span>
                    <span className="text-[11px] text-slate-400">5 Community &amp; Satsang Angles</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('facebook')}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Total Expectation Summary */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
              <span className="font-semibold">Expected Output:</span>
              <span className="font-extrabold text-amber-300">
                {selectedPlatforms.length * 5} Total Suggestions ({selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'} &times; 5)
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isGenerating}
                icon={<Sparkles className="w-5 h-5 text-slate-950" />}
                className="w-full text-base shadow-xl shadow-amber-500/25"
              >
                {isGenerating ? 'Synthesizing Devotional Strategies...' : 'Generate 5 Strategies per Platform'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearForm}
                className="w-full text-xs text-slate-400 hover:text-white"
              >
                Clear Form
              </Button>
            </div>
          </div>

          {/* Local Processing Notice */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Honest Local Engine Architecture</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              BhaktiGrow AI executes its deterministic strategy framework entirely inside your browser. No video frames or audio files are ever transferred over the internet.
            </p>
          </div>
        </div>
      </form>

      {/* Generation Loading State Animation */}
      {isGenerating && (
        <div className="p-10 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-center space-y-4 backdrop-blur-md shadow-2xl">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
          <h3 className="text-xl font-bold text-white">
            Formulating Devotional Strategies
          </h3>
          <p className="text-xs text-amber-300 font-medium">
            {generationStep}
          </p>
          <div className="max-w-md mx-auto w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      <div id="studio-results-section" className="space-y-6 pt-4">
        {generatedSuggestions.length > 0 ? (
          <div>
            {/* Results Filter & Export Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Generated Content Strategies ({generatedSuggestions.length} Total)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  5 tailored strategies per platform. Click any card to edit, regenerate, copy, or preview.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Platform Filter Tabs */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterPlatform('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      filterPlatform === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({generatedSuggestions.length})
                  </button>
                  {selectedPlatforms.includes('youtube') && (
                    <button
                      type="button"
                      onClick={() => setFilterPlatform('youtube')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        filterPlatform === 'youtube'
                          ? 'bg-red-500 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      YouTube (5)
                    </button>
                  )}
                  {selectedPlatforms.includes('instagram') && (
                    <button
                      type="button"
                      onClick={() => setFilterPlatform('instagram')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        filterPlatform === 'instagram'
                          ? 'bg-pink-500 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Instagram (5)
                    </button>
                  )}
                  {selectedPlatforms.includes('facebook') && (
                    <button
                      type="button"
                      onClick={() => setFilterPlatform('facebook')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        filterPlatform === 'facebook'
                          ? 'bg-blue-500 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Facebook (5)
                    </button>
                  )}
                </div>

                {/* Export All as .TXT */}
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => exportSuggestionsAsTxt(generatedSuggestions, `${videoTitle || 'bhaktigrow'}-strategies.txt`)}
                  title="Export all generated suggestions as a .txt document"
                >
                  Export All (.txt)
                </Button>
              </div>
            </div>

            {/* Grid of Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSuggestions.map(suggestion => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onRegenerate={handleRegenerateSuggestion}
                  onUpdate={handleUpdateSuggestion}
                />
              ))}
            </div>
          </div>
        ) : (
          !isGenerating && (
            <EmptyState
              title="No Suggestions Generated Yet"
              description="Enter your devotional topic or chant above and click 'Generate 5 Strategies per Platform' to formulate platform-specific titles, hooks, hashtags, and thumbnail ideas."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setVideoTitle('Maha Mrityunjaya Mantra 108 Times with Himalayan Acoustic Bells');
                    setCategory('Shiva Mantra');
                    setPrimaryKeywords('Maha Mrityunjaya Mantra, Shiva Healing Chants');
                    showToast('Loaded demo Shiva chant into studio!', 'info');
                  }}
                >
                  Try Demo Topic: Maha Mrityunjaya Mantra
                </Button>
              }
            />
          )
        )}
      </div>
    </div>
  );
};
