import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, Users, Tag, AlertCircle, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['College Project', 'Hackathon', 'Competition', 'Startup Idea', 'Open Source'];

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'College Project',
    requiredSkills: '',
    teamSize: '4',
    deadline: '',
    status: 'Open',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.requiredSkills || !formData.deadline) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('teamforge_token')}`,
        },
        body: JSON.stringify({
          ...formData,
          requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
          teamSize: Number(formData.teamSize),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create project');

      navigate(`/projects/${data.project._id}`);
    } catch (err: any) {
      setError(err.message || 'Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Create New Project</h1>
            <p className="text-slate-400 text-xs mt-0.5">Post an idea to recruit skilled teammates</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Flood Prediction System"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Max Team Size *
              </label>
              <input
                type="number"
                name="teamSize"
                min={2}
                max={20}
                required
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Required Skills (comma separated) *
            </label>
            <input
              type="text"
              name="requiredSkills"
              required
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="Python, Machine Learning, React, UI/UX"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Submission / Target Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Open">Open (Accepting Teammates)</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Detailed Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem, current progress, tech stack architecture, and what roles you want to fill..."
              className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Publishing Project...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
