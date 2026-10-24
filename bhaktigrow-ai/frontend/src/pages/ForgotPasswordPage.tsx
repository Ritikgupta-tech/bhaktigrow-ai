import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { Button } from '../components/ui/Button';
import { DiyaFlameIcon } from '../components/devotional/DevotionalIcons';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.auth.forgotPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-b from-[#131b2f] to-[#0c1220] p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-2.5 shadow-lg shadow-amber-500/10 mb-4">
            <DiyaFlameIcon className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Instructions Dispatched</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an account with that email exists, password reset instructions and security token have been generated.
            </p>
            <div className="pt-2">
              <Link to="/reset-password" className="text-xs text-amber-400 font-bold hover:underline">
                Have a reset token? Click here to set new password &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Email Address
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-slate-950 font-bold"
            >
              Send Reset Instructions
            </Button>
          </form>
        )}

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
