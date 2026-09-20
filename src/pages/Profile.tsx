import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import {
  User as UserIcon,
  School,
  BookOpen,
  Calendar,
  Tag,
  Heart,
  Award,
  Edit3,
  Mail,
  FolderGit2,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('teamforge_token')}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setProfileData(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const activeUser = profileData || user;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-900 border-2 border-indigo-400/30 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0">
            {activeUser?.name ? activeUser.name[0].toUpperCase() : 'S'}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeUser?.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-400 text-sm font-medium mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{activeUser?.email}</span>
                </div>
              </div>

              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-sm font-semibold transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
            </div>

            {/* University & Degree */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                <School className="w-4 h-4 text-indigo-400" />
                {activeUser?.college || 'College not specified'}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                <BookOpen className="w-4 h-4 text-sky-400" />
                {activeUser?.course || 'Course not specified'}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {activeUser?.year || 'Year not specified'}
              </span>
            </div>

            {/* Bio */}
            {activeUser?.bio && (
              <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-2xl bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                {activeUser.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Interests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-white font-bold text-base">
            <Tag className="w-5 h-5 text-indigo-400" />
            <span>Technical Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeUser?.skills && activeUser.skills.length > 0 ? (
              activeUser.skills.map((s: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/50 text-indigo-300 border border-indigo-800/40 text-xs font-semibold"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills listed yet.</span>
            )}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-white font-bold text-base">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>Project Interests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeUser?.interests && activeUser.interests.length > 0 ? (
              activeUser.interests.map((item: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 text-xs font-semibold"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No interests listed yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4 text-white font-bold text-base">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Achievements & Highlights</span>
        </div>
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Student Member</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Active member of TeamForge team-building platform ready for hackathons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
