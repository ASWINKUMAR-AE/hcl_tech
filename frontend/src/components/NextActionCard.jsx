import React from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from './ui/shader-button';

export default function NextActionCard({ activeStep }) {
  const navigate = useNavigate();

  const title = activeStep ? activeStep.title : 'React 18 Architecture & Hooks';
  const reason = activeStep ? `Prerequisite skill for ${activeStep.milestone}. Complete this step to advance path progress.` : 'You have completed JavaScript fundamentals. React state management is required next for your Full Stack Developer goal.';

  return (
    <div className="glass-card rounded-3xl p-6 border border-brand-500/40 bg-gradient-to-r from-brand-950/60 via-dark-card to-indigo-950/50 relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Next Best Action
          </span>
          <h3 className="text-xl font-extrabold text-white">{title}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xl">{reason}</p>
        </div>

        <GradientButton
          onClick={() => navigate('/roadmap')}
          className="shrink-0"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4 ml-1 inline" />
        </GradientButton>
      </div>
    </div>
  );
}
