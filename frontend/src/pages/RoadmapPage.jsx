import React from 'react';
import LearningRoadmap from '../components/LearningRoadmap';
import { Route, Sparkles } from 'lucide-react';

export default function RoadmapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-dark-border pb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Dynamic Milestone Sequencer
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Personalized Learning Roadmap</h1>
        </div>
      </div>

      <LearningRoadmap />
    </div>
  );
}
