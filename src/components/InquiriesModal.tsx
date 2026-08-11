import React, { useState } from 'react';
import { QuoteInquiry } from '../types';
import { X, Phone, MessageSquare, CheckCircle, Clock, Trash2, Calendar, MapPin, Search } from 'lucide-react';

interface InquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: QuoteInquiry[];
  onUpdateStatus: (id: string, status: QuoteInquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
  onClearAll: () => void;
}

export const InquiriesModal: React.FC<InquiriesModalProps> = ({
  isOpen,
  onClose,
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<QuoteInquiry['status'] | 'all'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = inquiries.filter((inq) => {
    const matchStatus = filter === 'all' || inq.status === filter;
    const matchSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone.includes(search) ||
      inq.productName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#0b2942] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>গ্রাহকদের প্রেরিত কোটেশন ইনকোয়ারি ({inquiries.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              গ্রাহকদের চাহিদা ও ফোন নম্বর দেখে সরাসরি হোয়াটসঅ্যাপে বা কলে যোগাযোগ করুন।
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'all' ? 'bg-[#0b2942] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সব ({inquiries.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'pending' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              পেন্ডিং
            </button>
            <button
              onClick={() => setFilter('contacted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'contacted' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              যোগাযোগকৃত
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সম্পন্ন
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

        </div>

        {/* Inquiry Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">কোনো ইনকোয়ারি পাওয়া যায়নি</p>
            </div>
          ) : (
            filtered.map((inq) => {
              const cleanNum = inq.phone.replace(/[^0-9]/g, '');
              const waLink = `https://wa.me/88${cleanNum}?text=${encodeURIComponent(
                `হ্যালো ${inq.name}, আপনার কোটেশনটি প্রাপ্তি স্বীকার করছি।`
              )}`;

              return (
                <div
                  key={inq.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-amber-400/80 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#0b2942] text-sm">{inq.name}</span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {inq.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateStatus(inq.id, e.target.value as QuoteInquiry['status'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          inq.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : inq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <option value="pending">পেন্ডিং</option>
                        <option value="contacted">যোগাযোগকৃত</option>
                        <option value="completed">সম্পন্ন</option>
                      </select>

                      <button
                        onClick={() => onDeleteInquiry(inq.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="grid gap-2 sm:grid-cols-2 text-xs text-slate-700">
                    <div>
                      <p><strong className="text-slate-900">ফোন:</strong> {inq.phone}</p>
                      <p className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>ঠিকানা:</strong> {inq.address}</span>
                      </p>
                    </div>

                    <div>
                      <p><strong className="text-slate-900">পণ্য:</strong> {inq.productName}</p>
                      <p><strong className="text-slate-900">পরিমাণ:</strong> {inq.quantity}</p>
                      {inq.estimatedCost && (
                        <p className="text-amber-700 font-extrabold mt-0.5">
                          বাজেট: ৳ {inq.estimatedCost.toLocaleString('bn-BD')}
                        </p>
                      )}
                    </div>
                  </div>

                  {inq.note && (
                    <p className="text-xs italic bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600">
                      "{inq.note}"
                    </p>
                  )}

                  {/* Action Link Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>কল দিন</span>
                    </a>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>হোয়াটসঅ্যাপ মেসেজ</span>
                    </a>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('সব ইনকোয়ারি মুছে ফেলতে চান?')) {
                onClearAll();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            সব ইনকোয়ারি ক্লিয়ার করুন
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 hover:bg-slate-300 px-5 py-2 text-xs font-bold text-slate-800"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
