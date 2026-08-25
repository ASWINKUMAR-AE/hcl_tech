import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { ShieldAlert, BookOpen, Cpu, Users, PlusCircle, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');

  // Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('Frontend');
  const [courseDifficulty, setCourseDifficulty] = useState('intermediate');
  const [courseHours, setCourseHours] = useState(10);
  const [msg, setMsg] = useState('');

  // Skill Form State
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Backend');
  const [skillDesc, setSkillDesc] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await adminAPI.addCourse({
        title: courseTitle,
        description: courseDesc,
        category: courseCategory,
        difficulty_level: courseDifficulty,
        duration_hours: courseHours,
      });
      if (res.data.success) {
        setMsg(`Course "${courseTitle}" added successfully!`);
        setCourseTitle('');
        setCourseDesc('');
        fetchAdminData();
      }
    } catch (e) {
      setMsg('Failed to add course');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await adminAPI.addSkill({
        name: skillName,
        category: skillCategory,
        description: skillDesc,
      });
      if (res.data.success) {
        setMsg(`Skill "${skillName}" added successfully!`);
        setSkillName('');
        setSkillDesc('');
        fetchAdminData();
      }
    } catch (e) {
      setMsg('Failed to add skill');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-dark-border pb-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Platform Management Portal
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Admin Dashboard</h1>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-dark-border">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Learners</span>
          <span className="block text-3xl font-black text-white mt-1">{stats?.totalUsers || 2}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-dark-border">
          <span className="text-xs font-bold text-slate-400 uppercase">Courses Seeded</span>
          <span className="block text-3xl font-black text-cyan-300 mt-1">{stats?.totalCourses || 30}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-dark-border">
          <span className="text-xs font-bold text-slate-400 uppercase">Skill Graph Nodes</span>
          <span className="block text-3xl font-black text-brand-300 mt-1">{stats?.totalSkills || 20}</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-dark-border">
          <span className="text-xs font-bold text-slate-400 uppercase">Paths Generated</span>
          <span className="block text-3xl font-black text-emerald-400 mt-1">{stats?.totalLearningPathsGenerated || 5}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-dark-border">
        {['courses', 'skills', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setMsg(''); }}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'bg-dark-card text-brand-300 border-t-2 border-brand-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage {tab}
          </button>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {msg}
        </div>
      )}

      {/* Tab 1: Add Course */}
      {activeTab === 'courses' && (
        <div className="glass-card rounded-3xl p-8 border border-dark-border max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-400" /> Add New Learning Resource
          </h3>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Course Title</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Next.js 14 Production Microservices"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Master server-side rendering, cache tags, and API gateways..."
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Difficulty</label>
                <select
                  value={courseDifficulty}
                  onChange={(e) => setCourseDifficulty(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Duration (Hours)</label>
                <input
                  type="number"
                  value={courseHours}
                  onChange={(e) => setCourseHours(Number(e.target.value))}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all mt-4"
            >
              Add Course Resource
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Add Skill */}
      {activeTab === 'skills' && (
        <div className="glass-card rounded-3xl p-8 border border-dark-border max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" /> Add Skill Graph Competency
          </h3>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Kubernetes"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all mt-4"
            >
              Add Skill Node
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Users */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl p-6 border border-dark-border overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-dark-border text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-dark-card/50">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <img src={u.avatar} alt="" className="w-6 h-6 rounded-full bg-brand-900" />
                    {u.name}
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-brand-500/20 text-brand-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
