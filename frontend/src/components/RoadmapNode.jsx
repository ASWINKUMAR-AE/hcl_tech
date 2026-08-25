import React from 'react';
import { CheckCircle2, PlayCircle, Lock, Sparkles, BookOpen, Code, FileCheck } from 'lucide-react';

export default function RoadmapNode({ step, isSelected, onClick }) {
  const getStatusBadge = () => {
    switch (step.status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 animate-pulse"><PlayCircle className="w-3.5 h-3.5" /> Active Step</span>;
      case 'available':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">Available</span>;
      case 'locked':
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700"><Lock className="w-3 h-3" /> Locked</span>;
    }
  };

  const getResourceIcon = () => {
    if (step.resource_type === 'project') return <Code className="w-4 h-4 text-amber-400" />;
    if (step.resource_type === 'assessment') return <FileCheck className="w-4 h-4 text-purple-400" />;
    return <BookOpen className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div
      onClick={() => onClick(step)}
      className={`group relative glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-brand-500 bg-brand-950/40 border-brand-400/50 shadow-xl shadow-brand-500/20'
          : 'hover:border-brand-500/40 hover:bg-dark-cardHover'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          {/* Step Order Badge */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shrink-0 transition-transform group-hover:scale-105 ${
            step.status === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : step.status === 'in_progress'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : 'bg-dark-card text-slate-400 border-dark-border'
          }`}>
            {String(step.step_order).padStart(2, '0')}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{step.milestone}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                {getResourceIcon()}
                {step.resource_type}
              </span>
            </div>
            <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
              {step.title}
            </h4>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Progress Line Bar inside Step */}
      <div className="mt-4 w-full bg-dark-card rounded-full h-1.5 overflow-hidden border border-dark-border">
        <div
          className={`h-full transition-all duration-500 ${
            step.status === 'completed'
              ? 'bg-emerald-400'
              : step.status === 'in_progress'
              ? 'bg-gradient-to-r from-brand-500 to-cyan-400'
              : 'bg-slate-700'
          }`}
          style={{ width: `${step.completion_percentage || 0}%` }}
        />
      </div>
    </div>
  );
}
