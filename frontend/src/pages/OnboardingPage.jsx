import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, pathAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Check, ArrowRight, ArrowLeft, Loader2, Target, Cpu, Clock, CheckCircle } from 'lucide-react';
import { GradientButton } from '../components/ui/shader-button';

const LOADING_STEPS = [
  "Analyzing your career goal with AI...",
  "Extracting required core competencies...",
  "Mapping skill graph prerequisite relationships...",
  "Building your personalized learning path...",
  "Scoring recommendation confidence scores...",
  "Almost ready..."
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState("I want to become a Full Stack Web Developer specializing in React and Node.js.");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [knownSkills, setKnownSkills] = useState(['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub']);
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [learningStyle, setLearningStyle] = useState("hands_on");

  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const availableSkills = [
    'HTML5', 'CSS3', 'JavaScript', 'Git & GitHub', 'React.js', 
    'Node.js', 'Express.js', 'MySQL', 'RESTful APIs', 'TypeScript', 'Tailwind CSS', 'Docker'
  ];

  const toggleSkill = (skill) => {
    if (knownSkills.includes(skill)) {
      setKnownSkills(knownSkills.filter(s => s !== skill));
    } else {
      setKnownSkills([...knownSkills, skill]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < LOADING_STEPS.length) {
        setLoadingStepIdx(idx);
      }
    }, 1200);

    try {
      // 1. Save profile
      await profileAPI.saveProfile({
        career_goal: careerGoal,
        experience_level: experienceLevel,
        weekly_learning_hours: weeklyHours,
        preferred_learning_style: learningStyle,
        known_skills: knownSkills,
      });

      // 2. Generate path
      await pathAPI.generate(careerGoal);
      await refreshProfile();

      clearInterval(interval);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed onboarding:', err);
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Step Progress Bar Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">AI Goal Profiler</span>
          <h1 className="text-2xl font-black text-white mt-1">Tell me where you want to go.</h1>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border ${
                step === i
                  ? 'bg-brand-500 text-white border-brand-400'
                  : step > i
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-dark-card text-slate-500 border-dark-border'
              }`}
            >
              {step > i ? <Check className="w-4 h-4" /> : i}
            </div>
          ))}
        </div>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="glass-card rounded-3xl p-8 border border-dark-border shadow-2xl relative min-h-[420px] flex flex-col justify-between">
        
        {loading ? (
          <div className="my-auto py-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-[2px] mx-auto shadow-2xl shadow-brand-500/30">
              <div className="w-full h-full bg-dark-bg rounded-[22px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">{LOADING_STEPS[loadingStepIdx]}</h3>
              <p className="text-xs text-slate-400 mt-2">PathFinder AI is processing your skills and prerequisite graph...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Goals */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Target className="w-5 h-5 text-cyan-400" /> Step 1/3 — Define Career Goal
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    What is your target career or learning objective?
                  </label>
                  <textarea
                    rows={4}
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g. I want to become a Full Stack Web Developer specializing in React and Node.js."
                    className="w-full bg-dark-bg border border-dark-border rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-400">Quick Prompts:</span>
                  {[
                    "Full Stack Web Developer (React + Node.js)",
                    "Backend Software Engineer (Node + Express + MySQL)",
                    "Frontend UI Architect (React + TypeScript + Tailwind)",
                  ].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCareerGoal(p)}
                      className="px-3 py-1 rounded-lg bg-dark-card hover:bg-brand-900/40 text-xs text-slate-300 border border-dark-border transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Skills & Experience */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Cpu className="w-5 h-5 text-cyan-400" /> Step 2/3 — Current Skills & Experience
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold capitalize border transition-all ${
                          experienceLevel === level
                            ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-500/20'
                            : 'bg-dark-card text-slate-400 border-dark-border hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Select Skills You Already Know</label>
                  <div className="flex flex-wrap gap-2.5">
                    {availableSkills.map(skill => {
                      const isSelected = knownSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                              : 'bg-dark-card text-slate-400 border-dark-border hover:text-slate-200'
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Clock className="w-5 h-5 text-cyan-400" /> Step 3/3 — Learning Preferences
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Available Learning Commitment ({weeklyHours} Hours / Week)
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full accent-brand-500 bg-dark-card h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Preferred Learning Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'hands_on', label: 'Hands-on Projects' },
                      { id: 'video', label: 'Video Courses' },
                      { id: 'reading', label: 'Documentation & Books' },
                      { id: 'visual', label: 'Interactive Diagrams' },
                    ].map(style => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setLearningStyle(style.id)}
                        className={`p-3 rounded-xl text-xs font-bold border text-left transition-all ${
                          learningStyle === style.id
                            ? 'bg-brand-600 text-white border-brand-400'
                            : 'bg-dark-card text-slate-400 border-dark-border'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-dark-border pt-6 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-xl glass-card hover:bg-dark-card text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-brand-500/20"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <GradientButton
                  onClick={handleFinish}
                >
                  <Sparkles className="w-4 h-4 text-cyan-300 inline" /> Build My Learning Path
                </GradientButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
