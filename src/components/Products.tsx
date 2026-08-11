import React, { useState } from 'react';
import { ProductItem, ProductCategory } from '../types';
import { Search, ShoppingBag, CheckCircle, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductsProps {
  products: ProductItem[];
  onSelectProductForQuote: (product: ProductItem) => void;
}

export const Products: React.FC<ProductsProps> = ({ products, onSelectProductForQuote }) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'সব পণ্য' },
    { id: 'rod', label: 'রড ও স্টিল' },
    { id: 'cement', label: 'সিমেন্ট' },
    { id: 'sand', label: 'বালি ও পাথর' },
    { id: 'brick', label: 'ইট ও ব্লক' },
    { id: 'other', label: 'অন্যান্য' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold text-amber-600 tracking-wider uppercase">আমাদের পণ্য ও পাইকারি মূল্য</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0b2942] mt-1">পণ্য ক্যাটালগ</h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
              সেরা মানের নির্মাণ সামগ্রী সরাসরি মিল ও ফ্যাক্টরি রেটে আপনার নির্মাণ সাইটে সরবরাহ করা হয়।
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full md:w-72"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm"
            />
          </motion.div>
        </div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0b2942] text-white shadow-md shadow-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 bg-[#0b2942] rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto"
            >
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-bold text-slate-800">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="text-sm text-slate-500 mt-1">অনুগ্রহ করে অন্য শব্দ দিয়ে খুঁজুন অথবা ক্যাটাগরি ফিল্টার পরিবর্তন করুন।</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors"
              >
                সব পণ্য দেখুন
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredProducts.map((p, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={p.id}
                  className="group bg-white rounded-2xl border border-slate-300 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5"
                >
                  {/* Product Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      {p.inStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          স্টকে আছে
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                          স্টক সীমিত
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#0b2942] group-hover:text-amber-600 transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-xs text-slate-400 font-medium block">বর্তমান মূল্য</span>
                          <span className="text-xl font-extrabold text-[#0b2942]">
                            ৳ {p.unitPrice.toLocaleString('bn-BD')}
                          </span>
                          <span className="text-xs text-slate-500 font-medium"> / {p.unit}</span>
                        </div>
                        
                        {p.minOrder && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">সর্বনিম্ন অর্ডার</span>
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {p.minOrder}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectProductForQuote(p)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 py-2.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
                      >
                        <span>কোটেশন যোগ করুন</span>
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
