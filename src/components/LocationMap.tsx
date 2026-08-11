import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, CheckCircle } from 'lucide-react';
import { SiteData } from '../types';

interface LocationMapProps {
  siteData: SiteData;
}

export const LocationMap: React.FC<LocationMapProps> = ({ siteData }) => {
  const directMapUrl = 'https://maps.app.goo.gl/8Y6He4RKovoMAfdH9';
  const plusCode = 'RH99+72 Khulna';
  const address = siteData.address || 'সোনাডাঙ্গা, খুলনা';
  const mapQuery = encodeURIComponent('RH99+72 Khulna');

  return (
    <section className="py-20 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Navigation className="w-4 h-4" />
              অফিসিয়াল ঠিকানা ও ইয়ার্ড লোকেশন
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              সরাসরি অফিসে আসুন অথবা ভিজিট করুন
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              আমাদের প্রধান শোরুম ও সেলস অফিসে এসে পণ্যের গুণগত মান সরাসরি যাচাই করে চুক্তি করতে পারেন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={directMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg"
            >
              <Navigation className="w-4 h-4" />
              <span>গুগল ম্যাপে শপ পিন দেখুন (Google Maps)</span>
            </a>
          </div>
        </div>

        {/* Info Grid + Map Frame */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Details Card */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-4">
                যোগাযোগের অফিসিয়াল তথ্য
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">ঠিকানা ও পিন লোকেশন</span>
                    <strong className="text-white text-base leading-snug block mt-0.5">{address}</strong>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      প্লাস কোড: RH99+72 Khulna
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">অফিসিয়াল হটলাইন</span>
                    <strong className="text-amber-400 text-lg font-bold block mt-0.5">{siteData.phone}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">ইমেইল ঠিকানা</span>
                    <strong className="text-white text-sm block mt-0.5">{siteData.email || 'info@kabirenterprises.com'}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">কর্মঘণ্টা</span>
                    <strong className="text-white text-sm block mt-0.5">প্রতিদিন সকাল ৮:০০ - রাত ৯:০০ (৭ দিন খোলা)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>সবচেয়ে দ্রুত অন-সাইট ডেলিভারি সিস্টেম</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>অফিসিয়ালাইজড কম্পিউটার চালান সুবিধা</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Iframe / Visual Location */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative min-h-[380px] bg-slate-950">
            <iframe
              title="Kabir Enterprise Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full hover:contrast-[110%] transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">পেনড শপ লোকেশন: RH99+72, খুলনা</span>
              </div>
              <a
                href={directMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 shrink-0"
              >
                গুগল ম্যাপে পিন খুলুন →
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
