import React from 'react';
import { SiteData } from '../types';
import { Heart, Code2, ExternalLink, Phone, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  siteData: SiteData;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ siteData, onOpenAdmin }) => {
  const devName = siteData.devBrandName || 'Sabbir IT & Web Solutions';
  const devTagline = siteData.devTagline || 'ওয়েবসাইট ডিজাইন ও ডেভেলপার ক্রেডিট';

  return (
    <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          
          {/* Highlighted Creator / Web Developer Advertisement Badge with Continuous Shaking Animation */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              x: [0, -5, 5, -5, 5, -3, 3, 0],
              y: [0, -3, 3, -3, 3, 0],
              rotate: [0, -1.5, 1.5, -1.5, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-slate-900/95 border-2 border-amber-500/80 p-4 sm:p-5 rounded-2xl shadow-2xl shadow-amber-500/30 max-w-lg w-full md:w-auto relative overflow-hidden group"
          >
            {/* Background subtle sheen & glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-amber-500/30 transition-all" />

            {/* Developer Logo (Enlarged with Golden Frame) */}
            <div className="relative shrink-0">
              {siteData.devLogo ? (
                <img
                  src={siteData.devLogo}
                  alt={devName}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-4 ring-amber-400/90 shadow-xl shadow-amber-500/30 bg-slate-950 shrink-0"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black text-3xl sm:text-4xl shadow-xl shadow-amber-500/30 ring-4 ring-amber-400/90 shrink-0">
                  {devName.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Badge Overlay */}
              <div className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-lg shadow-md border border-slate-950">
                <Code2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-500/40 uppercase tracking-wide flex items-center gap-1 shadow-xs animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>ওয়েবসাইট প্রস্তুতকারক (Developer)</span>
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white leading-snug tracking-tight">
                {devName}
              </p>
              <p className="text-xs text-slate-300 leading-snug">
                {devTagline}
              </p>
              {(siteData.devWebsiteUrl || siteData.devPhone) && (
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-bold text-amber-400">
                  {siteData.devWebsiteUrl && (
                    <a
                      href={siteData.devWebsiteUrl.startsWith('http') ? siteData.devWebsiteUrl : `https://${siteData.devWebsiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                    >
                      <span>পোর্টফোলিও লিঙ্ক</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {siteData.devPhone && (
                    <a href={`tel:${siteData.devPhone}`} className="hover:underline text-slate-200 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{siteData.devPhone}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#products" className="hover:text-amber-400 transition-colors">পণ্যসমূহ</a>
            <a href="#quote" className="hover:text-amber-400 transition-colors">কোটেশন</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Owner Profile</a>
            <button
              onClick={onOpenAdmin}
              className="text-amber-400 hover:underline font-bold"
            >
              সাইট এডিটর (Admin)
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-200">{siteData.brandName}</strong> — সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="flex items-center gap-1">
            <span>বিশ্বস্ততার সাথে নির্মাণের বিশ্বস্ত পার্টনার</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};

