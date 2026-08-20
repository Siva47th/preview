import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Award, ArrowUpRight, CheckCircle, Code2, Users, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

export const ShowcaseView = () => {
  const { showcase, setActiveTab, sendChatMessage } = useApp();
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Mobile & Cloud Architecture', 'AI & Enterprise Automation', 'Full-Stack Web App'];

  const filteredShowcase = filterCategory === 'All'
    ? showcase
    : showcase.filter(s => s.category === filterCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Executive Portfolio & Track Record
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Delivered Solutions & Case Studies
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explore enterprise software systems designed, architected, and deployed by our team. Each showcase highlights real production metrics, client feedback, and architectural benchmarks.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 shrink-0">
          <div className="text-center px-2">
            <div className="text-xl font-bold text-indigo-600">$270K+</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Delivered Value</div>
          </div>
          <div className="text-center px-2 border-x border-slate-200">
            <div className="text-xl font-bold text-emerald-600">100%</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">On-Time Exit</div>
          </div>
          <div className="text-center px-2">
            <div className="text-xl font-bold text-purple-600">99.9%</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Uptime SLA</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShowcase.map((item) => (
          <div
            key={item.id}
            className="clean-card rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Card Image */}
              <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                <img
                  src={item.heroImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/95 border border-slate-200 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-900 text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                  {item.budget}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <div>
                  <div className="text-xs text-indigo-600 font-semibold mb-1 flex items-center justify-between">
                    <span>{item.client}</span>
                    <span className="text-slate-500 font-normal">{item.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
                  {item.metrics.map((m, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-xs font-bold text-slate-900">{m.value}</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.techStack.map((tech, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedSolution(item)}
                className="w-full py-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Full Solution Case Study</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Detail Modal */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded border border-indigo-200">
                  {selectedSolution.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedSolution.title}</h2>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>Client: <strong className="text-slate-800">{selectedSolution.client}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-slate-800">{selectedSolution.duration}</strong></span>
                  <span>•</span>
                  <span>Budget: <strong className="text-indigo-600 font-mono">{selectedSolution.budget}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSolution(null)}
                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Hero Image */}
            <div className="h-56 rounded-xl overflow-hidden border border-slate-200">
              <img src={selectedSolution.heroImage} alt={selectedSolution.title} className="w-full h-full object-cover" />
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Project Solution Blueprint
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {selectedSolution.summary}
              </p>
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Verified Performance Impact
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedSolution.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-lg font-bold text-indigo-600">{m.value}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" /> Key Technical Deliverables
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedSolution.deliverables.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {selectedSolution.testimonial && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs italic text-slate-700">
                  "{selectedSolution.testimonial.quote}"
                </p>
                <div className="text-[11px] font-bold text-indigo-600">
                  — {selectedSolution.testimonial.author}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedSolution(null);
                  sendChatMessage(`Tell me more about building a solution similar to ${selectedSolution.title}`);
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition"
              >
                <Code2 className="w-4 h-4 text-indigo-600" /> Ask AI Agent About Architecture
              </button>

              <button
                onClick={() => {
                  setSelectedSolution(null);
                  setActiveTab('projects');
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition"
              >
                <span>Start Similar Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
