import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { DiyaFlameIcon } from '../components/devotional/DevotionalIcons';
import { Key, Lock, ArrowLeft } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const queryToken = searchParams.get('token') || '';
  const [token, setToken] = useState(queryToken);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (queryToken) {
      setToken(queryToken);
    }
  }, [queryToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const res = await api.auth.resetPassword({ token, newPassword });
    setLoading(false);

    if (res.success) {
      showToast('Password has been reset successfully. Please log in.', 'success');
      navigate('/login');
    } else {
      setErrorMessage(res.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-b from-[#131b2f] to-[#0c1220] p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-2.5 shadow-lg shadow-amber-500/10 mb-4">
            <DiyaFlameIcon className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Enter New Password
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Paste your security token and choose a new password
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reset Token
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Paste security reset token..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Password (Min 6 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full text-slate-950 font-bold"
          >
            Update Password
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
