import React from 'react';
import { Users, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-sm mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white tracking-tight">TeamForge</span>
          <span className="text-slate-500">— Find Your Team. Build Your Idea.</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400 text-xs">
          <span>College Projects</span>
          <span>Hackathons</span>
          <span>Open Source</span>
          <span>Competitions</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <span>Built for students & builders</span>
        </div>
      </div>
    </footer>
  );
};
