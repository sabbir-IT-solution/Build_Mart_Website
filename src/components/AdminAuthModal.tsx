import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound, ShieldAlert, Sparkles, User, HelpCircle, Crown, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminRole } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, role: AdminRole) => void;
  ownerLogo?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ownerLogo,
}) => {
  const [username, setUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !inputPassword) {
      setErrorMsg('ইউজারনেম ও পাসওয়ার্ড লিখুন');
      return;
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: inputPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.token) throw new Error();
      setErrorMsg('');
      setUsername('');
      setInputPassword('');
      onSuccess(data.token, data.role === 'owner' ? 'owner' : 'developer');
    } catch {
      setErrorMsg('ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryKey.trim() || recoveryPassword.length < 6) return setErrorMsg('Recovery Key এবং অন্তত ৬ অক্ষরের পাসওয়ার্ড দিন।');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: recoveryPassword, recoveryKey: recoveryKey.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'পাসওয়ার্ড পরিবর্তন করা যায়নি।');
      setRecoveryMode(false); setRecoveryKey(''); setRecoveryPassword(''); setInputPassword('');
      setErrorMsg('পাসওয়ার্ড পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
    } catch (error) { setErrorMsg(error instanceof Error ? error.message : 'পাসওয়ার্ড পরিবর্তন করা যায়নি।'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden select-none"
        >
          {/* Deep Dark Purple Gradient Backdrop with Glowing Liquid Waves */}
          <div className="absolute inset-0 bg-[#0d021f] bg-gradient-to-br from-[#1b0338] via-[#0f0124] to-[#070014]" />
          
          {/* Glowing Ambient Radial Effects */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />

          {/* GLASSMORPHISM CARD CONTAINER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-[32px] sm:rounded-[40px] bg-white/5 p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 backdrop-blur-2xl text-white overflow-hidden"
          >
            {/* Subtle Inner Glass Sheen */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              {/* Owner logo → enterprise name → welcome header */}
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-lg">
                <img src={ownerLogo || '/kabir-logo.jpg'} alt="Owner logo" className="h-full w-full object-cover" />
              </div>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-purple-300/80">
                KABIR ENTERPRISES
              </h2>
              <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight font-serif">
                Welcome Back, Kabir
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-purple-200/75">
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-1"><Crown className="h-3 w-3 text-amber-300" />Owner</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/25 bg-sky-300/10 px-2 py-1"><Code2 className="h-3 w-3 text-sky-300" />Developer</span>
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-center gap-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 p-3.5 text-xs font-semibold text-rose-200 backdrop-blur-md"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={recoveryMode ? resetPassword : handleSubmit} className="space-y-4">
              
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-purple-200/90 tracking-wide">
                  Email address / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="আপনার ইউজারনেম"
                    className="w-full rounded-2xl border border-white/20 bg-purple-950/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-purple-400 focus:bg-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-purple-200/90 tracking-wide">
                  {recoveryMode ? 'নতুন Password' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={recoveryMode ? recoveryPassword : inputPassword}
                    onChange={(e) => {
                      if (recoveryMode) setRecoveryPassword(e.target.value); else setInputPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/20 bg-purple-950/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-purple-400 focus:bg-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all pr-11"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {recoveryMode && <div className="space-y-1.5"><label className="block text-xs font-medium text-purple-200/90 tracking-wide">Recovery Key</label><input type="password" value={recoveryKey} onChange={(e) => setRecoveryKey(e.target.value)} placeholder="আপনার সেভ করা Recovery Key" className="w-full rounded-2xl border border-white/20 bg-purple-950/30 px-4 py-3 text-sm text-white focus:border-purple-400 focus:outline-none" /></div>}

              {/* Forgot Password Link */}
              <div className="flex justify-between items-center text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setRecoveryMode(true); setErrorMsg(''); }}
                  className="text-purple-300/80 hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Forget Password?</span>
                </button>
              </div>

              {/* Help Box if clicked */}
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-2xl bg-purple-950/60 border border-purple-400/30 text-xs text-purple-200 leading-relaxed"
                >
                  ইউজারনেম বা পাসওয়ার্ড পরিবর্তন করতে Account Security থেকে একটি Recovery Key সেট করুন।
                </motion.div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold text-base shadow-[0_10px_25px_rgba(168,85,247,0.4)] border border-white/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"><span>{recoveryMode ? (isSubmitting ? 'পরিবর্তন হচ্ছে...' : 'Recovery Key দিয়ে পরিবর্তন করুন') : 'Login'}</span></button>
              {recoveryMode && <button type="button" onClick={() => { setRecoveryMode(false); setErrorMsg(''); }} className="w-full text-xs text-purple-200 hover:text-white">লগইনে ফিরে যান</button>}
            </form>

            {/* Bottom Footer Note */}
            <div className="mt-8 text-center text-xs text-purple-200/70 font-medium">
              <span>Are You Admin ? </span>
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="text-white font-bold hover:underline cursor-pointer ml-1"
              >
                Sign IN
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
