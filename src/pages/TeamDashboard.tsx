import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import {
  Users,
  Calendar,
  Layers,
  ArrowLeft,
  Mail,
  School,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldAlert,
} from 'lucide-react';

export const TeamDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      console.error('Failed to load project for team dashboard', err);
    } finally {
      setLoading(false);
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
        <Link to="/my-projects" className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm">
          Return to My Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/my-projects"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Projects</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title} — Team Workspace
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">{project.description}</p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Roster:</span>
              </span>
              <span className="font-bold text-white">
                {project.members?.length || 1} of {project.teamSize} seats
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Deadline:</span>
              </span>
              <span className="font-bold text-white">
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Members & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Team Members */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Active Team Roster</span>
              <span className="text-xs font-normal text-slate-400">
                {project.members?.length || 1} Member(s)
              </span>
            </h2>

            <div className="space-y-4">
              {project.members?.map((member: any, index: number) => {
                const isOwner =
                  (typeof project.owner === 'object' ? project.owner._id : project.owner) ===
                  (typeof member === 'object' ? member._id : member);

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                        {member?.name ? member.name[0].toUpperCase() : 'M'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{member?.name}</h4>
                          {isOwner && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                              Lead
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {member?.college} • {member?.course} ({member?.year})
                        </p>
                      </div>
                    </div>

                    {/* Member skills */}
                    <div className="flex flex-wrap gap-1">
                      {member?.skills?.slice(0, 3).map((sk: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Required Skills & Status */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>Required Skill Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills?.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-indigo-300 text-xs font-semibold border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Next Steps for Team
            </h3>
            <ul className="text-xs text-slate-400 space-y-2.5 list-disc pl-4">
              <li>Coordinate tech stack & task distribution with your team lead.</li>
              <li>Set up your GitHub repo and communication channel.</li>
              <li>Keep track of the project target deadline ({new Date(project.deadline).toLocaleDateString()}).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
