import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Code2, Users, Map, TrendingUp, Clock, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';

const stagger = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { staggerChildren: 0.08 } };
const item = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function ProgressRing({ score, color, size = 100 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

const Skeleton = () => (
  <div className="shimmer" style={{ borderRadius: 20, height: 120 }} />
);

const quickActions = [
  { label: 'Analyze Resume', icon: FileText, path: '/dashboard/resume', color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
  { label: 'Technical Interview', icon: Code2, path: '/dashboard/technical', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  { label: 'HR Interview', icon: Users, path: '/dashboard/hr', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
  { label: 'Career Roadmap', icon: Map, path: '/dashboard/roadmap', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
];

const typeColors = { resume: '#6366F1', technical: '#8B5CF6', hr: '#06B6D4', roadmap: '#22C55E' };
const typeLabels = { resume: '📄 Resume', technical: '💻 Technical', hr: '🤝 HR', roadmap: '🗺️ Roadmap' };

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.stats()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  return (
    <div>
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          padding: '28px 32px', borderRadius: 20, marginBottom: 28,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26, color: '#F8FAFC', marginBottom: 6 }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: 15 }}>
            {stats?.totalResumes === 0
              ? "Let's start by analyzing your resume!"
              : `You've completed ${stats?.totalResumes || 0} resume analyses and ${(stats?.totalTechnical || 0) + (stats?.totalHR || 0)} interview sessions.`}
          </p>
        </div>
        <Link to="/dashboard/resume" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px' }}>
          <Zap size={15} /> Analyze Resume
        </Link>
      </motion.div>

      {/* Stat cards */}
      <motion.div {...stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {loading ? Array(4).fill(0).map((_, i) => <div key={i}><Skeleton /></div>) : [
          { label: 'Resumes Analyzed', value: stats?.totalResumes || 0, icon: FileText, color: '#6366F1', sub: `Latest ATS: ${stats?.latestAtsScore || 0}%` },
          { label: 'Technical Sessions', value: stats?.totalTechnical || 0, icon: Code2, color: '#8B5CF6', sub: 'Interview practice' },
          { label: 'HR Sessions', value: stats?.totalHR || 0, icon: Users, color: '#06B6D4', sub: 'Behavioral prep' },
          { label: 'Roadmaps Generated', value: stats?.totalRoadmaps || 0, icon: Map, color: '#22C55E', sub: 'Career paths' },
        ].map((s, i) => (
          <motion.div key={i} {...item} className="glass card-hover" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={20} color={s.color} />
              </div>
              <TrendingUp size={14} color="rgba(34,197,94,0.7)" />
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 36, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.8)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)' }}>{s.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass" style={{ padding: 28, borderRadius: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Resume Score Trend</h3>
          <p style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)', marginBottom: 24 }}>ATS scores across your analyses</p>
          {loading ? (
            <div className="shimmer" style={{ height: 200, borderRadius: 12 }} />
          ) : data?.scoreTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.scoreTrend}>
                <defs>
                  <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(248,250,252,0.2)" tick={{ fontSize: 11, fill: 'rgba(248,250,252,0.4)' }} />
                <YAxis stroke="rgba(248,250,252,0.2)" tick={{ fontSize: 11, fill: 'rgba(248,250,252,0.4)' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#F8FAFC', fontSize: 13 }} />
                <Area type="monotone" dataKey="atsScore" name="ATS Score" stroke="#6366F1" fill="url(#atsGrad)" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(248,250,252,0.4)', textAlign: 'center' }}>
              <FileText size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No data yet. Analyze your first resume!</p>
            </div>
          )}
        </motion.div>

        {/* ATS Score ring */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass" style={{ padding: 28, borderRadius: 20, textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Latest ATS Score</h3>
          <p style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)', marginBottom: 24 }}>Resume ATS compatibility</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ProgressRing score={stats?.latestAtsScore || 0} color="#6366F1" size={140} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 30, color: '#6366F1' }}>{stats?.latestAtsScore || 0}%</div>
              <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)' }}>ATS Score</div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            {stats?.latestAtsScore >= 80 ? (
              <div style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontSize: 13, fontWeight: 600, display: 'inline-block' }}>Excellent 🎉</div>
            ) : stats?.latestAtsScore >= 60 ? (
              <div style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontSize: 13, fontWeight: 600, display: 'inline-block' }}>Good - Improve it</div>
            ) : stats?.latestAtsScore > 0 ? (
              <div style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 13, fontWeight: 600, display: 'inline-block' }}>Needs Work</div>
            ) : (
              <div style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', color: '#6366F1', fontSize: 13, fontWeight: 600, display: 'inline-block' }}>Upload Resume</div>
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass" style={{ padding: 28, borderRadius: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickActions.map((a, i) => (
              <Link key={i} to={a.path} style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{
                  padding: 16, borderRadius: 14,
                  background: a.bg, border: `1px solid ${a.color}30`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
                  cursor: 'pointer',
                }}>
                  <a.icon size={22} color={a.color} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: a.color }}>{a.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass" style={{ padding: 28, borderRadius: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Recent Activity</h3>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array(4).fill(0).map((_, i) => <div key={i} className="shimmer" style={{ height: 44, borderRadius: 10 }} />)}
            </div>
          ) : data?.recentActivity?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.recentActivity.slice(0, 5).map((act, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: typeColors[act.type] || '#6366F1', flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.title}</p>
                    <p style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', marginTop: 2 }}>
                      {new Date(act.date).toLocaleDateString()}
                    </p>
                  </div>
                  {act.score && <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1' }}>{act.score}%</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(248,250,252,0.3)' }}>
              <Clock size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
              <p style={{ fontSize: 13 }}>No activity yet. Start by analyzing your resume!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
