import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export default function SkillGapCard({ skillGap }) {
  if (!skillGap) return null;

  const { mastered = [], partiallyLearned = [], missing = [], overallReadinessPercentage = 45 } = skillGap;

  return (
    <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" /> Skill Gap Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-1">Goal Readiness: {skillGap.careerGoal}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-cyan-300">{overallReadinessPercentage}%</span>
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Ready</span>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mastered */}
        <div className="bg-dark-card/60 rounded-2xl p-4 border border-emerald-500/20">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
            <CheckCircle className="w-4 h-4" /> Mastered ({mastered.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {mastered.map(s => (
              <span key={s.id || s.name} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                {s.name} ({s.proficiencyScore}%)
              </span>
            ))}
            {mastered.length === 0 && <span className="text-xs text-slate-500">None yet</span>}
          </div>
        </div>

        {/* Partially Learned */}
        <div className="bg-dark-card/60 rounded-2xl p-4 border border-amber-500/20">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-3">
            <AlertTriangle className="w-4 h-4" /> Learning ({partiallyLearned.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {partiallyLearned.map(s => (
              <span key={s.id || s.name} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300">
                {s.name} ({s.proficiencyScore}%)
              </span>
            ))}
            {partiallyLearned.length === 0 && <span className="text-xs text-slate-500">None</span>}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-dark-card/60 rounded-2xl p-4 border border-purple-500/20">
          <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mb-3">
            <XCircle className="w-4 h-4" /> Missing Gap ({missing.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missing.map(s => (
              <span key={s.id || s.name} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-[11px] font-semibold text-purple-300">
                {s.name}
              </span>
            ))}
            {missing.length === 0 && <span className="text-xs text-slate-500">All target skills mastered!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
