import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { Bell, Check, X, Users, Calendar, School, Tag, AlertCircle } from 'lucide-react';

export const Requests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/requests/incoming', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('teamforge_token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load incoming requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (requestId: string, decision: 'accept' | 'reject') => {
    setActionLoading(requestId);
    setFeedback(null);

    try {
      const res = await fetch(`/api/requests/${requestId}/${decision}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('teamforge_token')}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${decision} request`);

      setFeedback(data.message || `Request ${decision}ed successfully!`);
      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: decision === 'accept' ? 'accepted' : 'rejected' } : r))
      );
    } catch (err: any) {
      setFeedback(err.message || `Failed to ${decision} request.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Team Join Requests</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review candidates applying to join your projects and evaluate their skills.
        </p>
      </div>

      {feedback && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm flex items-center gap-2">
          <Bell className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No incoming requests</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            When students discover your projects and request to join your team, their applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Project: {req.project?.title}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      req.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : req.status === 'accepted'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center font-bold text-base shrink-0">
                    {req.student?.name ? req.student.name[0].toUpperCase() : 'S'}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{req.student?.name}</h3>
                    <p className="text-xs text-slate-400">
                      {req.student?.college} • {req.student?.course} ({req.student?.year})
                    </p>
                    {req.student?.bio && (
                      <p className="text-xs text-slate-300 mt-1 italic line-clamp-2">
                        "{req.student.bio}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Candidate Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {req.student?.skills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[11px] border border-slate-700/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500">
                  Requested on {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {req.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleDecision(req._id, 'accept')}
                      disabled={actionLoading === req._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleDecision(req._id, 'reject')}
                      disabled={actionLoading === req._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-400 italic">
                    Decision: {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
