import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import {
  FolderGit2,
  PlusCircle,
  Compass,
  Bell,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hello, {user?.name || 'Student'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {user?.college} • {user?.course} ({user?.year})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create-project"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Project</span>
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Link
          to="/explore"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
            Explore Projects
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Search hackathons, capstones, and open-source groups.
          </p>
        </Link>

        <Link
          to="/my-projects"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
            My Projects
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage your created projects and joined teams.
          </p>
        </Link>

        <Link
          to="/requests"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
            Team Requests
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Accept or reject candidates requesting to join your team.
          </p>
        </Link>

        <Link
          to="/profile"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
            Student Profile
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Showcase your skills, interests, and achievements.
          </p>
        </Link>
      </div>

      {/* Profile Snapshot & Skills */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span>Your Skills & Interests Profile</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Registered Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-indigo-300 text-xs border border-slate-700 font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No skills listed yet. Update your profile!</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Interests & Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-emerald-300 text-xs border border-slate-700 font-medium"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No interests listed yet.</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <Link
            to="/profile/edit"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Edit Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
