import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { FolderGit2, PlusCircle, Users, Calendar, ArrowRight, Layers } from 'lucide-react';

export const MyProjects: React.FC = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();

      if (res.ok && data.projects) {
        const myId = user?.id || user?._id;
        const created = data.projects.filter(
          (p: any) => (typeof p.owner === 'object' ? p.owner._id : p.owner) === myId
        );
        const joined = data.projects.filter((p: any) => {
          const isOwner = (typeof p.owner === 'object' ? p.owner._id : p.owner) === myId;
          const isMem = p.members?.some(
            (m: any) => (typeof m === 'object' ? m._id : m) === myId
          );
          return !isOwner && isMem;
        });

        setCreatedProjects(created);
        setJoinedProjects(joined);
      }
    } catch (err) {
      console.error('Failed to load my projects', err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'created' ? createdProjects : joinedProjects;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage created teams and projects you have joined.</p>
        </div>

        <Link
          to="/create-project"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('created')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'created'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Created by Me</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300">
            {createdProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'joined'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Joined Teams</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300">
            {joinedProjects.length}
          </span>
        </button>
      </div>

      {/* Content list */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {activeTab === 'created' ? 'No created projects yet' : 'No joined projects yet'}
          </h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            {activeTab === 'created'
              ? 'Start building your team by posting a new college project or hackathon idea.'
              : 'Browse active projects in Explore and request to join matching teams.'}
          </p>
          <div className="mt-5">
            <Link
              to={activeTab === 'created' ? '/create-project' : '/explore'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {activeTab === 'created' ? 'Create a Project' : 'Explore Projects'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((proj) => (
            <div
              key={proj._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                    {proj.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{proj.title}</h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.requiredSkills?.slice(0, 3).map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {proj.members?.length || 1} / {proj.teamSize} members
                  </span>
                </div>

                <Link
                  to={`/team-dashboard/${proj._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
