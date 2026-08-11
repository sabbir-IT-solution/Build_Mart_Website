import React, { useState } from 'react';
import { SiteData, ProductItem, ProductCategory, AdminRole } from '../types';
import { X, Save, RotateCcw, Upload, Image as ImageIcon, Package, Plus, Trash2, Check, AlertCircle, Code2, Bell, Smartphone, Send, Sparkles, Play, Sliders, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: SiteData;
  onSaveSiteData: (data: SiteData) => void;
  products: ProductItem[];
  onUpdateProducts: (products: ProductItem[]) => void;
  onResetDefaults: () => void;
  onTestLoaderAnimation?: () => void;
  onOpenSecurity?: () => void;
  role: AdminRole;
  initialTab?: 'info' | 'images' | 'products' | 'notifications' | 'loader';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  siteData,
  onSaveSiteData,
  products,
  onUpdateProducts,
  onResetDefaults,
  onTestLoaderAnimation,
  onOpenSecurity,
  role,
  initialTab = 'info',
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'products' | 'notifications' | 'loader'>(initialTab);

  // Track previous isOpen state so we only reset tab & formData when opening modal
  const prevIsOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setActiveTab(initialTab);
      setFormData(siteData);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialTab, siteData]);

  // Local state for site info form
  const [formData, setFormData] = useState<SiteData>({ ...siteData });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local state for product adding
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductItem['category']>('rod');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>('');
  const [newProdUnit, setNewProdUnit] = useState('টন');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleChange = (key: keyof SiteData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const compressAndReadImage = (file: File, onComplete: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onComplete(dataUrl);
        } else {
          onComplete(event.target?.result as string);
        }
      };
      img.onerror = () => {
        onComplete(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof SiteData) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndReadImage(file, (base64) => {
      const updated = { ...formData, [key]: base64 };
      setFormData(updated);
      onSaveSiteData(updated);
      showToast('ছবি সফলভাবে আপলোড ও সেভ হয়েছে!');
    });
    e.target.value = '';
  };

  const handleNewProductImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndReadImage(file, (base64) => {
      setNewProdImg(base64);
      showToast('পণ্যের ছবি যুক্ত হয়েছে!');
    });
    e.target.value = '';
  };

  const handleExistingProductImgUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndReadImage(file, (base64) => {
      const updated = products.map((p) => (p.id === id ? { ...p, image: base64 } : p));
      onUpdateProducts(updated);
      showToast('পণ্যের ছবি সফলভাবে পরিবর্তন হয়েছে!');
    });
    e.target.value = '';
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteData(formData);
    showToast('সাইটের তথ্য সফলভাবে সেভ হয়েছে!');
  };

  // Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      alert('পণ্যের নাম এবং দাম লিখুন');
      return;
    }

    const newProduct: ProductItem = {
      id: 'prod-' + Date.now(),
      name: newProdName.trim(),
      category: newProdCategory,
      unitPrice: Number(newProdPrice),
      unit: newProdUnit.trim() || 'একক',
      minOrder: '১ ' + (newProdUnit.trim() || 'একক'),
      description: newProdDesc.trim() || 'উচ্চমানের পাইকারি নির্মাণ সামগ্রী।',
      inStock: true,
      image: newProdImg.trim() || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=400&q=80',
    };

    onUpdateProducts([newProduct, ...products]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImg('');
    showToast('নতুন পণ্য যুক্ত হয়েছে!');
  };

  // Toggle Stock
  const handleToggleStock = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    onUpdateProducts(updated);
  };

  // Update Price
  const handlePriceChange = (id: string, newPrice: number) => {
    const updated = products.map((p) => (p.id === id ? { ...p, unitPrice: newPrice } : p));
    onUpdateProducts(updated);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (confirm('আপনি কি এই পণ্যটি তালিকা থেকে মুছে ফেলতে চান?')) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      showToast('পণ্যটি মুছে ফেলা হয়েছে।');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex flex-col max-h-[92vh] w-full max-w-3xl rounded-[32px] border border-white/20 bg-[#16062e]/95 text-white shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden"
          >
            
            {/* Toast Alert */}
            <AnimatePresence>
              {toastMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>{toastMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">⚙ ওয়েবসাইট তথ্য এডিটর</h2>
                <p className="text-xs text-purple-200/80">
                  {role === 'owner' ? 'Owner panel — সব সেটিংস, নিরাপত্তা ও নোটিফিকেশন নিয়ন্ত্রণ।' : 'Developer panel — কনটেন্ট, ছবি, পণ্য ও লোডিং ডিজাইন নিয়ন্ত্রণ।'}
                </p>
                <span className="mt-2 inline-flex rounded-full border border-purple-300/30 bg-purple-400/15 px-3 py-1 text-[11px] font-bold text-purple-100">বর্তমানে এডিট করছেন: {role === 'owner' ? 'Owner' : 'Developer — Sabbir'}</span>
              </div>
              <div className="flex items-center gap-2">
                {role === 'owner' && <button onClick={onOpenSecurity} className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-violet-100 px-3 py-2 text-xs font-bold text-violet-800 hover:bg-violet-200 transition-colors" title="ইউজারনেম ও পাসওয়ার্ড পরিবর্তন">
                  <ShieldCheck className="w-4 h-4" /> Account Security
                </button>}
                <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-white/10 bg-white/5 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'info'
                    ? 'text-amber-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ১. সাধারণ তথ্য ও লেখা
                {activeTab === 'info' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>
              {role === 'owner' && <button
                onClick={() => setActiveTab('images')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'images'
                    ? 'text-amber-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>২. লোগো ও ছবি</span>
                {activeTab === 'images' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>}
              {role === 'owner' && <button
                onClick={() => setActiveTab('products')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'products'
                    ? 'text-amber-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>৩. পণ্য ক্যাটালগ</span>
                {activeTab === 'products' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>}
              {role === 'owner' && <button
                onClick={() => setActiveTab('notifications')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'text-amber-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>৪. মোবাইল নোটিফিকেশন</span>
                {activeTab === 'notifications' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>}
              <button
                onClick={() => setActiveTab('loader')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'loader'
                    ? 'text-amber-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>৫. স্টার্টআপ অ্যানিমেশন</span>
                {activeTab === 'loader' && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence mode="wait">
                
                {/* TAB 1: SITE INFO */}
                {activeTab === 'info' && (
                  <motion.form
                    key="info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSaveInfo}
                    className="space-y-4"
                  >
                    {role === 'owner' && <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">ব্যবসার নাম (Brand Name)</label>
                        <input
                          type="text"
                          value={formData.brandName}
                          onChange={(e) => handleChange('brandName', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">ফোন / হোয়াটসঅ্যাপ নম্বর</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">শো-রুম/সাইট ঠিকানা</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">হিরো ব্যাজ (Tagline)</label>
                      <input
                        type="text"
                        value={formData.heroBadge}
                        onChange={(e) => handleChange('heroBadge', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">হিরো শিরোনাম (Main Heading)</label>
                      <textarea
                        rows={2}
                        value={formData.heroTitle}
                        onChange={(e) => handleChange('heroTitle', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">হিরো বর্ণনা (Subtitle Text)</label>
                      <textarea
                        rows={2}
                        value={formData.heroText}
                        onChange={(e) => handleChange('heroText', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Owner-এর নাম</label>
                        <input
                          type="text"
                          value={formData.ownerName}
                          onChange={(e) => handleChange('ownerName', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">পদবী / ডেজিগনেশন</label>
                        <input
                          type="text"
                          value={formData.ownerTitle}
                          onChange={(e) => handleChange('ownerTitle', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Owner-এর পরিচিতি বাণী</label>
                      <textarea
                        rows={2}
                        value={formData.ownerIntro}
                        onChange={(e) => handleChange('ownerIntro', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>

                    {role === 'owner' && <button type="button" onClick={onOpenSecurity} className="w-full flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left hover:bg-violet-100 transition-colors">
                      <span><span className="block text-sm font-bold text-violet-900">Account Security</span><span className="block mt-0.5 text-[11px] text-violet-700">Recovery Key দিয়ে password পুনরুদ্ধার করা যাবে</span></span>
                      <ShieldCheck className="w-5 h-5 text-violet-600" />
                    </button>}
                    </>}

                    {/* Developer Branding & Advertisement Section */}
                    {role === 'developer' && <div className="pt-4 border-t border-slate-200 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                        <Code2 className="w-4 h-4 text-amber-600" />
                        <span>ওয়েবসাইট ডেভেলপার / ক্রিয়েটর ক্রেডিট অ্যাডভারটাইজমেন্ট (Footer Developer Box)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        ফুটারের নিচে হাইলাইট করা আপনার (ওয়েবসাইট প্রস্তুতকারকের) ব্র্যান্ড লোগো, নাম ও যোগাযোগের তথ্য এখান থেকে সেভ করুন।
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">প্রস্তুতকারক/ডেভেলপার নাম</label>
                          <input
                            type="text"
                            value={formData.devBrandName || ''}
                            onChange={(e) => handleChange('devBrandName', e.target.value)}
                            placeholder="যেমন: Sabbir IT & Web Solutions"
                            className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">ট্যাগলাইন/সার্ভিস পরিচিতি</label>
                          <input
                            type="text"
                            value={formData.devTagline || ''}
                            onChange={(e) => handleChange('devTagline', e.target.value)}
                            placeholder="যেমন: ওয়েবসাইট ডিজাইন ও প্রফেশনাল ডেভেলপমেন্ট"
                            className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">পোর্টফোলিও/ওয়েবসাইট লিঙ্ক (URL)</label>
                          <input
                            type="text"
                            value={formData.devWebsiteUrl || ''}
                            onChange={(e) => handleChange('devWebsiteUrl', e.target.value)}
                            placeholder="যেমন: https://facebook.com/yourpage"
                            className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">ডেভেলপার ফোন নম্বর</label>
                          <input
                            type="text"
                            value={formData.devPhone || ''}
                            onChange={(e) => handleChange('devPhone', e.target.value)}
                            placeholder="যেমন: 01700-000000"
                            className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400">
                          <Upload className="w-3.5 h-3.5" /> Developer logo আপলোড করুন
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'devLogo')} />
                        </label>
                        <span className="ml-2 text-[11px] text-slate-600">এই logo শুধু footer-এর Developer card-এ দেখাবে।</span>
                      </div>

                      {role === 'developer' && <button type="button" onClick={onOpenSecurity} className="w-full flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left hover:bg-violet-100 transition-colors">
                        <span><span className="block text-sm font-bold text-violet-900">Developer password পরিবর্তন</span><span className="block mt-0.5 text-[11px] text-violet-700">শুধু Developer নিজের password পরিবর্তন করতে পারবেন</span></span>
                        <ShieldCheck className="w-5 h-5 text-violet-600" />
                      </button>}
                    </div>}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-sm font-bold text-slate-950 transition-all shadow-md cursor-pointer active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>পরিবর্তন সেভ করুন</span>
                    </button>
                  </motion.form>
                )}

                {/* TAB 2: IMAGES & LOGO */}
                {activeTab === 'images' && (
                  <motion.div
                    key="images"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Logo Upload */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="h-16 w-16 rounded-xl object-cover border bg-white shadow-sm shrink-0"
                      />
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-slate-800">ব্র্যান্ড লোগো (Logo Image)</p>
                        <p className="text-[11px] text-slate-500">আপনার নিজস্ব লোগো ছবি সিলেক্ট করুন (PNG/JPG)।</p>
                        <label className="inline-flex items-center gap-1.5 mt-1 cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>নতুন লোগো আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'logo')}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Owner Photo Upload */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={formData.ownerPhoto}
                        alt="Owner preview"
                        className="h-20 w-20 rounded-2xl object-cover border bg-white shadow-sm shrink-0"
                      />
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-slate-800">Owner-এর ছবি (Owner Photo)</p>
                        <p className="text-[11px] text-slate-500">আপনার পাসপোর্ট/প্রোফাইল সাইজ ছবি আপলোড করুন।</p>
                        <label className="inline-flex items-center gap-1.5 mt-1 cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>ছবি আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'ownerPhoto')}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Hero Background Image */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">হিরো ব্যানারের ব্যাকগ্রাউন্ড ছবি</p>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'heroBgImage')}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="অথবা ব্যাকগ্রাউন্ড ছবির লিঙ্ক (Image URL) দিন"
                        value={formData.heroBgImage}
                        onChange={(e) => handleChange('heroBgImage', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Developer Logo Upload */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                      <div className="h-16 w-16 rounded-xl border bg-slate-900 text-amber-400 shadow-sm flex items-center justify-center shrink-0 overflow-hidden font-black">
                        {formData.devLogo ? (
                          <img src={formData.devLogo} alt="Dev logo" className="h-full w-full object-cover" />
                        ) : (
                          <span>{(formData.devBrandName || 'DEV').charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-slate-800">ওয়েবসাইট প্রস্তুতকারকের (Developer) লোগো</p>
                        <p className="text-[11px] text-slate-500">ফুটারের নিচে হাইলাইট বক্সে আপনার ক্রিয়েটর লোগো আপলোড করুন।</p>
                        <label className="inline-flex items-center gap-1.5 mt-1 cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>ডেভেলপার লোগো আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'devLogo')}
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSaveSiteData(formData);
                        showToast('সব ছবি ও ব্র্যান্ডিং সেভ হয়েছে!');
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-sm font-bold text-slate-950 transition-all shadow-md cursor-pointer active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>ছবি ও তথ্য সেভ করুন</span>
                    </button>
                  </motion.div>
                )}

                {/* TAB 3: PRODUCTS MANAGEMENT */}
                {activeTab === 'products' && (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    
                    {/* Add New Product Form */}
                    <form onSubmit={handleAddProduct} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <h3 className="text-xs font-bold text-[#0b2942] flex items-center gap-1.5 uppercase tracking-wider">
                        <Plus className="w-4 h-4 text-amber-600" />
                        নতুন পণ্য যুক্ত করুন
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          required
                          placeholder="পণ্যের নাম (যেমন: BSRM Rod)"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                        />

                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                        >
                          <option value="rod">রড ও স্টিল</option>
                          <option value="cement">সিমেন্ট</option>
                          <option value="sand">বালি ও পাথর</option>
                          <option value="brick">ইট ও ব্লক</option>
                          <option value="other">অন্যান্য</option>
                        </select>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          type="number"
                          required
                          placeholder="একক পাইকারি মূল্য (টাকায়)"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                        />

                        <input
                          type="text"
                          placeholder="একক (যেমন: টন / ব্যাগ / সিএফটি)"
                          value={newProdUnit}
                          onChange={(e) => setNewProdUnit(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                      />

                      {/* Product Image Selection / Upload */}
                      <div className="space-y-2.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-amber-600" />
                            <span>পণ্যের ছবি যুক্ত করুন (Product Image)</span>
                          </span>
                          {newProdImg && (
                            <button
                              type="button"
                              onClick={() => setNewProdImg('')}
                              className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                            >
                              ছবি সরান
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          {/* Image Preview Box */}
                          {newProdImg ? (
                            <div className="relative group shrink-0">
                              <img
                                src={newProdImg}
                                alt="New product preview"
                                className="h-20 w-20 rounded-xl object-cover border-2 border-amber-500 shadow-sm"
                              />
                            </div>
                          ) : (
                            <div className="h-20 w-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
                              <span className="text-[10px] font-medium">ছবি নির্বাচন করুন</span>
                            </div>
                          )}

                          <div className="flex-1 w-full space-y-2">
                            {/* Device Upload Button */}
                            <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm inline-flex items-center justify-center gap-2 w-full sm:w-auto active:scale-95">
                              <Upload className="w-4 h-4" />
                              <span>গ্যালারি / ক্যামেরা থেকে ছবি নির্বাচন করুন</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleNewProductImgUpload}
                              />
                            </label>

                            {/* Image URL input */}
                            <input
                              type="text"
                              placeholder="অথবা অনলাইন ছবির URL দিন (যেমন: https://...)"
                              value={newProdImg}
                              onChange={(e) => setNewProdImg(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Preset Quick Images */}
                        <div className="pt-1.5 border-t border-slate-200/60">
                          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">অথবা দ্রুত ডেমো ছবি বেছে নিন:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: '🏗️ রড', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80' },
                              { label: '🏢 সিমেন্ট', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500&q=80' },
                              { label: '⏳ বালি', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80' },
                              { label: '🧱 ইট', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80' },
                            ].map((sample) => (
                              <button
                                type="button"
                                key={sample.label}
                                onClick={() => {
                                  setNewProdImg(sample.url);
                                  showToast(`${sample.label} ছবি নির্বাচন করা হয়েছে!`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-amber-100 hover:border-amber-400 transition-colors cursor-pointer"
                              >
                                {sample.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>পণ্য যুক্ত করুন</span>
                      </button>
                    </form>

                    {/* Product List Table */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700">বর্তমান পণ্যের তালিকা ({products.length} টি)</p>
                      
                      <div className="divide-y divide-slate-100 border rounded-2xl overflow-hidden bg-white">
                        {products.map((p) => (
                          <div key={p.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            
                            <div className="flex items-center gap-3">
                              <div className="relative group shrink-0">
                                <img
                                  src={p.image || 'https://placehold.co/80x80'}
                                  alt=""
                                  className="h-12 w-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                                />
                                <label className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-bold">
                                  <Upload className="w-4 h-4 text-amber-400" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleExistingProductImgUpload(p.id, e)}
                                  />
                                </label>
                              </div>

                              <div>
                                <p className="text-xs font-bold text-slate-900">{p.name}</p>
                                <p className="text-[11px] text-slate-400">
                                  একক: {p.unit} | ক্যাটাগরি: {p.category}
                                </p>
                                <label className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:underline cursor-pointer mt-0.5">
                                  <Upload className="w-3 h-3" />
                                  <span>ছবি আপলোড/বদলান</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleExistingProductImgUpload(p.id, e)}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-500">৳</span>
                                <input
                                  type="number"
                                  value={p.unitPrice}
                                  onChange={(e) => handlePriceChange(p.id, Number(e.target.value))}
                                  className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-800 focus:border-amber-500"
                                />
                              </div>

                              <button
                                onClick={() => handleToggleStock(p.id)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                                  p.inStock
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                }`}
                              >
                                {p.inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="পণ্য মুছুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* TAB 4: MOBILE NOTIFICATIONS */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex items-start gap-3">
                      <Smartphone className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                      <div className="text-xs text-slate-700 space-y-1">
                        <h3 className="font-extrabold text-slate-900 text-sm">📱 মোবাইলে কোটেশন নোটিফিকেশন সেটআপ</h3>
                        <p className="leading-relaxed">
                          গ্রাহক যখনই ওয়েবসাইট থেকে যেকোনো কোটেশন রিকোয়েস্ট পাঠাবে, সাথে সাথে আপনার মোবাইল ফোনে মেসেজ ও নোটিফিকেশন অ্যালার্ট পাওয়ার উপায়সমূহ নিচে দেওয়া হলো।
                        </p>
                      </div>
                    </div>

                    {/* Method 1: Instant WhatsApp Message */}
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">১. অটোমেটিক হোয়াটসঅ্যাপ</span>
                        <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase">চালু আছে</span>
                      </div>
                      <p className="text-xs text-emerald-950 leading-relaxed">
                        গ্রাহক কোটেশন ফরম জমা দেয়ার সাথে সাথেই ওয়েবসাইট স্ক্রিনে একটি বড় <strong>"হোয়াটসঅ্যাপে পাঠান"</strong> বাটন ভেসে ওঠে। এতে ক্লিক করলেই গ্রাহকের নাম, ফোন নম্বর, অর্ডারকৃত রড/সিমেন্টের পরিমাণ ও ঠিকানা আপনার হোয়াটসঅ্যাপ নম্বর (<strong>{formData.phone}</strong>) এ সরাসরি মেসেজ হিসেবে চলে যায়।
                      </p>
                    </div>

                    {/* Method 2: Free Telegram Bot Instant Push Alert */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSaveSiteData(formData);
                        showToast('মোবাইল নোটিফিকেশন সেটিংস সেভ হয়েছে!');
                      }}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-amber-600" />
                          <h4 className="font-bold text-slate-900 text-sm">২. টেলিগ্রাম ফ্রী পুশ নোটিফিকেশন (১০০% রিয়েল-টাইম)</h4>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          সুপার ফাস্ট
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">কিভাবে আপনার ফোনে টেলিগ্রাম পুশ নোটিফিকেশন সেট করবেন (১ মিনিটে):</p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-700">
                          <li>আপনার মোবাইলে <strong>Telegram App</strong> ইনস্টল করুন।</li>
                          <li>টেলিগ্রামে সার্চ করুন <strong>@BotFather</strong> এবং নতুন একটি বট বানিয়ে আপনার <strong>Bot Token</strong> টি সংগ্রহ করুন।</li>
                          <li>বটে মেসেজ দিয়ে আপনার নিজের <strong>Chat ID</strong> বের করুন (অথবা <strong>@userinfobot</strong> থেকে Chat ID কপি করুন)।</li>
                          <li>নিচের ঘরে বসিয়ে সেভ বাটনে চাপ দিন। ব্যস! এখন থেকে প্রতিটি কোটেশন সাবমিটের সাথে সাথে আপনার টেলিগ্রাম অ্যাপে রিং বেজে নোটিফিকেশন চলে আসবে।</li>
                        </ol>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Telegram Bot Token
                          </label>
                          <input
                            type="text"
                            value={formData.telegramBotToken || ''}
                            onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                            placeholder="যেমন: 123456789:ABCdefGhIJKlmNo..."
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Telegram Chat ID
                          </label>
                          <input
                            type="text"
                            value={formData.telegramChatId || ''}
                            onChange={(e) => handleChange('telegramChatId', e.target.value)}
                            placeholder="যেমন: 987654321"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!formData.telegramBotToken || !formData.telegramChatId) {
                              alert('অনুগ্রহ করে টেলিগ্রাম Bot Token এবং Chat ID লিখুন');
                              return;
                            }
                            try {
                              const testMsg = `🔔 *কবীর এন্টারপ্রাইজ টেস্ট নোটিফিকেশন!*\n\nআপনার মোবাইল নোটিফিকেশন সফলভাবে কাজ করছে।`;
                              const res = await fetch(`https://api.telegram.org/bot${formData.telegramBotToken}/sendMessage`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  chat_id: formData.telegramChatId,
                                  text: testMsg,
                                  parse_mode: 'Markdown',
                                }),
                              });
                              if (res.ok) {
                                alert('✅ আপনার ফোনে সফলভাবে টেস্ট নোটিফিকেশন চলে গেছে! আপনার টেলিগ্রাম চেক করুন।');
                              } else {
                                alert('❌ টেস্ট নোটিফিকেশন পাঠাতে সমস্যা হয়েছে। আপনার Bot Token বা Chat ID সঠিক কি না চেক করুন।');
                              }
                            } catch {
                              alert('❌ কানেকশন এরর হয়েছে।');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3.5 py-2 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-600" />
                          <span>টেস্ট নোটিফিকেশন পাঠান</span>
                        </button>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2.5 text-xs transition-colors shadow-md cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>সেটিংস সেভ করুন</span>
                        </button>
                      </div>
                    </form>

                  </motion.div>
                )}

                {/* TAB 5: STARTUP LOADING ANIMATION SETTINGS */}
                {activeTab === 'loader' && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 p-4 rounded-2xl border border-amber-500/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900">স্টার্টআপ লিকুইড ওয়েভ লোডিং অ্যানিমেশন</h3>
                            <p className="text-[11px] text-slate-500">
                              ওয়েবসাইটে প্রথমবার প্রবেশের সময় লিকুইড ফিলিং ওয়েভ ও লোগো ওঠার মোশন এফেক্ট
                            </p>
                          </div>
                        </div>

                        {/* Enable/Disable Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.enableLoadingAnimation !== false}
                            onChange={(e) => {
                              const updated = { ...formData, enableLoadingAnimation: e.target.checked };
                              setFormData(updated);
                              onSaveSiteData(updated);
                              showToast(e.target.checked ? 'স্টার্টআপ অ্যানিমেশন চালু হয়েছে!' : 'স্টার্টআপ অ্যানিমেশন বন্ধ করা হয়েছে।');
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-amber-400">লাইভ অ্যানিমেশন টেস্ট করুন</p>
                        <p className="text-[11px] text-slate-300">বর্তমান সেটআপ অনুযায়ী লোডিং কিভাবে দেখাবে তা লাইভ প্লে করে দেখুন</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (onTestLoaderAnimation) {
                            onTestLoaderAnimation();
                            showToast('প্রিভিউ শুরু হয়েছে!');
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>অ্যানিমেশন টেস্ট করুন</span>
                      </button>
                    </div>

                    {/* Form fields for loading animation */}
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      
                      {/* Loading Title */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          অ্যানিমেশনের ব্র্যান্ড টাইটেল (Brand Title)
                        </label>
                        <input
                          type="text"
                          value={formData.loadingTitle || ''}
                          onChange={(e) => handleChange('loadingTitle', e.target.value)}
                          placeholder={formData.brandName || 'KABIR ENTERPRISES'}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:border-amber-500 focus:outline-none bg-white"
                        />
                      </div>

                      {/* Loading Logo */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          অ্যানিমেশনের লোগো (Loading Logo)
                        </label>
                        <div className="flex items-center gap-3">
                          <img
                            src={formData.loadingLogo || formData.logo}
                            alt="Loading Logo"
                            className="h-12 w-12 rounded-full object-cover border bg-black shadow-sm shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>অন্য লোগো নির্বাচন</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'loadingLogo')}
                              />
                            </label>
                            {formData.loadingLogo && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleChange('loadingLogo', '');
                                  showToast('ডিফল্ট সাইট লোগোতে রিব্যাক করা হয়েছে');
                                }}
                                className="text-[10px] text-red-600 font-bold block hover:underline mt-1"
                              >
                                ডিফল্ট সাইট লোগো ব্যবহার করুন
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Speed / Duration Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold text-slate-700">
                            লোডিং সময়সীমা (Duration): <span className="font-bold text-amber-600">{formData.loadingDuration || 2.8} সেকেন্ড</span>
                          </label>
                        </div>
                        <input
                          type="range"
                          min="1.5"
                          max="6.0"
                          step="0.1"
                          value={formData.loadingDuration || 2.8}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, loadingDuration: parseFloat(e.target.value) }));
                          }}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                          <span>১.৫ সেকেন্ড (দ্রুত)</span>
                          <span>৩.০ সেকেন্ড (আদর্শ)</span>
                          <span>৬.০ সেকেন্ড (ধীর)</span>
                        </div>
                      </div>

                      {/* Colors selection */}
                      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200">
                        
                        {/* Background Color */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            ব্যাকগ্রাউন্ড কালার (Background Color)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.loadingBgColor || '#000000'}
                              onChange={(e) => handleChange('loadingBgColor', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 shrink-0"
                            />
                            <input
                              type="text"
                              value={formData.loadingBgColor || '#000000'}
                              onChange={(e) => handleChange('loadingBgColor', e.target.value)}
                              className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono focus:border-amber-500 focus:outline-none bg-white"
                            />
                          </div>
                          {/* Quick Color Presets */}
                          <div className="flex gap-1.5 mt-2">
                            {['#000000', '#090d16', '#0f172a', '#ffffff'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => handleChange('loadingBgColor', c)}
                                className="w-6 h-6 rounded-md border border-slate-300 shadow-sm transition-transform hover:scale-110"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Accent / Wave Color */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            লিকুইড ওয়েভ কালার (Liquid Wave Color)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.loadingAccentColor || '#3b82f6'}
                              onChange={(e) => handleChange('loadingAccentColor', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 shrink-0"
                            />
                            <input
                              type="text"
                              value={formData.loadingAccentColor || '#3b82f6'}
                              onChange={(e) => handleChange('loadingAccentColor', e.target.value)}
                              className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono focus:border-amber-500 focus:outline-none bg-white"
                            />
                          </div>
                          {/* Quick Color Presets */}
                          <div className="flex gap-1.5 mt-2">
                            {['#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => handleChange('loadingAccentColor', c)}
                                className="w-6 h-6 rounded-md border border-slate-300 shadow-sm transition-transform hover:scale-110"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSaveSiteData(formData);
                        showToast('স্টার্টআপ লোডিং সেটিংস সেভ হয়েছে!');
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-sm font-bold text-slate-950 transition-all shadow-md cursor-pointer active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>সেটিংস সেভ করুন</span>
                    </button>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Modal Footer with Reset Default Option */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between">
              {role === 'owner' && <button
                onClick={() => {
                  if (confirm('সব পরিবর্তন মুছে প্রাথমিক ডিফল্ট অবস্থায় ফিরে যেতে চান?')) {
                    onResetDefaults();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট ডিফল্ট ড্যাশবোর্ড</span>
              </button>}

              <button
                onClick={onClose}
                className="rounded-xl bg-slate-200 hover:bg-slate-300 px-5 py-2 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
