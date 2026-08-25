import React, { useState } from 'react';
import RoadmapNode from './RoadmapNode';
import { usePath } from '../context/PathContext';
import { Sparkles, CheckCircle2, Play, ArrowRight, BookOpen, Layers, Award, RefreshCw } from 'lucide-react';
import { aiAPI } from '../services/api';

export default function LearningRoadmap() {
  const { activePath, updateStepStatus, loadPathData } = usePath();
  const [selectedStep, setSelectedStep] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  if (!activePath || !activePath.steps) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center border border-dark-border">
        <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white">No Active Learning Path Found</h3>
        <p className="text-slate-400 text-sm mt-2">Enter your goal in the profiler to generate your personalized roadmap.</p>
      </div>
    );
  }

  const handleStepClick = async (step) => {
    setSelectedStep(step);
    setLoadingAi(true);
    setAiExplanation('');

    try {
      const res = await aiAPI.explainRecommendation({
        title: step.title,
        category: step.skill_category || 'Full Stack',
        difficulty_level: step.status,
      });
      if (res.data.success) {
        setAiExplanation(res.data.data.explanation);
      }
    } catch (e) {
      setAiExplanation(`This step is specifically placed in phase ${step.step_order} because ${step.skill_name || 'this skill'} is a direct prerequisite for your target career goal.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleComplete = async (stepId) => {
    await updateStepStatus(stepId, 'completed');
    if (selectedStep && selectedStep.id === stepId) {
      setSelectedStep({ ...selectedStep, status: 'completed', completion_percentage: 100 });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Vertical Dynamic Roadmap Timeline */}
      <div className="lg:col-span-7 space-y-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              {activePath.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{activePath.description}</p>
          </div>
          <button
            onClick={() => loadPathData()}
            className="p-2 text-slate-400 hover:text-white rounded-lg glass-card hover:bg-dark-card transition-colors"
            title="Refresh Path"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Path Overall Progress Meter */}
        <div className="glass-card rounded-2xl p-5 border border-brand-500/30 bg-gradient-to-r from-brand-950/50 to-indigo-950/40 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Path Completion</span>
            <span className="text-base font-extrabold text-cyan-300">{activePath.overall_progress}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden border border-dark-border p-[1px]">
            <div
              className="bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-md shadow-cyan-500/20"
              style={{ width: `${activePath.overall_progress}%` }}
            />
          </div>
        </div>

        {/* Step Nodes List */}
        <div className="space-y-3.5 relative">
          {activePath.steps.map((step, idx) => (
            <RoadmapNode
              key={step.id}
              step={step}
              isSelected={selectedStep?.id === step.id}
              onClick={handleStepClick}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Detailed Recommendation Step Inspector */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 glass-card rounded-3xl p-6 border border-dark-border space-y-6">
          {selectedStep ? (
            <>
              <div className="border-b border-dark-border pb-4">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{selectedStep.milestone}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedStep.title}</h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-cyan-400" /> {selectedStep.resource_type}</span>
                  <span>•</span>
                  <span>Est: {selectedStep.estimated_hours} Hours</span>
                </div>
              </div>

              {/* Why Recommended AI Explanation */}
              <div className="bg-brand-950/30 border border-brand-500/30 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                  Why this is recommended
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  {loadingAi ? 'Asking PathFinder AI service...' : (aiExplanation || selectedStep.reason || 'This resource is specifically sequenced based on your skill graph prerequisites.')}
                </p>
              </div>

              {/* Skills Gained Badges */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" /> Skills You'll Gain
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-dark-card border border-brand-500/30 text-xs font-semibold text-brand-300">
                    {selectedStep.skill_name || 'Core Skill'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-300">
                    {selectedStep.skill_category || 'Engineering'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                {selectedStep.status !== 'completed' ? (
                  <button
                    onClick={() => handleComplete(selectedStep.id)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Step Complete (+85 Skill Score)
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-center text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Step Mastered
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Layers className="w-10 h-10 text-brand-400 mx-auto" />
              <h4 className="font-bold text-white text-base">Select any roadmap node</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click on any step on the left timeline to view AI explanations, skills gained, and resource actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
