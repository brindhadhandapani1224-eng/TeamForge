import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Calendar,
  Tag,
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = ['All', 'College Project', 'Hackathon', 'Competition', 'Startup Idea', 'Open Source'];
const STATUSES = ['All', 'Open', 'In Progress', 'Completed'];

export const ExploreProjects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, [category, status, skillFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (status !== 'All') params.append('status', status);
      if (skillFilter !== 'All') params.append('skill', skillFilter);

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Explore Student Projects
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Discover active hackathons, startup MVPs, and college projects looking for teammates.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shrink-0"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No projects found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or be the first to create a project in this category!
          </p>
          <div className="mt-5">
            <Link
              to="/create-project"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              Create Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const memberCount = Array.isArray(proj.members) ? proj.members.length : 1;
            const isFull = memberCount >= proj.teamSize;

            return (
              <Link
                to={`/projects/${proj._id}`}
                key={proj._id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                      {proj.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        proj.status === 'Open'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                          : proj.status === 'In Progress'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>

                  <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Skills badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.requiredSkills?.slice(0, 4).map((sk: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60"
                      >
                        {sk}
                      </span>
                    ))}
                    {proj.requiredSkills?.length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-slate-800/50 text-slate-400 text-[11px]">
                        +{proj.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Team Size, Owner, Deadline */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>
                      {memberCount}/{proj.teamSize} members
                    </span>
                    {isFull && <span className="text-rose-400 text-[10px] font-bold">(Full)</span>}
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(proj.deadline).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
