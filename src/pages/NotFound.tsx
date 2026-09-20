import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <div className="text-4xl font-extrabold text-white mb-2">404</div>
        <h2 className="text-xl font-bold text-white tracking-tight mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The page or project you are looking for might have been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
