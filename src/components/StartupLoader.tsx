import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteData } from '../types';
import { Building2, Sparkles, ArrowUpRight } from 'lucide-react';

interface StartupLoaderProps {
  siteData: SiteData;
  onComplete: () => void;
  isTestMode?: boolean;
}

export const StartupLoader: React.FC<StartupLoaderProps> = ({ siteData, onComplete, isTestMode = false }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'move' | 'finished'>('loading');

  const duration = siteData.loadingDuration || 2.8;
  const brandTitle = siteData.loadingTitle || siteData.brandName || 'KABIR ENTERPRISES';
  const logoUrl = siteData.loadingLogo || siteData.logo || '/kabir-logo.jpg';
  const bgColor = siteData.loadingBgColor || '#000000';
  const accentColor = siteData.loadingAccentColor || '#3b82f6';

  // Animate progress 0 -> 100%
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const totalMs = duration * 1000;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const currentProg = Math.min(100, Math.floor((elapsed / totalMs) * 100));

      setProgress(currentProg);

      if (currentProg < 100) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        // Step 2: Switch to Reveal Phase (show logo)
        setTimeout(() => {
          setPhase('reveal');
        }, 300);

        // Step 3: Switch to Move Phase (logo & text rise up to navbar)
        setTimeout(() => {
          setPhase('move');
        }, 1200);

        // Step 4: Complete & unmount loader
        setTimeout(() => {
          setPhase('finished');
          onComplete();
        }, 2100);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [duration, onComplete]);

  if (phase === 'finished') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="startup-loader"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'move' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
        style={{ backgroundColor: bgColor }}
      >
        {/* Subtle radial glow background */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: accentColor }}
        />

        {/* Skip Button */}
        {!isTestMode && (
          <button
            onClick={() => {
              setPhase('finished');
              onComplete();
            }}
            className="absolute top-6 right-6 z-50 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-bold backdrop-blur-md border border-white/10 transition-all"
          >
            এড়িয়ে যান (Skip) →
          </button>
        )}

        {/* MAIN CONTAINER: Animated Logo / Counter & Liquid Wave */}
        <div className="relative flex flex-col items-center justify-center z-10 w-full max-w-sm px-4">
          
          {/* LOGO & BRAND TITLE RISING UP ANIMATION */}
          <motion.div
            animate={
              phase === 'move'
                ? {
                    y: -window.innerHeight * 0.42,
                    scale: 0.45,
                    opacity: 0,
                  }
                : phase === 'reveal'
                ? {
                    y: [20, 0],
                    scale: [0.9, 1.05, 1],
                    opacity: 1,
                  }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={{
              duration: phase === 'move' ? 0.9 : 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center text-center"
          >
            {/* Liquid Circle or Brand Logo */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden flex items-center justify-center border-2 border-white/20 shadow-2xl bg-black/60 backdrop-blur-sm">
              
              {/* LIQUID WAVE ANIMATION (Phases: 'loading') */}
              {phase === 'loading' && (
                <>
                  {/* Wave Fill Background */}
                  <div
                    className="absolute bottom-0 left-0 right-0 w-full transition-all duration-100 ease-out overflow-hidden"
                    style={{
                      height: `${progress}%`,
                      backgroundColor: accentColor,
                    }}
                  >
                    {/* Animated Sine Wave Header */}
                    <div className="absolute -top-4 left-0 right-0 w-[200%] h-8 flex animate-wave">
                      <svg
                        className="w-full h-full text-white/30 fill-current"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                      >
                        <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,40 L1200,120 L0,120 Z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Percentage Number Display inside liquid */}
                  <div className="relative z-20 flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-md font-serif">
                      {progress}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 mt-1">
                      LOADING %
                    </span>
                  </div>
                </>
              )}

              {/* BRAND LOGO REVEAL (Phases: 'reveal' & 'move') */}
              {(phase === 'reveal' || phase === 'move') && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="w-full h-full p-2 flex items-center justify-center bg-slate-950 rounded-full"
                >
                  <img
                    src={logoUrl}
                    alt={brandTitle}
                    className="w-full h-full object-cover rounded-full border border-amber-500/40 shadow-inner"
                    onError={(e) => {
                      // Fallback icon if image fails to load
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {!logoUrl && (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950">
                      <Building2 className="w-16 h-16" />
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* BRAND TITLE / NAME TEXT */}
            <div className="mt-6 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white font-serif uppercase">
                {brandTitle}
              </h1>
              <p className="text-xs text-amber-400 font-bold tracking-widest uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BUILDING MATERIALS & LOGISTICS</span>
              </p>
            </div>
          </motion.div>

          {/* SLEEK PROGRESS BAR (Active during loading phase) */}
          <AnimatePresence>
            {phase === 'loading' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-xs mt-8 space-y-2"
              >
                <div className="w-full h-2.5 bg-white/10 rounded-full p-0.5 border border-white/20 shadow-inner overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150 ease-out shadow-lg"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-white/60">
                  <span>সাইট লোড হচ্ছে...</span>
                  <span>{progress}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
