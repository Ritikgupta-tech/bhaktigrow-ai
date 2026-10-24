import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/apiClient';
import { Button } from '../components/ui/Button';
import { DiyaFlameIcon } from '../components/devotional/DevotionalIcons';
import { Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Welcome back to BhaktiGrow AI!', 'success');
      navigate('/dashboard');
    } else {
      setErrorMessage(result.message || 'Login failed.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('creator@bhaktigrow.com');
    setPassword('Devotion123!');
    setLoading(true);
    // Attempt registration first if demo account doesn't exist yet, then log in
    await api.auth.register({
      name: 'Devotional Creator',
      email: 'creator@bhaktigrow.com',
      password: 'Devotion123!'
    }).catch(() => {});

    const res = await login('creator@bhaktigrow.com', 'Devotion123!');
    setLoading(false);
    if (res.success) {
      showToast('Signed in with Demo Creator Account!', 'success');
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-b from-[#131b2f] to-[#0c1220] p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-2.5 shadow-lg shadow-amber-500/10 mb-4">
            <DiyaFlameIcon className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign in to Bhakti<span className="text-amber-400">Grow</span> AI
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Access your devotional strategy workspace and synced calendar
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-amber-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full shadow-xl shadow-amber-500/20 text-slate-950 font-bold"
          >
            Sign In
          </Button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDemoLogin}
            icon={<Sparkles className="w-4 h-4 text-amber-400" />}
            className="w-full text-xs text-slate-200"
          >
            Quick 1-Click Demo Login
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-amber-400 font-semibold hover:underline">
            Register as a creator
          </Link>
        </div>
      </div>
    </div>
  );
};
