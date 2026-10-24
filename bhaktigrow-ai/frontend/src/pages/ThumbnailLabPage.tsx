import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { DiyaFlameIcon, SacredMandalaSVG } from '../components/devotional/DevotionalIcons';
import { copyToClipboard } from '../lib/exportUtils';
import { useToast } from '../context/ToastContext';
import { 
  Palette, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  Eye, 
  Grid, 
  ShieldAlert,
  Smartphone,
  Monitor
} from 'lucide-react';

interface ColorPaletteOption {
  id: string;
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  diyaColor: string;
}

const DEVOTIONAL_PALETTES: ColorPaletteOption[] = [
  {
    id: 'saffron-gold',
    name: 'Sacred Saffron & Antique Gold',
    bgGradient: 'from-[#1a1206] via-[#241708] to-[#0f0b04]',
    textColor: 'text-amber-100',
    accentColor: '#f59e0b',
    diyaColor: '#f97316'
  },
  {
    id: 'midnight-temple',
    name: 'Midnight Temple Indigo & Chandan',
    bgGradient: 'from-[#0b0e1d] via-[#12162e] to-[#080913]',
    textColor: 'text-sky-100',
    accentColor: '#6366f1',
    diyaColor: '#fbbf24'
  },
  {
    id: 'devi-crimson',
    name: 'Devi Shakti Crimson & Vermilion',
    bgGradient: 'from-[#220a0e] via-[#330f16] to-[#140608]',
    textColor: 'text-rose-100',
    accentColor: '#e11d48',
    diyaColor: '#f59e0b'
  },
  {
    id: 'vrindavan-forest',
    name: 'Vrindavan Kadamba Green & Gold',
    bgGradient: 'from-[#081711] via-[#0e241b] to-[#050f0b]',
    textColor: 'text-emerald-100',
    accentColor: '#10b981',
    diyaColor: '#fbbf24'
  }
];

export const ThumbnailLabPage: React.FC = () => {
  const { showToast } = useToast();

  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [headline, setHeadline] = useState('PEACE & COURAGE\n11 CHANTS DAILY');
  const [hook, setHook] = useState('When anxiety visits, let this sacred recitation protect your peace.');
  const [selectedPalette, setSelectedPalette] = useState<ColorPaletteOption>(DEVOTIONAL_PALETTES[0]);
  const [textPlacement, setTextPlacement] = useState<'top' | 'center' | 'bottom'>('center');
  const [showSafeAreas, setShowSafeAreas] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast(`Copied ${label} to clipboard!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Thumbnail &amp; Hook Lab"
        subtitle="Visual devotional creative laboratory. Test typography contrast, sacred saffron/gold palettes, safe-area guides, and first-frame hooks."
        icon={<Palette className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Thumbnail Lab' }
        ]}
      />

      {/* Honest Limitation Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Design &amp; Layout Previews:</strong> These are real-time CSS &amp; SVG vector composition previews for devotional video creators.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              showSafeAreas
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{showSafeAreas ? 'Hide Safe Areas' : 'Show Safe Areas'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Canvas & Preview Screen (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 pl-2">
              Preview Format:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  aspectRatio === '16:9'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>16:9 (YouTube/Facebook)</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  aspectRatio === '9:16'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 (Instagram Reels/Shorts)</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="relative mx-auto flex items-center justify-center bg-black/80 p-4 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            <div
              className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border border-amber-500/30 flex flex-col justify-between p-6 bg-gradient-to-br ${selectedPalette.bgGradient} ${
                aspectRatio === '16:9'
                  ? 'w-full aspect-video'
                  : 'w-[320px] aspect-[9/16]'
              }`}
            >
              {/* Sacred Ambient Mandala */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <SacredMandalaSVG className="w-full h-full" />
              </div>

              {/* Glowing Diya Flame Silhouette */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none blur-sm scale-150">
                <DiyaFlameIcon className="w-48 h-48" />
              </div>

              {/* Safe Area Guides Overlay */}
              {showSafeAreas && (
                <div className="absolute inset-4 border-2 border-dashed border-red-500/50 rounded-lg pointer-events-none z-20 flex flex-col justify-between p-2 text-[10px] text-red-400 font-mono">
                  <div className="flex justify-between">
                    <span>TOP SAFE ZONE (Avoid UI overlapping)</span>
                    <span>10% MARGIN</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BOTTOM SAFE ZONE</span>
                    <span>REEL CAPTION AREA</span>
                  </div>
                </div>
              )}

              {/* Placement Container */}
              <div className={`relative z-10 w-full flex flex-col ${
                textPlacement === 'top'
                  ? 'justify-start'
                  : textPlacement === 'bottom'
                  ? 'justify-end mt-auto'
                  : 'justify-center my-auto'
              }`}>
                {/* Devotional Badge */}
                <div className="mb-2">
                  <span 
                    className="inline-block px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md"
                    style={{ backgroundColor: selectedPalette.accentColor }}
                  >
                    SACRED CHANT
                  </span>
                </div>

                {/* Bold Thumbnail Headline */}
                <h3 className={`font-black tracking-tight drop-shadow-2xl whitespace-pre-line leading-tight ${selectedPalette.textColor} ${
                  aspectRatio === '16:9' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'
                }`}>
                  {headline}
                </h3>

                {/* First-Frame Hook Subtext */}
                <p className="text-xs sm:text-sm text-slate-200/90 mt-2 font-medium drop-shadow-md max-w-lg">
                  {hook}
                </p>
              </div>

              {/* Bottom Diya Accent */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <DiyaFlameIcon className="w-5 h-5" />
                  <span>BhaktiGrow Devotional Series</span>
                </div>
                <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  432Hz Sound
                </span>
              </div>
            </div>
          </div>

          {/* Quick Copy Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              icon={copiedKey === 'headline' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              onClick={() => handleCopy(headline, 'Headline', 'headline')}
            >
              Copy Headline
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={copiedKey === 'hook' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              onClick={() => handleCopy(hook, 'First Frame Hook', 'hook')}
            >
              Copy Hook
            </Button>
          </div>
        </div>

        {/* Right: Controls & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Text Customizer */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Customize Headline &amp; Hook
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thumbnail Cover Headline (2-3 lines max)
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                First-Frame Hook Subtitle
              </label>
              <textarea
                rows={2}
                value={hook}
                onChange={e => setHook(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Text Placement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Text Vertical Placement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['top', 'center', 'bottom'] as const).map(pos => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setTextPlacement(pos)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      textPlacement === pos
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sacred Color Palettes */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Devotional Color Harmony
            </h3>

            <div className="space-y-2.5">
              {DEVOTIONAL_PALETTES.map(pal => (
                <div
                  key={pal.id}
                  onClick={() => setSelectedPalette(pal)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedPalette.id === pal.id
                      ? 'border-amber-500/80 bg-amber-500/10 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: pal.accentColor }}
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      {pal.name}
                    </span>
                  </div>
                  {selectedPalette.id === pal.id && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
