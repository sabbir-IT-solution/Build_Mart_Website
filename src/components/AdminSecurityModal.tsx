import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, EyeOff, KeyRound, ShieldAlert, ShieldCheck, User, X } from 'lucide-react';
import { AdminRole, SiteData } from '../types';

interface Props {
  isOpen: boolean; onClose: () => void; siteData: SiteData; authToken: string; role: AdminRole;
  onCredentialsUpdated: (data: Pick<SiteData, 'adminUsername' | 'adminPassword'>) => void;
}

export const AdminSecurityModal: React.FC<Props> = ({ isOpen, onClose, siteData, authToken, role, onCredentialsUpdated }) => {
  const isDeveloper = role === 'developer';
  const [username, setUsername] = useState('kabir');
  const [password, setPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUsername(isDeveloper ? 'sabbir' : siteData.adminUsername || 'kabir');
    setPassword(''); setRecoveryKey(''); setMessage(null);
  }, [isOpen, isDeveloper, siteData.adminUsername]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < (isDeveloper ? 4 : 6) || (!isDeveloper && (!username.trim() || recoveryKey.trim().length < 6))) {
      return setMessage({ text: isDeveloper ? 'কমপক্ষে ৪ অক্ষরের password দিন।' : 'ইউজারনেম, অন্তত ৬ অক্ষরের পাসওয়ার্ড ও Recovery Key দিন।', error: true });
    }
    setLoading(true);
    try {
      const response = await fetch(isDeveloper ? '/api/developer/update-credentials' : '/api/admin/update-credentials', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(isDeveloper ? { password } : { username: username.trim(), password, recoveryKey: recoveryKey.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'সেভ করা যায়নি।');
      if (!isDeveloper) onCredentialsUpdated({ adminUsername: data.adminUsername, adminPassword: data.adminPassword });
      setMessage({ text: isDeveloper ? 'Developer password পরিবর্তন হয়েছে।' : 'Security settings সেভ হয়েছে। Recovery Key নিরাপদে লিখে রাখুন।' });
    } catch (error) { setMessage({ text: error instanceof Error ? error.message : 'সেভ করা যায়নি।', error: true }); }
    finally { setLoading(false); }
  };

  return <AnimatePresence>{isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden p-4"><div className="absolute inset-0 bg-gradient-to-br from-[#1b0338] via-[#0f0124] to-[#070014]" /><motion.form onSubmit={save} initial={{ scale: .92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .92, opacity: 0 }} className="relative w-full max-w-md rounded-[32px] border border-white/20 bg-white/5 p-6 text-white shadow-2xl backdrop-blur-2xl sm:p-9"><button type="button" onClick={onClose} className="absolute right-5 top-5 p-2 text-white/60 hover:text-white"><X className="h-5 w-5" /></button><div className="mb-6 text-center"><ShieldCheck className="mx-auto mb-3 h-8 w-8 text-purple-200" /><p className="text-xs font-bold tracking-[.3em] text-purple-300">{isDeveloper ? 'DEVELOPER ACCOUNT' : 'KABIR ENTERPRISES'}</p><h2 className="mt-2 font-serif text-2xl">{isDeveloper ? 'Developer Security' : 'Account Security'}</h2><p className="mt-1 text-xs text-purple-200/75">{isDeveloper ? 'Sabbir-এর password পরিবর্তন করুন' : 'Recovery Key দিয়ে password পুনরুদ্ধার করা যাবে'}</p></div>{message && <div className={`mb-4 flex gap-2 rounded-2xl border p-3 text-xs ${message.error ? 'border-rose-500/40 bg-rose-500/20 text-rose-100' : 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'}`}><ShieldAlert className="h-4 w-4 shrink-0" />{message.text}</div>}<div className="space-y-4"><label className="block text-xs text-purple-200">ইউজারনেম<div className="relative mt-1.5"><input value={username} disabled={isDeveloper} onChange={e => setUsername(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-purple-950/30 px-4 py-3 pr-10 outline-none focus:border-purple-400 disabled:opacity-60" /><User className="absolute right-3 top-3 h-4 w-4 text-white/40" /></div></label><label className="block text-xs text-purple-200">নতুন পাসওয়ার্ড<div className="relative mt-1.5"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-purple-950/30 px-4 py-3 pr-10 outline-none focus:border-purple-400" /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-3 text-white/50">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>{!isDeveloper && <label className="block text-xs text-purple-200">Recovery Key<div className="relative mt-1.5"><input type="password" value={recoveryKey} onChange={e => setRecoveryKey(e.target.value)} placeholder="নিজের গোপন একটি key লিখুন" className="w-full rounded-2xl border border-white/20 bg-purple-950/30 px-4 py-3 pr-10 outline-none focus:border-purple-400" /><KeyRound className="absolute right-3 top-3 h-4 w-4 text-white/40" /></div></label>}<button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3.5 text-sm font-bold disabled:opacity-60">{loading ? 'সেভ হচ্ছে...' : 'Password সেভ করুন'}</button></div></motion.form></motion.div>}</AnimatePresence>;
};
