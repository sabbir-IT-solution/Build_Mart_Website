import React from 'react';
import { SiteData } from '../types';
import { ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  siteData: SiteData;
}

export const Hero: React.FC<HeroProps> = ({
  siteData,
}) => {
  const bannerImgSrc = siteData.heroBgImage || '/kabir-banner.jpg';

  const bgStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(7, 29, 51, 0.88) 0%, rgba(7, 29, 51, 0.65) 45%, rgba(9, 36, 62, 0.25) 100%), url('${bannerImgSrc}')`,
    backgroundPosition: 'center right',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section style={bgStyle} className="relative overflow-hidden text-white py-16 sm:py-24 lg:py-28 border-b border-amber-500/20">
      
      {/* Subtle overlay accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        
        {/* Main Content Area over the background banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl space-y-6"
        >
          
          {/* Top Badge */}
          {siteData.heroBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500/25 backdrop-blur-md border border-amber-500/50 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-300 shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{siteData.heroBadge}</span>
            </motion.div>
          )}

          {/* Hero Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-lg"
          >
            {siteData.heroTitle || 'কবীর এন্টারপ্রাইজ'}
          </motion.h1>

          {/* Subheading / Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-100 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl drop-shadow-md bg-slate-950/20 backdrop-blur-[2px] p-2 rounded-xl"
          >
            {siteData.heroText || 'আপনার স্বপ্নের নির্মাণে বিশ্বস্ত সঙ্গী — ইট | বালি | রড | সিমেন্ট'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="pt-2 flex flex-wrap items-center gap-4"
          >
            <a
              href="#quote"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 transition-all shadow-xl shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>কোটেশন নিন</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 px-5 py-3.5 text-sm sm:text-base font-bold text-white transition-all hover:border-amber-400/80 shadow-md"
            >
              <span>Owner যোগাযোগ</span>
            </a>
          </motion.div>

        </motion.div>

        {/* Value Props Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-200"
        >
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/15 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">১০০% সঠিক পরিমাপ</p>
              <p className="text-[11px] text-slate-300">সততা ও সেরা মানের নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/15 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">অন-সাইট ডেলিভারি</p>
              <p className="text-[11px] text-slate-300">সরাসরি প্রজেক্ট সাইটে পৌঁছানো হয়</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/15 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">ন্যায্য পাইকারি রেট</p>
              <p className="text-[11px] text-slate-300">সর্বোত্তম পাইকারি ও খুচরা রেট</p>
            </div>
          </div>
        </motion.div>

      </div>

    </section>
  );
};
