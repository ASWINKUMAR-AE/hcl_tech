import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Route, ShieldCheck, Zap, ArrowRight, CheckCircle2, Play, Cpu, Layers, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BlackHoleHeroSection } from '../components/ui/blackhole-hero-section';
import { GradientButton } from '../components/ui/shader-button';
import { GradientCard } from '../components/ui/gradient-card';

/** Hook to detect narrow viewports for responsive WebGL camera focus */
function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [query]);
  return narrow;
}

export default function LandingPage() {
  const { user, loginDemoUser } = useAuth();
  const navigate = useNavigate();
  const narrow = useNarrow();

  const handleDemoClick = async () => {
    try {
      await loginDemoUser();
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* -------------------------------------------------------------------------- */}
      {/* HERO SECTION WITH BLACK HOLE WEBGL CANVAS & IPHONE LIQUID GLASS AESTHETIC   */}
      {/* -------------------------------------------------------------------------- */}
      <section className="relative min-h-[92vh] w-full flex items-center justify-center border-b border-white/10">
        <BlackHoleHeroSection
          focus={narrow ? [0.5, 0.75] : [0.70, 0.48]}
          scrim={narrow ? "top" : "left"}
          scrimStrength={0.92}
          distance={24}
          elevation={narrow ? -7 : -5.5}
          fov={narrow ? 56 : 42}
          glow={narrow ? 0.9 : 1.15}
          steps={narrow ? 200 : 320}
          resolution={narrow ? 0.65 : 0.8}
          hotColor="#FFF3DE"
          midColor="#9b8afb"
          coolColor="#3d1b95"
          doppler={0.4}
          starBrightness={0.8}
          exposure={0.95}
          vignette={0.35}
        >
          <div className="flex h-full min-h-[92vh] items-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12">
            <div className="max-w-2xl text-left">
              {/* iPhone Liquid Glass Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-xs font-medium text-cyan-300 mb-8 transition-all hover:bg-white/[0.08] hover:border-cyan-400/30">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="tracking-wide">Next-Gen Adaptive Learning Engine</span>
              </div>

              {/* Title with Gradient Glow */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
                Your Learning Path. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 drop-shadow-[0_0_25px_rgba(124,92,247,0.4)]">
                  Powered by AI.
                </span>
              </h1>

              {/* Paragraph Copy */}
              <p className="mt-6 text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl">
                Tell us your target role. PathFinder AI calculates your skill gaps, maps out prerequisite graph nodes, and navigates your career journey through curved knowledge space.
              </p>

              {/* Action Buttons with Primary Shader Gradient Button */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <GradientButton
                  onClick={() => navigate(user ? "/onboarding" : "/login")}
                >
                  <span>Build My Learning Path</span>
                  <ArrowRight className="w-4 h-4 ml-1 inline" />
                </GradientButton>

                <button
                  onClick={handleDemoClick}
                  className="px-8 py-4 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/15 hover:bg-white/[0.12] hover:border-white/30 text-slate-100 font-bold text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  <span>Explore Live Demo</span>
                </button>
              </div>
            </div>
          </div>
        </BlackHoleHeroSection>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* FEATURE HIGHLIGHTS WITH 3D GRADIENT CARDS                                 */}
      {/* -------------------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Architected for Modern Engineers
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Experience ultra-smooth adaptive learning driven by real-time skill graph analysis.
          </p>
        </div>

        {/* Row 1: Left-to-Right Continuous Auto-Scrolling Marquee Container */}
        <div className="w-full overflow-hidden no-scrollbar py-4 touch-pan-x relative">
          {/* Subtle edge fade gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />

          <div className="animate-marquee-ltr gap-8 px-4">
            {/* Set 1 */}
            <div className="w-[320px] sm:w-[360px] shrink-0">
              <GradientCard
                title="AI Profiling Engine"
                description="Extracts target competencies directly from your career goals and matches them against comprehensive skill graphs."
                icon={<Cpu className="w-5 h-5 text-cyan-300" />}
                linkText="Explore Goal Profiler"
                linkHref={user ? "/onboarding" : "/login"}
                onClick={() => navigate(user ? "/onboarding" : "/login")}
                glowColors={{
                  primary: "rgba(124, 92, 247, 0.85)",
                  secondary: "rgba(6, 182, 212, 0.7)",
                  center: "rgba(161, 58, 229, 0.8)"
                }}
              />
            </div>
            <div className="w-[320px] sm:w-[360px] shrink-0">
              <GradientCard
                title="Skill Graph Ordering"
                description="Prevents recommending advanced frameworks before required prerequisites are verified in your learning profile."
                icon={<Route className="w-5 h-5 text-indigo-300" />}
                linkText="View Skill Graph"
                linkHref={user ? "/roadmap" : "/login"}
                onClick={() => navigate(user ? "/roadmap" : "/login")}
                glowColors={{
                  primary: "rgba(99, 102, 241, 0.85)",
                  secondary: "rgba(168, 85, 247, 0.7)",
                  center: "rgba(124, 58, 237, 0.8)"
                }}
              />
            </div>
            <div className="w-[320px] sm:w-[360px] shrink-0">
              <GradientCard
                title="Context-Aware AI Orb"
                description="Ask questions anytime. The AI assistant understands your active milestone step and profile state automatically."
                icon={<Sparkles className="w-5 h-5 text-amber-300" />}
                linkText="Try AI Assistant"
                linkHref={user ? "/dashboard" : "/login"}
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                glowColors={{
                  primary: "rgba(6, 182, 212, 0.85)",
                  secondary: "rgba(245, 158, 11, 0.7)",
                  center: "rgba(14, 165, 233, 0.8)"
                }}
              />
            </div>

            {/* Set 2 (for seamless infinite loop) */}
            <div className="w-[320px] sm:w-[360px] shrink-0">
              <GradientCard
                title="AI Profiling Engine"
                description="Extracts target competencies directly from your career goals and matches them against comprehensive skill graphs."
                icon={<Cpu className="w-5 h-5 text-cyan-300" />}
                linkText="Explore Goal Profiler"
                linkHref={user ? "/onboarding" : "/login"}
                onClick={() => navigate(user ? "/onboarding" : "/login")}
                glowColors={{
                  primary: "rgba(124, 92, 247, 0.85)",
                  secondary: "rgba(6, 182, 212, 0.7)",
                  center: "rgba(161, 58, 229, 0.8)"
                }}
              />
            </div>
            <div className="w-[320px] sm:w-[360px] shrink-0">
              <GradientCard
                title="Skill Graph Ordering"
                description="Prevents recommending advanced frameworks before required prerequisites are verified in your learning profile."
                icon={<Route className="w-5 h-5 text-indigo-300" />}
                linkText="View Skill Graph"
                linkHref={user ? "/roadmap" : "/login"}
                onClick={() => navigate(user ? "/roadmap" : "/login")}
                glowColors={{
                  primary: "rgba(99, 102, 241, 0.85)",
                  secondary: "rgba(168, 85, 247, 0.7)",
                  center: "rgba(124, 58, 237, 0.8)"
                }}
              />
            </div>
            <div className="w-[320px] sm:w-[360px] shrink-0">
              <GradientCard
                title="Context-Aware AI Orb"
                description="Ask questions anytime. The AI assistant understands your active milestone step and profile state automatically."
                icon={<Sparkles className="w-5 h-5 text-amber-300" />}
                linkText="Try AI Assistant"
                linkHref={user ? "/dashboard" : "/login"}
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                glowColors={{
                  primary: "rgba(6, 182, 212, 0.85)",
                  secondary: "rgba(245, 158, 11, 0.7)",
                  center: "rgba(14, 165, 233, 0.8)"
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Right-to-Left Continuous Tech Stack Marquee (ZetHub Style) */}
        <div className="w-full overflow-hidden no-scrollbar mt-6 relative">
          {/* Subtle edge fade gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />

          <div className="animate-marquee-rtl gap-4 px-4 py-2">
            {[
              "Skill Graph Traversal",
              "Neural Gap Engine",
              "Adaptive Curriculum",
              "Curved Knowledge Space",
              "Real-time AI Assistant",
              "WebGL Black Hole Shader",
              "Prerequisite Node Calculator",
              "Role-Based Skill Vector",
              "Skill Graph Traversal",
              "Neural Gap Engine",
              "Adaptive Curriculum",
              "Curved Knowledge Space",
              "Real-time AI Assistant",
              "WebGL Black Hole Shader",
              "Prerequisite Node Calculator",
              "Role-Based Skill Vector",
            ].map((badge, idx) => (
              <div
                key={idx}
                className="px-5 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2 shrink-0 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
