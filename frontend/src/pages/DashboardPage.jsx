import React from 'react';
import { usePath } from '../context/PathContext';
import { useAuth } from '../context/AuthContext';
import NextActionCard from '../components/NextActionCard';
import SkillChart from '../components/SkillChart';
import SkillGapCard from '../components/SkillGapCard';
import { Award, BookOpen, CheckCircle2, Flame, Layers, Sparkles, Star, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { activePath, skillGap, recommendations, progressMetrics } = usePath();

  const activeStep = activePath?.steps?.find(s => s.status === 'in_progress' || s.status === 'available');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            Good to see you, {user?.name || 'Learner'} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Career Goal: <span className="text-cyan-300 font-semibold">{profile?.career_goal || 'Full Stack Web Developer'}</span>
          </p>
        </div>

        {/* Momentum Badges */}
        <div className="flex items-center space-x-3">
          <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2 border border-amber-500/30 bg-amber-500/10">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            <div>
              <span className="block text-xs font-bold text-amber-300">5 Days</span>
              <span className="text-[10px] text-slate-400 uppercase">Learning Streak</span>
            </div>
          </div>

          <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2 border border-brand-500/30 bg-brand-500/10">
            <Trophy className="w-5 h-5 text-brand-300" />
            <div>
              <span className="block text-xs font-bold text-brand-300">{activePath?.overall_progress || 25}%</span>
              <span className="text-[10px] text-slate-400 uppercase">Path Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Best Action Banner */}
      <NextActionCard activeStep={activeStep} />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skill Development Chart & Skill Gap */}
        <div className="lg:col-span-8 space-y-8">
          {/* Skill Distribution Chart */}
          <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-400" /> Skill Proficiency Index
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time breakdown of mastered vs missing target competencies</p>
              </div>
            </div>
            <SkillChart skills={progressMetrics?.skills} />
          </div>

          {/* Skill Gap Analysis Component */}
          <SkillGapCard skillGap={skillGap} />
        </div>

        {/* Right Column: AI Recommendations & Recent Activity */}
        <div className="lg:col-span-4 space-y-8">
          {/* Recommended Resources List */}
          <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Recommended For You
              </h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">AI Scored</span>
            </div>

            <div className="space-y-3">
              {recommendations && recommendations.length > 0 ? (
                recommendations.slice(0, 4).map((rec) => (
                  <div key={rec.id || rec.title} className="bg-dark-card/70 hover:bg-dark-card border border-dark-border hover:border-brand-500/40 rounded-2xl p-3.5 transition-all">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{rec.resource_type || 'course'}</span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {rec.recommendation_score}% Match
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mt-1 line-clamp-1">{rec.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{rec.reason}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">No pending recommendations</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
