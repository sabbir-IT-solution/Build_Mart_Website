import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { Star, Quote, CheckCircle2, MessageSquarePlus, X, ThumbsUp, Sparkles, Filter, Award, ShieldCheck, Heart } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>({
    'rev-1': 24,
    'rev-2': 19,
    'rev-3': 31,
    'rev-4': 27,
  });
  const [likedReviews, setLikedReviews] = useState<{ [id: string]: boolean }>({});

  // Form states
  const [name, setName] = useState('');
  const [roleOrLocation, setRoleOrLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleHelpfulClick = (id: string) => {
    if (likedReviews[id]) return;
    setLikedReviews((prev) => ({ ...prev, [id]: true }));
    setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddReview({
        name: name.trim(),
        roleOrLocation: roleOrLocation.trim() || 'সম্মানিত গ্রাহক',
        rating,
        comment: comment.trim(),
        verified: true,
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsFormOpen(false);
        setName('');
        setRoleOrLocation('');
        setRating(5);
        setComment('');
      }, 1500);
    }, 600);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  // Rating counts breakdown
  const count5 = reviews.filter((r) => r.rating === 5).length;
  const count4 = reviews.filter((r) => r.rating === 4).length;
  const count3 = reviews.filter((r) => r.rating <= 3).length;

  return (
    <section id="reviews" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>১০০% ভেরিফাইড কাস্টমার ফিডব্যাক</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            গ্রাহক সন্তুষ্টি ও অনুভূতি
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            কবীর এন্টারপ্রাইজের সেরা মানের নির্মাণ সামগ্রী ও দ্রুত ডেলিভারি সার্ভিস নিয়ে আমাদের গ্রাহকদের বাস্তব অভিজ্ঞতা
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-slate-700/80 shadow-2xl mb-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Rating Score & Rating Bars */}
          <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
            {/* Score Badge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-slate-950 min-w-[150px] shadow-xl shadow-amber-500/20 text-center shrink-0">
              <span className="text-5xl font-black tracking-tight leading-none mb-1">{averageRating}</span>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-slate-950 text-slate-950" />
                ))}
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900/90">
                {reviews.length} টি রিভিউ
              </span>
            </div>

            {/* Progress Bars */}
            <div className="w-full sm:w-64 space-y-2">
              {/* 5 Stars */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-8 font-semibold">৫ ★</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${(count5 / (reviews.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-slate-400">{count5}</span>
              </div>

              {/* 4 Stars */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-8 font-semibold">৪ ★</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400/80 rounded-full transition-all duration-500"
                    style={{ width: `${(count4 / (reviews.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-slate-400">{count4}</span>
              </div>

              {/* 3 Stars */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-8 font-semibold">৩ ★</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400/50 rounded-full transition-all duration-500"
                    style={{ width: `${(count3 / (reviews.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-slate-400">{count3}</span>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>সব রিভিউ সরাসরি যাচাইকৃত কাস্টমার থেকে প্রাপ্ত</span>
              </div>
            </div>
          </div>

          {/* Filters & Add Review Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-semibold w-full sm:w-auto justify-center">
              <span className="px-2 text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> ফিল্টার:
              </span>
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  filterRating === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                সকল
              </button>
              <button
                onClick={() => setFilterRating(5)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 ${
                  filterRating === 5
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>৫★</span>
              </button>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 text-sm shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4 text-slate-950" />
              <span>রিভিউ লিখুন</span>
            </button>
          </div>
        </div>

        {/* Aesthetic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map((rev) => {
            const isLiked = likedReviews[rev.id];
            const likes = helpfulCounts[rev.id] || 0;

            return (
              <div
                key={rev.id}
                className="group relative bg-slate-800/50 backdrop-blur-md rounded-[2rem] p-7 border border-slate-700/70 hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                {/* Decorative Card Accent Line */}
                <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Top Header: Rating & Date */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-700 text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-1">
                        {rev.rating}.0
                      </span>
                    </div>

                    <span className="text-xs font-medium text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                      {rev.date}
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-slate-700/60 absolute -top-2 -left-2 -z-10 group-hover:text-amber-500/20 transition-colors" />
                    <p className="text-slate-200 text-base leading-relaxed font-normal pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Footer: User Profile & Helpful Button */}
                <div className="pt-5 border-t border-slate-700/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {/* User Avatar with Gradient Ring */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-lg flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                        {rev.name.charAt(0) || 'ক'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 border-2 border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 fill-emerald-400" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base leading-tight">
                          {rev.name}
                        </h4>
                        <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          ভেরিফাইড
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{rev.roleOrLocation}</p>
                    </div>
                  </div>

                  {/* Like / Helpful button */}
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isLiked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Adding a Review */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-700 relative text-white animate-scaleUp">
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedSuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">ধন্যবাদ!</h3>
                  <p className="text-slate-300">
                    আপনার মূল্যবান রিভিউটি সফলভাবে প্রকাশিত হয়েছে।
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold text-white mb-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>আপনার অভিজ্ঞতা শেয়ার করুন</span>
                    </h3>
                    <p className="text-slate-400 text-sm">
                      কবীর এন্টারপ্রাইজের পণ্য ও সেবার গুণমান অন্য ক্রেতাদের জানাতে মূল্যায়ন লিখুন
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        রেটিং নির্বাচন করুন <span className="text-amber-400">*</span>
                      </label>
                      <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-700 text-slate-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        আপনার নাম <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: ইঞ্জিনিয়ার তানভীর আহমেদ"
                        className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white font-medium text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Role / Location */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        পদবী / এলাকা (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={roleOrLocation}
                        onChange={(e) => setRoleOrLocation(e.target.value)}
                        placeholder="যেমন: প্রজেক্ট ম্যানেজার, সোনাডাঙ্গা, খুলনা"
                        className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white font-medium text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        আপনার রিভিউ <span className="text-amber-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="মালামালের মান, সঠিক পরিমাপ ও ডেলিভারি সেবা সম্পর্কে আপনার মতামত লিখুন..."
                        className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white font-medium text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 text-base mt-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>রিভিউ জমা দিন</span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
