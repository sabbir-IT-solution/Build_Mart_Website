import React, { useState } from 'react';
import { CompletedProject } from '../types';
import { Building2, MapPin, Calendar, CheckCircle2, ChevronRight, Layers, Sparkles, X, ArrowUpRight } from 'lucide-react';

interface ProjectsShowcaseProps {
  projects: CompletedProject[];
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'residential' | 'commercial' | 'infrastructure'>('all');
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="projects" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Lighting Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>আমাদের অর্জনের পোর্টফোলিও</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            সম্পন্ন হওয়া সফল প্রজেক্টসমূহ
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            খুলনা ও আশেপাশের বিভিন্ন আইকনিক রেসিডেন্সিয়াল ভবন, কমার্শিয়াল স্পেস এবং ইনফ্রাস্ট্রাকচার প্রজেক্টে আমাদের রড, সিমেন্ট ও বালি সরবরাহের কিছু খণ্ডচিত্র
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {[
            { id: 'all', label: 'সকল প্রজেক্ট' },
            { id: 'residential', label: 'আবাসিক ভবন' },
            { id: 'commercial', label: 'বাণিজ্যিক প্লাজা' },
            { id: 'infrastructure', label: 'ব্রিজ ও ইনফ্রাস্ট্রাকচার' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group bg-slate-900/80 rounded-[2.5rem] border border-slate-800 hover:border-amber-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge Overlay */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-800">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs font-bold text-amber-400">
                    {proj.category === 'residential' && 'আবাসিক প্রজেক্ট'}
                    {proj.category === 'commercial' && 'বাণিজ্যিক প্রজেক্ট'}
                    {proj.category === 'infrastructure' && 'ইনফ্রাস্ট্রাকচার'}
                  </div>

                  {/* Completion Year */}
                  <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{proj.completionYear}</span>
                  </div>

                  {/* Location Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{proj.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                      {proj.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4 font-normal">
                    {proj.description}
                  </p>

                  {/* Supplied Materials Tags */}
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      সরবরাহকৃত প্রধান মালামাল:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {proj.materialsSupplied.map((mat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-200 border border-slate-700/80 text-xs px-3 py-1 rounded-xl font-medium flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{mat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>প্রজেক্টের বিস্তারিত দেখুন</span>
                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail View */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 rounded-[2.5rem] max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden relative text-white animate-scaleUp">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative h-72 sm:h-80 bg-slate-800">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full">
                    {selectedProject.location}
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    সম্পন্ন: {selectedProject.completionYear}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedProject.title}
                </h3>

                {selectedProject.clientName && (
                  <div className="text-xs text-slate-400 font-medium">
                    গ্রাহক/ঠিকাদার প্রতিষ্ঠান: <span className="text-amber-300 font-bold">{selectedProject.clientName}</span>
                  </div>
                )}

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3">
                    সরবরাহকৃত কাঁচামালের তালিকা:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProject.materialsSupplied.map((mat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex justify-end">
                  <a
                    href="#quote"
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all text-center text-sm"
                  >
                    এমন প্রজেক্টের জন্য কোটেশন নিন
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
