import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import {
  ShieldCheck,
  Users,
  FolderGit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Activity,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'students'>('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, projectsRes] = await Promise.all([
        fetch('/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('teamforge_token')}` },
        }),
        fetch('/api/projects'),
      ]);

      const usersData = await usersRes.json();
      const projectsData = await projectsRes.json();

      if (usersRes.ok) setUsers(usersData.users || []);
      if (projectsRes.ok) setProjects(projectsData.projects || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project as administrator?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('teamforge_token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete project');

      setFeedback('Project removed by admin.');
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setFeedback(err.message || 'Failed to delete project.');
    }
  };

  const totalUsers = users.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Open' || p.status === 'In Progress').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-800/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-400 text-xs">
              System governance, platform metrics, and content moderation
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalUsers}</div>
          <div className="text-[11px] text-slate-500 mt-1">Registered across colleges</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalProjects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Hackathons & capstones</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Projects</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{activeProjects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Open or In Progress</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Completed</span>
            <CheckCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-sky-400">{completedProjects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Finished team projects</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & Moderation
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'projects'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'students'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All Students ({users.length})
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : activeTab === 'students' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">College & Major</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {u.college} • {u.course} ({u.year})
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.skills?.slice(0, 3).map((sk: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Projects List / Moderation */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Owner</th>
                  <th className="px-6 py-3.5">Team Status</th>
                  <th className="px-6 py-3.5 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-semibold text-white">{p.title}</td>
                    <td className="px-6 py-4 text-slate-400">{p.category}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {typeof p.owner === 'object' ? p.owner?.name : 'User'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {p.status} ({p.members?.length || 1}/{p.teamSize})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-all"
                        title="Delete inappropriate project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
