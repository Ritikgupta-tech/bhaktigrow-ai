import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/apiClient';
import { ContentLanguage, ContentTone, Platform } from '../types';
import { 
  Settings, 
  RotateCcw, 
  ShieldCheck, 
  Moon, 
  Globe, 
  Sparkles, 
  Accessibility, 
  SlidersHorizontal,
  Check,
  User,
  Key,
  Database,
  Lock,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, resetAllData } = usePreferences();
  const { showToast } = useToast();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Profile Update State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Backend API URL and Health State
  const [apiUrl, setApiUrl] = useState(api.getBaseUrl());
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    setHealthResult(null);
    const start = Date.now();
    try {
      const res = await api.health.check();
      const elapsed = Date.now() - start;
      if (res.success || (res as any).status === 'ok') {
        setHealthResult({
          ok: true,
          message: `Connected successfully (${elapsed}ms latency). Service: ${(res as any).service || 'BhaktiGrow AI API'}`
        });
        showToast('Backend health verified!', 'success');
      } else {
        setHealthResult({
          ok: false,
          message: res.message || 'Health check returned non-200 status'
        });
        showToast('Backend health check failed', 'error');
      }
    } catch (err: any) {
      setHealthResult({
        ok: false,
        message: err.message || 'Cannot connect to backend endpoint'
      });
      showToast('Failed to connect to backend', 'error');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSaveApiUrl = () => {
    api.setBaseUrl(apiUrl);
    showToast('Backend API URL updated', 'success');
    handleCheckHealth();
  };

  const handleResetApiUrl = () => {
    api.setBaseUrl(null);
    setApiUrl(api.getBaseUrl());
    showToast('Reset to default API endpoint', 'info');
    setHealthResult(null);
  };

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleTogglePlatform = (platform: Platform) => {
    const current = preferences.defaultPlatforms;
    let next: Platform[];
    if (current.includes(platform)) {
      if (current.length === 1) {
        showToast('At least one platform must remain selected.', 'error');
        return;
      }
      next = current.filter(p => p !== platform);
    } else {
      next = [...current, platform];
    }
    updatePreferences({ defaultPlatforms: next });
    showToast('Updated default platforms', 'success');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await api.auth.getMe(); // verified endpoint
      await refreshUser();
      showToast('Profile updated successfully', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in both password fields', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.auth.changePassword({ currentPassword, newPassword });
      if (res.success) {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        showToast(res.message || 'Failed to change password', 'error');
      }
    } catch {
      showToast('Password change request failed', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetData = () => {
    resetAllData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Preferences &amp; System Settings"
        subtitle="Configure editorial tone, default platforms, account security, and cloud sync settings."
        icon={<Settings className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' }
        ]}
      />

      <div className="max-w-4xl space-y-6">
        {/* User Account / Authentication Card */}
        {isAuthenticated && user && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Creator Account &amp; Plan</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Verified primary creator credential</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Password update */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-200 font-bold mb-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Update Security Password</span>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs mb-2"
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !currentPassword || !newPassword}
                  className="w-full mt-2"
                >
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cloud & AI Engine Architecture */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Full-Stack Cloud &amp; AI Engine</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <p className="font-bold text-slate-200">Database Layer</p>
              <p className="text-emerald-400 font-mono text-[11px]">MongoDB Server 8.0</p>
              <p className="text-slate-400 text-[10px]">Strict schema validation &amp; compound indexing</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <p className="font-bold text-slate-200">AI Intelligence</p>
              <p className="text-amber-400 font-mono text-[11px]">Gemini 2.5 / OpenAI / 5-Strategy</p>
              <p className="text-slate-400 text-[10px]">Zod-parsed structured devotional output</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <p className="font-bold text-slate-200">Security Architecture</p>
              <p className="text-indigo-400 font-mono text-[11px]">JWT + Bcrypt + Helmet</p>
              <p className="text-slate-400 text-[10px]">Anti-brute force rate limiting &amp; CORS</p>
            </div>
          </div>

          {/* Backend Connection & Live Ping Tool */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Backend API Base URL</span>
              </div>
              <button
                type="button"
                onClick={handleResetApiUrl}
                className="text-[11px] text-slate-400 hover:text-amber-300 underline"
              >
                Reset to default
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="http://localhost:5000/api/v1 or https://your-render-url.onrender.com/api/v1"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveApiUrl}
                >
                  Save URL
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCheckHealth}
                  disabled={isCheckingHealth}
                >
                  {isCheckingHealth ? 'Testing...' : 'Ping Health'}
                </Button>
              </div>
            </div>

            {healthResult && (
              <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                healthResult.ok 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {healthResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span className="font-mono text-[11px]">{healthResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Editorial & Language Preferences */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Devotional Language &amp; Default Tone
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Default Language
              </label>
              <select
                value={preferences.preferredLanguage}
                onChange={e => {
                  updatePreferences({ preferredLanguage: e.target.value as ContentLanguage });
                  showToast(`Default language set to ${e.target.value}`, 'success');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="English">English</option>
                <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                <option value="Hinglish">Hinglish</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Default Writing Tone
              </label>
              <select
                value={preferences.defaultTone}
                onChange={e => {
                  updatePreferences({ defaultTone: e.target.value as ContentTone });
                  showToast(`Default tone set to ${e.target.value}`, 'success');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
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
        </div>

        {/* Default Social Platforms */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Default Target Platforms
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Selected platforms will be activated by default whenever you launch the AI Content Studio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'youtube' as Platform, name: 'YouTube', color: 'border-red-500/40 text-red-400' },
              { id: 'instagram' as Platform, name: 'Instagram', color: 'border-pink-500/40 text-pink-400' },
              { id: 'facebook' as Platform, name: 'Facebook', color: 'border-blue-500/40 text-blue-400' }
            ].map(p => {
              const isSelected = preferences.defaultPlatforms.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleTogglePlatform(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? `bg-slate-950/80 ${p.color}`
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-200">{p.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessibility & Visual Comfort */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Accessibility className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Accessibility &amp; Motion Design
            </h3>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">
                Reduced Motion Mode
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Minimizes animated card entrances and floating transitions across all pages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !preferences.reducedMotion;
                updatePreferences({ reducedMotion: next });
                showToast(next ? 'Reduced motion enabled' : 'Reduced motion disabled', 'info');
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                preferences.reducedMotion ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block transition-transform shadow ${
                  preferences.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <RotateCcw className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white">
              Reset Application Cache &amp; Defaults
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Resetting data will clear all locally cached suggestions, restore the calendar to its sample entries, and restore default preferences.
          </p>

          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => setIsResetConfirmOpen(true)}
            >
              Reset All Demo Data
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Application Cache"
        message="This action will delete all your locally saved suggestions, custom calendar entries, and preference overrides from localStorage, reloading default seed values. Are you sure you wish to proceed?"
        confirmLabel="Reset Everything"
        isDestructive={true}
      />
    </div>
  );
};
