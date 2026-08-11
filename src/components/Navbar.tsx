import React, { useState } from 'react';
import { SiteData } from '../types';
import { Phone, MessageSquare, Menu, X, Building2, ShoppingBag, FileText, Lock, ShieldCheck, Mail, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  siteData: SiteData;
  inquiriesCount: number;
  onOpenAdmin: () => void;
  onOpenInquiries: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteData,
  inquiriesCount,
  onOpenAdmin,
  onOpenInquiries,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200">
      
      {/* Official Top Announcement / Corporate Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>গভঃ অনুমোদিত ট্রেডার্স</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>সকাল ৮:০০ - রাত ৯:০০ (প্রতিদিন খোলা)</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-medium">
            <a href={`tel:${siteData.phone}`} className="hover:text-amber-400 flex items-center gap-1 transition-colors">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>হটলাইন: {siteData.phone}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{siteData.email || 'info@kabirtrade.com'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          {siteData.logo ? (
            <img
              src={siteData.logo}
              alt={siteData.brandName}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm ring-1 ring-slate-200 group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2942] flex items-center gap-1.5">
              <Building2 className="h-6 w-6 text-amber-500 inline-block md:hidden" />
              {siteData.brandName}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-amber-600 -mt-0.5 tracking-wider uppercase flex items-center gap-1">
              <span>অফিসিয়াল কর্পোরেট পোর্টাল</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-bold text-slate-700">
          <a href="#about" className="hover:text-amber-600 transition-colors flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-500" />
            পরিচয়
          </a>
          <a href="#products" className="hover:text-amber-600 transition-colors flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            পণ্যসমূহ
          </a>
          <a href="#reviews" className="hover:text-amber-600 transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            রিভিউ
          </a>
          <a href="#quote" className="hover:text-amber-600 transition-colors flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-500" />
            কোটেশন
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Direct Phone Call */}
          <a
            href={`tel:${siteData.phone}`}
            className="flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-bold text-slate-900 transition-colors border border-slate-200"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>{siteData.phone}</span>
          </a>

          {/* Customer Quote Inquiries Inbox Button */}
          <button
            onClick={onOpenInquiries}
            className="relative flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
            title="গ্রাহকদের প্রেরিত কোটেশন ইনকোয়ারি সমুহ"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>ইনকোয়ারি</span>
            {inquiriesCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950"
              >
                {inquiriesCount}
              </motion.span>
            )}
          </button>

          {/* Site Editor Admin Login Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer ring-2 ring-amber-300"
          >
            <Lock className="w-3.5 h-3.5 text-slate-950" />
            <span>এডমিন লগইন</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenInquiries}
            className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            title="ইনকোয়ারি বক্স"
          >
            <MessageSquare className="w-5 h-5 text-slate-800" />
            {inquiriesCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {inquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>এডমিন</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-3 shadow-lg overflow-hidden"
          >
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-slate-800 hover:text-amber-600"
            >
              কোম্পানি পরিচিতি
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-slate-800 hover:text-amber-600"
            >
              পণ্যসমূহ
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-slate-800 hover:text-amber-600"
            >
              গ্রাহক রিভিউ
            </a>
            <a
              href="#quote"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-slate-800 hover:text-amber-600"
            >
              কোটেশন নিন
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-slate-800 hover:text-amber-600"
            >
              যোগাযোগ
            </a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`tel:${siteData.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>কল করুন: {siteData.phone}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
