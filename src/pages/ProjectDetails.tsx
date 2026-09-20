import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import {
  Users,
  Calendar,
  Tag,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Send,
  Layers,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProject(data.project);
      }
    } catch (err) {
      console.error('Failed to load project details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRequestLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/projects/${id}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('teamforge_token')}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit join request');
      }

      setStatusMessage({
        type: 'success',
        text: 'Join request sent! The project owner will review your application.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not send join request.',
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-slate-400 text-sm mt-2">This project may have been removed or does not exist.</p>
        <Link
          to="/explore"
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-semibold"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const ownerId = typeof project.owner === 'object' ? project.owner._id : project.owner;
  const isOwner = user?.id === ownerId || user?._id === ownerId;
  const isMember = project.members?.some(
    (m: any) => (typeof m === 'object' ? m._id : m) === (user?.id || user?._id)
  );
  const isFull = (project.members?.length || 0) >= project.teamSize;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate('/explore')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      {/* Main Project Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                {project.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'Open'
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                    : 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                }`}
              >
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
          </div>

          {/* Action CTA */}
          <div>
            {isOwner ? (
              <Link
                to={`/team-dashboard/${project._id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all"
              >
                <span>Team Dashboard</span>
              </Link>
            ) : isMember ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-800 text-sm font-semibold">
                <UserCheck className="w-4 h-4" />
                <span>You're a Team Member</span>
              </div>
            ) : isFull ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-500 text-sm font-semibold cursor-not-allowed"
              >
                Team is Full
              </button>
            ) : (
              <button
                onClick={handleJoinRequest}
                disabled={requestLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{requestLoading ? 'Sending...' : 'Request to Join'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Project Description
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            {project.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Required Skills & Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-indigo-300 text-xs font-semibold border border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Team Details & Owner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
          {/* Owner Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Project Creator
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center font-bold text-base">
                {project.owner?.name ? project.owner.name[0].toUpperCase() : 'O'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{project.owner?.name}</h4>
                <p className="text-xs text-slate-400">
                  {project.owner?.college || 'College not listed'} • {project.owner?.course || 'Major'}
                </p>
              </div>
            </div>
          </div>

          {/* Team Capacity & Deadline */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Team & Logistics
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Team Size Limit:</span>
                </span>
                <span className="font-bold text-white">
                  {project.members?.length || 1} / {project.teamSize} members
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Target Deadline:</span>
                </span>
                <span className="font-bold text-white">
                  {new Date(project.deadline).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
