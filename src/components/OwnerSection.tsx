import React from 'react';
import { SiteData } from '../types';
import { Phone, MessageSquare, MapPin, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface OwnerSectionProps {
  siteData: SiteData;
}

export const OwnerSection: React.FC<OwnerSectionProps> = ({ siteData }) => {
  const cleanPhone = siteData.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/88${cleanPhone}`;

  return (
    <section id="contact" className="py-20 bg-slate-950/95 border-t border-slate-800 relative overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Animated Card Container with Softened Dimmed Neon Border */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative group rounded-[30px] p-[1.5px] bg-gradient-to-r from-amber-500/50 via-amber-300/40 to-amber-600/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all duration-500"
        >
          {/* Subtler/Dimmer Neon Glow Background Effect */}
          <div className="absolute -inset-0.5 rounded-[32px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 opacity-25 blur-md group-hover:opacity-40 transition duration-500 pointer-events-none" />

          {/* Card Inner Body */}
          <div className="relative bg-slate-900/95 rounded-[28px] p-6 sm:p-9 border border-amber-500/20 overflow-hidden shadow-2xl backdrop-blur-xl">
            
            {/* Corner Soft Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 blur-2xl rounded-full pointer-events-none" />
            
            {/* Top Right Verified Owner Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] sm:text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 fill-slate-950 text-amber-400" />
              <span>ভেরিফাইড Owner</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 relative z-10">
              
              {/* Owner Photo with Thinner Golden Frame */}
              <div className="relative shrink-0">
                <div className="p-1 sm:p-1.5 bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 rounded-2xl shadow-lg shadow-amber-500/15 border border-amber-300/80 relative group/photo">
                  {/* Decorative Subtle Corner Accents */}
                  <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t border-l border-amber-100 rounded-tl-sm pointer-events-none" />
                  <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 border-t border-r border-amber-100 rounded-tr-sm pointer-events-none" />
                  <div className="absolute bottom-0.5 left-0.5 w-2.5 h-2.5 border-b border-l border-amber-100 rounded-bl-sm pointer-events-none" />
                  <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b border-r border-amber-100 rounded-br-sm pointer-events-none" />

                  {/* Inner Bezel Container */}
                  <div className="p-0.5 bg-slate-950 rounded-[14px] shadow-inner border border-amber-400/50 overflow-hidden">
                    {siteData.ownerPhoto ? (
                      <img
                        src={siteData.ownerPhoto}
                        alt={siteData.ownerName}
                        className="h-36 w-36 sm:h-44 sm:w-44 rounded-xl object-cover shadow-md transition-transform duration-500 group-hover/photo:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    ) : (
                      <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-xl bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-4xl shadow-inner">
                        {siteData.ownerName.charAt(0) || 'O'}
                      </div>
                    )}
                  </div>

                  {/* Golden Verified Badge Ribbon on Photo */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase shadow-md border border-amber-200 whitespace-nowrap flex items-center gap-1 tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-slate-950 fill-amber-300" />
                    <span>স্বত্বাধিকারী</span>
                  </div>
                </div>
              </div>

              {/* Owner Info & Details */}
              <div className="text-center sm:text-left space-y-3 flex-1">
                <div>
                  <span className="text-xs font-black text-amber-400 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-1 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20 w-fit mx-auto sm:mx-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Owner & Founder</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 drop-shadow-sm">
                    {siteData.ownerName || 'কবীর হোসেন'}
                  </h2>
                  <p className="text-xs font-bold text-amber-400/90 mt-0.5">
                    {siteData.ownerTitle || 'Owner & স্বত্বাধিকারী'}
                  </p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800 max-w-xl">
                  {siteData.ownerIntro ||
                    'দীর্ঘ ১০ বছর ধরে সৎ ও সুনামের সাথে মানসম্মত নির্মাণ সামগ্রী সরবরাহ করে আসছি। সততা ও সঠিক পরিমাপই আমাদের মূল ভিত্তি।'}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={`tel:${siteData.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-4 py-2.5 text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 fill-slate-950" />
                    <span>সরাসরি কথা বলুন</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md active:scale-95 border border-emerald-500/50"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>হোয়াটসঅ্যাপ মেসেজ</span>
                  </a>

                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{siteData.address}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

