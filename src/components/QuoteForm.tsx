import React, { useState, useEffect } from 'react';
import { SiteData, ProductItem, QuoteInquiry } from '../types';
import { Send, Phone, MapPin, Mail, CheckCircle2, MessageSquare, Clock, ArrowRight } from 'lucide-react';

interface QuoteFormProps {
  siteData: SiteData;
  products: ProductItem[];
  selectedProduct: ProductItem | null;
  onAddInquiry: (inquiry: QuoteInquiry) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  siteData,
  products,
  selectedProduct,
  onAddInquiry,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [productId, setProductId] = useState('');
  const [quantityNum, setQuantityNum] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<QuoteInquiry | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
    }
  }, [selectedProduct]);

  const activeProduct = products.find((p) => p.id === productId);

  // Estimated budget calculation
  const estimatedCost = activeProduct && typeof quantityNum === 'number' && quantityNum > 0
    ? activeProduct.unitPrice * quantityNum
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    const newInquiry: QuoteInquiry = {
      id: 'inq-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || siteData.address,
      productName: activeProduct ? activeProduct.name : 'সাধারণ নির্মাণসামগ্রী কোটেশন',
      quantity: quantityNum ? `${quantityNum} ${activeProduct?.unit || 'একক'}` : 'প্রয়োজন অনুযায়ী',
      estimatedCost: estimatedCost || undefined,
      note: note.trim(),
      status: 'pending',
    };

    onAddInquiry(newInquiry);
    setSubmittedInquiry(newInquiry);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setProductId('');
    setQuantityNum('');
    setNote('');
    setIsSubmitted(false);
    setSubmittedInquiry(null);
  };

  // Build WhatsApp share string
  const whatsappText = submittedInquiry
    ? encodeURIComponent(
        `হ্যালো ${siteData.brandName},\nআমি কোটেশন নিতে চাই:\n- নাম: ${submittedInquiry.name}\n- ফোন: ${submittedInquiry.phone}\n- পণ্য: ${submittedInquiry.productName}\n- পরিমাণ: ${submittedInquiry.quantity}\n- ঠিকানা: ${submittedInquiry.address}\n- নোট: ${submittedInquiry.note || 'নেই'}`
      )
    : '';

  const whatsappUrl = `https://wa.me/88${siteData.phone.replace(/[^0-9]/g, '')}?text=${whatsappText}`;

  return (
    <section id="quote" className="py-20 bg-[#0b2942] text-white relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column: Info & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block rounded-full bg-amber-400/20 px-4 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
              বাল্ক অর্ডার & সাইট ডেলিভারি
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              দ্রুত কোটেশন ও স্পেশাল মূল্য ছাড় পান
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              আপনার নির্মাণ প্রজেক্টের প্রয়োজনীয় তালিকা নিচে পাঠান। আমাদের রিপ্রেজেন্টেটিভ অনায়াসে সরাসরি আপনার সাথে যোগাযোগ করে সর্বনিম্ন পাইকারি রেট ও ডেলিভারি সময় জানিয়ে দেবে।
            </p>

            <div className="pt-6 space-y-5 border-t border-slate-700/80">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">হটলাইন & হোয়াটসঅ্যাপ</span>
                  <a href={`tel:${siteData.phone}`} className="text-lg font-bold text-white hover:text-amber-400 transition-colors">
                    {siteData.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">অফিস ও শো-রুম ঠিকানা</span>
                  <p className="text-sm font-semibold text-white">{siteData.address}</p>
                </div>
              </div>

              {siteData.email && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">ইমেইল অ্যাড্রেস</span>
                    <p className="text-sm font-semibold text-white">{siteData.email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <p className="font-bold text-white">২৪/৭ কাস্টমার সাপোর্ট</p>
                <p>যেকোনো সময় কোটেশন পাঠান, ১০ মিনিটের মধ্যে কনফার্মেশন পেয়ে যাবেন।</p>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Form / Success Display */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-100">
              
              {isSubmitted ? (
                /* Success Message */
                <div className="py-8 text-center space-y-5">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#0b2942]">ধন্যবাদ! কোটেশন রিকোয়েস্ট সফল হয়েছে।</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      আপনার কোটেশন আমাদের ডাটাবেজে ও সিস্টেমে সেভ হয়েছে। ⚡ সরাসরি ওনারের মোবাইলে তাত্ক্ষণিক হোয়াটসঅ্যাপ নোটিফিকেশন পাঠাতে নিচের বাটনে চাপ দিন:
                    </p>
                  </div>

                  {submittedInquiry && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-1.5 max-w-md mx-auto">
                      <p><strong className="text-slate-900">নাম:</strong> {submittedInquiry.name}</p>
                      <p><strong className="text-slate-900">মোবাইল:</strong> {submittedInquiry.phone}</p>
                      <p><strong className="text-slate-900">পণ্য:</strong> {submittedInquiry.productName}</p>
                      <p><strong className="text-slate-900">পরিমাণ:</strong> {submittedInquiry.quantity}</p>
                      {submittedInquiry.estimatedCost ? (
                        <p className="text-amber-700 font-bold">
                          আনুমানিক বাজেট: ৳ {submittedInquiry.estimatedCost.toLocaleString('bn-BD')}
                        </p>
                      ) : null}
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-center gap-3 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold py-3.5 px-8 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/30 animate-pulse hover:animate-none active:scale-95"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>📱 ওনারের হোয়াটসঅ্যাপে অনায়াসে মেসেজ দিন</span>
                    </a>

                    <button
                      onClick={handleResetForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                    >
                      <span>নতুন আরেকটি কোটেশন পাঠাবেন</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Actual Input Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-xl font-bold text-[#0b2942]">কোটেশন ফরম পূরণ করুন</h3>
                    <p className="text-xs text-slate-500">
                      নিচের তথ্যগুলো দিয়ে সাবমিট করুন। আমরা সাথে সাথে কল দিয়ে নিশ্চিত করব।
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        আপনার নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: ইঞ্জিনিয়ার আব্দুর রহমান"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        মোবাইল নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="যেমন: 01700-000000"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        পণ্য নির্বাচন করুন
                      </label>
                      <select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      >
                        <option value="">-- যেকোনো সাধারণ নির্মাণসামগ্রী --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (৳{p.unitPrice.toLocaleString('bn-BD')}/{p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        পরিমাণ ({activeProduct ? activeProduct.unit : 'একক'})
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantityNum}
                        onChange={(e) => setQuantityNum(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder={activeProduct ? `যেমন: ৫ ${activeProduct.unit}` : 'পরিমাণ লিখুন'}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Dynamic Estimated Cost Banner */}
                  {estimatedCost > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-900">আনুমানিক মোট পাইকারি বাজেট:</span>
                      <span className="font-extrabold text-sm text-amber-800">
                        ৳ {estimatedCost.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ডেলিভারি প্রজেক্টের এলাকা/ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="যেমন: সেক্টর ৪, উত্তরা, ঢাকা"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      বিশেষ প্রয়োজন বা বার্তা
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="যেমন: সরাসরি ট্রাক সাইটে প্রবেশ করতে পারবে কি না, বা কোনো ডিসকাউন্ট রিকোয়েস্ট..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-3.5 text-sm font-extrabold text-slate-950 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                  >
                    <span>কোটেশন রিকোয়েস্ট পাঠান</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
