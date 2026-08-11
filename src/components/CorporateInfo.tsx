import React from 'react';
import { ShieldCheck, Award, Truck, Scale, Building2, CheckCircle2, FileCheck, PhoneCall, Users, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteData } from '../types';

interface CorporateInfoProps {
  siteData: SiteData;
}

export const CorporateInfo: React.FC<CorporateInfoProps> = ({ siteData }) => {
  const brandName = siteData.brandName || 'কবীর এন্টারপ্রাইজ (KABIR ENTERPRISES)';

  const partnerBrands = [
    { name: 'BSRM Steels', type: 'রড ও অ্যান্কেল', logoText: 'BSRM' },
    { name: 'KSRM Steels', type: 'হাই গ্রেড রড', logoText: 'KSRM' },
    { name: 'AKS Steels', type: 'প্রিমিয়াম রড', logoText: 'AKS' },
    { name: 'Crown Cement', type: 'পিসি সিওসি সিমেন্ট', logoText: 'CROWN' },
    { name: 'Shah Cement', type: 'পিসিসি ও ওপিসি', logoText: 'SHAH' },
    { name: 'Seven Rings Cement', type: 'মজবুত সিমেন্ট', logoText: '7RINGS' },
    { name: 'Holcim Cement', type: 'আন্তর্জাতিক মানের', logoText: 'HOLCIM' },
    { name: 'Mirpur Bricks', type: 'অটো ইট ও ব্লক', logoText: 'BRICKS' },
  ];

  const stats = [
    { icon: <Clock className="w-6 h-6 text-amber-500" />, label: 'অভিজ্ঞতা', value: '১০+ বছর' },
    { icon: <Users className="w-6 h-6 text-amber-500" />, label: 'সন্তুষ্ট ক্লায়েন্ট', value: '৫,০০০+' },
    { icon: <Truck className="w-6 h-6 text-amber-500" />, label: 'ডেলিভারি সম্পন্ন', value: '৫০,০০০+ টন' },
    { icon: <Award className="w-6 h-6 text-amber-500" />, label: 'সঠিক ওজন ও মান', value: '১০০% গ্যারান্টি' },
  ];

  const coreServices = [
    {
      title: 'মিল-ডিরেক্ট অরিজিনাল রড',
      desc: 'বিএসআরএম, কেএসআরএম, একেএস সহ সেরা ৫টি ব্র্যান্ডের রড সরাসরি মিল রেটে সরবরাহ।',
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
    },
    {
      title: 'তাজা ও নতুন সিমেন্ট',
      desc: 'সরাসরি কোম্পানি ডিপো থেকে তাজা প্রস্তুতকৃত ও সঠিক ওজনের সিমেন্ট ব্যাগ।',
      icon: <CheckCircle2 className="w-6 h-6 text-amber-600" />,
    },
    {
      title: 'ডিজিটাল ওয়েইট স্কেল ওজন',
      desc: 'প্রতিটি গাড়ি কম্পিউটারাইজড স্কেলে মেপে সঠিক চালানের মাধ্যমে সাইটে পাঠানো হয়।',
      icon: <Scale className="w-6 h-6 text-amber-600" />,
    },
    {
      title: 'দ্রুত সাইট অন-টাইম ডেলিভারি',
      desc: 'আমাদের নিজস্ব মিনি ট্রাক ও ভারী ট্রলারের মাধ্যমে যেকোনো সাইটে জরুরি ডেলিভারি।',
      icon: <Truck className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest shadow-xs">
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>অনুমোদিত ও রেজিস্টার্ড গভঃ ট্রেডার্স</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0b2942]">
            অফিসিয়াল কর্পোরেট পরিচিতি
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <strong className="text-slate-900">{brandName}</strong> বাংলাদেশের অন্যতম বিশ্বস্ত নির্মাণ সামগ্রী সরবরাহকারী প্রতিষ্ঠান। আমরা সেরা মানের রড, সিমেন্ট, ইট, বালি ও পাথর সুনির্দিষ্ট ওজনে আপনার প্রজেক্টে পৌঁছে দিই।
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col items-center text-center space-y-2 hover:border-amber-500/50 transition-colors"
            >
              <div className="p-3 bg-slate-800 rounded-xl mb-1">{st.icon}</div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{st.value}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-300">{st.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Core Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreServices.map((srv, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 w-fit rounded-xl bg-amber-100/80 border border-amber-200">
                  {srv.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0b2942]">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{srv.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-bold text-amber-700">
                <span>১০০% অফিসিয়াল কোয়ালিটি</span>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Brands Strip */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">ডিস্ট্রিবিউটর ও অফিসিয়াল ডিলারশিপ</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white">দেশসেরা বিশ্বস্ত ব্রান্ডের সরবরাহকারী</h3>
            </div>
            <a
              href={`tel:${siteData.phone}`}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg"
            >
              <PhoneCall className="w-4 h-4" />
              <span>বাল্ক অর্ডারের জন্য কল করুন</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {partnerBrands.map((brand, bIdx) => (
              <div
                key={bIdx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center flex flex-col items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <span className="text-amber-400 font-extrabold text-sm tracking-wider">{brand.logoText}</span>
                <span className="text-[10px] text-slate-300 font-medium mt-0.5">{brand.type}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
