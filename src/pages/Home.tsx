import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  PlusCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Palette,
  Briefcase,
  Terminal,
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>MERN Stack Architecture • Phase 1 Active</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Find Your Team. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-sky-400">
              Build Your Idea.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            TeamForge helps students discover teammates based on skills and interests for projects, hackathons, and competitions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Find a Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/create-project"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Create a Project</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-white">College</div>
              <div className="text-xs text-slate-400 mt-1">Course & Capstone Projects</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-indigo-400">Hackathon</div>
              <div className="text-xs text-slate-400 mt-1">Ready for 24h/48h Sprints</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-sky-400">Skill Match</div>
              <div className="text-xs text-slate-400 mt-1">Filter by Tech & Talents</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-emerald-400">Live Team</div>
              <div className="text-xs text-slate-400 mt-1">Join Requests & Member Hub</div>
            </div>
          </div>
        </div>
      </section>

      {/* How TeamForge Works */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How TeamForge Works</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Four streamlined steps from an idea to a fully staffed project team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-800/50">
                01
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Post an Idea</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Describe your project, select categories (Hackathon, Startup, etc.), and specify needed skills.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-800/50">
                02
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Browse by Skills</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Students search by tags like React, Python, Machine Learning, UI/UX, or Solidity.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-800/50">
                03
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Request to Join</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Send a 1-click request. Project creators review candidate student profiles and qualifications.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-800/50">
                04
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Build Together</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Access the shared Team Dashboard, track project milestones, deadlines, and roster members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights: Find Skilled Teammates, Create Projects, Build Teams */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Find Skilled Teammates</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Discover passionate peers from your college or fellow competitors across specialized domains: full-stack, mobile, AI, data science, and design.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="px-2.5 py-1 rounded bg-slate-800">Python</span>
                <span className="px-2.5 py-1 rounded bg-slate-800">React</span>
                <span className="px-2.5 py-1 rounded bg-slate-800">Machine Learning</span>
                <span className="px-2.5 py-1 rounded bg-slate-800">UI/UX</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Projects</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Have a great hackathon concept or final year capstone? Create a listing, specify desired headcount, stack, and application deadline in seconds.
              </p>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span>Instant visibility to thousands of students</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Build Teams</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Review candidate applications with their college, course, bio, and skills. Accept candidates to automatically update the project roster.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero duplicate requests & team cap limits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 1 Architecture Banner */}
      <section className="py-12 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/20 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Phase 1 Milestone Complete: Clean Architecture & MERN Foundation
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Clean modular folders for backend controllers, models, routes, middleware, and config, alongside React Router, Auth Context, and typed services.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-indigo-300 font-mono">
                Express REST API: /api/health [Active]
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-emerald-300 font-mono">
                MongoDB Schemas: User, Project, TeamRequest
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-sky-300 font-mono">
                JWT & Role Middleware
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
