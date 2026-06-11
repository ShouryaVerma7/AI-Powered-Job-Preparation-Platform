import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Code2, Users, Map, Clock, ChevronRight, BarChart2 } from 'lucide-react';
import { resumeAPI, interviewAPI, hrAPI, roadmapAPI } from '../services/api';

const tabs = [
  { id: 'resume', label: 'Resume Analyses', icon: FileText, color: '#6366F1' },
  { id: 'technical', label: 'Technical Interviews', icon: Code2, color: '#8B5CF6' },
  { id: 'hr', label: 'HR Interviews', icon: Users, color: '#06B6D4' },
  { id: 'roadmaps', label: 'Career Roadmaps', icon: Map, color: '#22C55E' },
];

function SkeletonCard() {
  return (
    <div className="shimmer" style={{ height: 80, borderRadius: 16, marginBottom: 10 }} />
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';
  const bg = score >= 80 ? 'rgba(34,197,94,0.12)' : score >= 60 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
  return (
    <div style={{
      padding: '4px 12px', borderRadius: 999,
      background: bg, color,
      border: `1px solid ${color}40`,
      fontSize: 13, fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      <BarChart2 size={12} /> {score}%
    </div>
  );
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('resume');
  const [data, setData] = useState({ resume: [], technical: [], hr: [], roadmaps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [resumeRes, techRes, hrRes, roadmapRes] = await Promise.all([
          resumeAPI.history(),
          interviewAPI.history(),
          hrAPI.history(),
          roadmapAPI.history(),
        ]);
        setData({
          resume: resumeRes.data || [],
          technical: techRes.data || [],
          hr: hrRes.data || [],
          roadmaps: roadmapRes.data || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const currentData = data[activeTab];
  const activeTabConfig = tabs.find(t => t.id === activeTab);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderItem = (item, index) => {
    const color = activeTabConfig.color;

    if (activeTab === 'resume') {
      return (
        <motion.div
          key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
          className="glass card-hover" style={{ padding: '18px 22px', borderRadius: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={18} color="#6366F1" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.fileName || 'Resume Analysis'}
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                <Clock size={11} /> {formatDate(item.createdAt)}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                {item.missingSkills?.length || 0} missing skills
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <ScoreBadge score={item.atsScore} />
            <ChevronRight size={16} color="rgba(248,250,252,0.3)" />
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'technical' || activeTab === 'hr') {
      return (
        <motion.div
          key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
          className="glass card-hover" style={{ padding: '18px 22px', borderRadius: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: `${color}15`, border: `1px solid ${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {activeTab === 'technical' ? <Code2 size={18} color={color} /> : <Users size={18} color={color} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{item.role}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                <Clock size={11} /> {formatDate(item.createdAt)}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>{item.experience}</span>
              <span style={{
                padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                background: `${color}12`, color, border: `1px solid ${color}25`,
              }}>
                {item.questions?.length || 0} questions
              </span>
            </div>
          </div>
          <ChevronRight size={16} color="rgba(248,250,252,0.3)" />
        </motion.div>
      );
    }

    if (activeTab === 'roadmaps') {
      return (
        <motion.div
          key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
          className="glass card-hover" style={{ padding: '18px 22px', borderRadius: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Map size={18} color="#22C55E" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{item.targetRole}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                <Clock size={11} /> {formatDate(item.createdAt)}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>{item.timeframe}</span>
              {item.currentSkills?.length > 0 && (
                <span style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                  {item.currentSkills.slice(0, 3).join(', ')}{item.currentSkills.length > 3 ? '...' : ''}
                </span>
              )}
            </div>
          </div>
          <ChevronRight size={16} color="rgba(248,250,252,0.3)" />
        </motion.div>
      );
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>History</h1>
        <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 15, marginBottom: 32 }}>
          All your past analyses, interview sessions, and generated roadmaps.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const count = data[tab.id]?.length || 0;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: isActive ? `${tab.color}18` : 'rgba(30,41,59,0.6)',
                color: isActive ? tab.color : 'rgba(248,250,252,0.55)',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                borderWidth: 1, borderStyle: 'solid',
                borderColor: isActive ? `${tab.color}35` : 'rgba(99,102,241,0.1)',
                transition: 'all 0.2s',
              }}
            >
              <tab.icon size={15} />
              {tab.label}
              <span style={{
                padding: '1px 8px', borderRadius: 999,
                background: isActive ? `${tab.color}25` : 'rgba(99,102,241,0.08)',
                fontSize: 11, fontWeight: 700,
                color: isActive ? tab.color : 'rgba(248,250,252,0.4)',
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div>{Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : currentData.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass"
          style={{ padding: 64, borderRadius: 24, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
            background: `${activeTabConfig.color}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <activeTabConfig.icon size={32} color={activeTabConfig.color} style={{ opacity: 0.5 }} />
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No {activeTabConfig.label} yet</h3>
          <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.4)' }}>
            Your {activeTabConfig.label.toLowerCase()} will appear here once you create them.
          </p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {currentData.map((item, index) => renderItem(item, index))}
        </motion.div>
      )}
    </div>
  );
}
