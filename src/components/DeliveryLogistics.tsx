import React, { useState } from 'react';
import { DeliveryTruck } from '../types';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2, PhoneCall, Scale, Compass, ChevronRight } from 'lucide-react';

interface DeliveryLogisticsProps {
  trucks: DeliveryTruck[];
  phone: string;
}

export const DeliveryLogistics: React.FC<DeliveryLogisticsProps> = ({ trucks, phone }) => {
  const [selectedZone, setSelectedZone] = useState<string>('khulna');

  const coverageZones = [
    { id: 'khulna', name: 'খুলনা শহর ও সোনাডাঙ্গা', time: '১-২ ঘন্টা', cost: 'ফ্রি / সর্বনিম্ন চার্জ' },
    { id: 'rupsha', name: 'রূপসা, দৌলতপুর ও ফুলবাড়ীগেট', time: '২-৩ ঘন্টা', cost: 'সুলভ পরিবহন চার্জ' },
    { id: 'bagerhat', name: 'বাগেরহাট ও নোয়াপাড়া', time: '৩-৪ ঘন্টা', cost: 'পাইকারি ট্রাক রেট' },
    { id: 'satkhira', name: 'সাতক্ষীরা ও যশোর এলাকা', time: 'সময়ের সাথে সমন্বিত', cost: 'সরাসরি ড্রাইভার ফেয়ার' },
  ];

  const currentZone = coverageZones.find((z) => z.id === selectedZone) || coverageZones[0];

  return (
    <section id="delivery" className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-4">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>নিজস্ব পরিবহন ও ডেলিভারি বহর</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            দ্রুততম সময়ে সরাসরি সাইটে ডেলিভারি
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            কবীর এন্টারপ্রাইজের নিজস্ব ট্রেইলারে রড, টিপার ট্রাকে বালি-ইট এবং ছোট পিকআপে জরুরি অর্ডার মুহূর্তেই আপনার প্রজেক্ট সাইটে পৌছে দেওয়া হয়
          </p>
        </div>

        {/* Core Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">অন-টাইম প্রতিশ্রুতি</h3>
            <p className="text-xs text-slate-300">
              অর্ডার চূড়ান্ত হওয়ার পর সময়মতো সাইটে ট্রাক উপস্থিত করা আমাদের দায়িত্ব
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">ডিজিটাল স্কেল ওজন</h3>
            <p className="text-xs text-slate-300">
              কম্পিউটারাইজড ডিজিটাল স্কেলে পরিমাপকৃত নির্ভুল ওজন ও সিএফটি মাপ
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">সাইট আনলোডিং সার্ভিস</h3>
            <p className="text-xs text-slate-300">
              অভিজ্ঞ লেবার টিম দিয়ে নিরাপদ আনলোডিং ও সাইটে সাজিয়ে রাখার ব্যবস্থা
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">জিপিএস লাইব ট্র্যাকিং</h3>
            <p className="text-xs text-slate-300">
              অর্ডারকৃত গাড়ি এখন কোন রাস্তায় আছে কল দিয়ে লাইভ আপডেট পাওয়ার সুবিধা
            </p>
          </div>
        </div>

        {/* Trucks Fleet Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
            <Truck className="w-6 h-6 text-amber-400" />
            <span>আমাদের ট্রাক ও গাড়ি বহর (Transport Fleet)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/70 hover:border-amber-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      রেডি টু স্পট
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2 leading-snug">
                    {truck.title}
                  </h4>

                  <div className="text-xs text-amber-300 font-semibold mb-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80">
                    ধারণক্ষমতা: {truck.capacity}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-4">
                    {truck.idealFor}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>অবস্থা: ফ্রি সার্ভিস</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Coverage & Estimated Time Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-6 sm:p-10 border border-slate-700 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>ডেলিভারি কভারেজ এরিয়া</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              আপনার এলাকা সিলেক্ট করে আনুমানিক ডেলিভারি সময় দেখুন
            </h3>

            <div className="flex flex-wrap gap-2 pt-2">
              {coverageZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedZone === zone.id
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Estimate Box */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-700/80 w-full lg:w-80 shadow-inner flex flex-col justify-between shrink-0">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {currentZone.name}
              </span>
              <div className="text-2xl font-black text-amber-400 mb-4">
                {currentZone.time}
              </div>

              <div className="space-y-2 text-xs text-slate-300 mb-6">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">পরিবহন ভাড়া:</span>
                  <span className="font-bold text-white">{currentZone.cost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">সর্বনিম্ন অর্ডার:</span>
                  <span className="font-bold text-emerald-400">পণ্যভেদে প্রযোজ্য</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${phone}`}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>ডেলিভারি বুকিং করতে কল দিন</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
