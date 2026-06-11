import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Map, ChevronDown, ChevronUp, ExternalLink, Clock, Target, BookOpen, Zap, RefreshCw, CheckCircle } from 'lucide-react';
import { roadmapAPI } from '../services/api';

const phaseColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E'];

const resourceTypeIcon = { Course: '🎓', Book: '📚', Project: '💻', Practice: '🏋️' };

const timeframes = ['3 months', '6 months', '9 months', '12 months'];
const commonRoles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Cloud Architect', 'Mobile Developer', 'UI/UX Designer', 'Blockchain Developer', 'Cybersecurity Analyst'];

function PhaseCard({ phase, index, color }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
      className="glass" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '20px 24px', cursor: 'pointer',
          display: 'flex', gap: 16, alignItems: 'center',
          background: open ? `${color}10` : 'transparent',
          borderBottom: open ? `1px solid ${color}20` : 'none',
          transition: 'background 0.3s',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${color}20`, border: `2px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Space Grotesk', fontWeight: 800, color, fontSize: 16,
        }}>
          {phase.phase}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: '#F8FAFC', marginBottom: 4 }}>{phase.title}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(248,250,252,0.5)' }}>
              <Clock size={12} /> {phase.duration}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: color }}>
              <BookOpen size={12} /> {phase.resources?.length || 0} resources
            </span>
          </div>
        </div>
        {open ? <ChevronUp size={18} color="rgba(248,250,252,0.4)" /> : <ChevronDown size={18} color="rgba(248,250,252,0.4)" />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Goals */}
              {phase.goals?.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, letterSpacing: 0.5 }}>🎯 GOALS</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {phase.goals.map((g, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <CheckCircle size={14} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.8)', lineHeight: 1.5 }}>{g}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {phase.skills?.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, letterSpacing: 0.5 }}>🛠️ SKILLS TO LEARN</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {phase.skills.map((skill, i) => (
                      <span key={i} style={{
                        padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                        background: `${color}15`, color, border: `1px solid ${color}30`,
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {phase.resources?.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, letterSpacing: 0.5 }}>📚 RESOURCES</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {phase.resources.map((r, i) => (
                      <div key={i} style={{
                        padding: '12px 16px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <span style={{ fontSize: 18 }}>{resourceTypeIcon[r.type] || '📌'}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC', marginBottom: 2 }}>{r.title}</p>
                          <span style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)' }}>{r.type}</span>
                        </div>
                        {r.url && r.url !== 'https://example.com' && (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: color, opacity: 0.7 }}
                            onClick={e => e.stopPropagation()}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {phase.milestones?.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, letterSpacing: 0.5 }}>🏁 MILESTONES</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {phase.milestones.map((m, i) => (
                      <div key={i} style={{
                        padding: '10px 14px', borderRadius: 10,
                        background: `${color}08`, border: `1px solid ${color}20`,
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                      }}>
                        <span style={{ color, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>✓</span>
                        <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.8)' }}>{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  const onSubmit = async (data) => {
    if (skills.length === 0) return toast.error('Please add at least one current skill');
    setLoading(true);
    try {
      const res = await roadmapAPI.generate({ ...data, currentSkills: skills });
      setRoadmap(res.data);
      toast.success('Career roadmap generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const roadmapData = roadmap?.roadmap;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>AI Career Roadmap</h1>
        <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 15, marginBottom: 32 }}>
          Get a personalized step-by-step career roadmap with resources, milestones, and a weekly plan.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass" style={{ padding: 28, borderRadius: 24, marginBottom: 28 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Skills */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>
              Current Skills <span style={{ color: 'rgba(248,250,252,0.4)', fontWeight: 400 }}>(press Enter to add)</span>
            </label>
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              placeholder="e.g. HTML, CSS, JavaScript..."
              className="input-field"
              style={{ marginBottom: skills.length > 0 ? 12 : 0 }}
            />
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((skill, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 999,
                    background: 'rgba(99,102,241,0.15)', color: '#6366F1',
                    border: '1px solid rgba(99,102,241,0.3)', fontSize: 12, fontWeight: 500,
                  }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: '#6366F1', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Target Role</label>
              <select {...register('targetRole', { required: 'Target role is required' })} className="input-field" style={{ cursor: 'pointer' }}>
                <option value="">Select target role...</option>
                {commonRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.targetRole && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors.targetRole.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Timeframe</label>
              <select {...register('timeframe')} className="input-field" style={{ cursor: 'pointer' }}>
                {timeframes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary" disabled={loading || skills.length === 0} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 15 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
              ) : (
                <><Map size={16} /> Generate Roadmap</>
              )}
            </button>
            {roadmap && (
              <button type="button" onClick={() => { setRoadmap(null); setSkills([]); }} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={15} /> New Roadmap
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: 48, borderRadius: 24, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, marginBottom: 8 }}>AI is building your roadmap...</p>
          <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)' }}>Crafting phases, selecting resources, and planning your journey</p>
        </motion.div>
      )}

      {/* Roadmap Results */}
      <AnimatePresence>
        {roadmapData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Summary header */}
            <div className="glass" style={{
              padding: 28, borderRadius: 24, marginBottom: 24,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
                    🗺️ Your Roadmap to {roadmap.targetRole}
                  </h2>
                  <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.65)', lineHeight: 1.6 }}>{roadmapData.summary}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Timeframe', value: roadmap.timeframe, icon: Clock, color: '#6366F1' },
                  { label: 'Phases', value: `${roadmapData.phases?.length || 0} phases`, icon: Target, color: '#8B5CF6' },
                  { label: 'Daily', value: `${roadmapData.weeklyPlan?.hoursPerDay || 2}h/day`, icon: Zap, color: '#06B6D4' },
                  { label: 'Salary Range', value: roadmapData.estimatedSalaryRange || 'Varies', icon: Map, color: '#22C55E' },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: `${s.color}12`, border: `1px solid ${s.color}25`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <s.icon size={14} color={s.color} />
                      <span style={{ fontSize: 11, color: 'rgba(248,250,252,0.5)', fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key skills */}
            {roadmapData.keySkillsToLearn?.length > 0 && (
              <div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6', marginBottom: 12 }}>🔑 KEY SKILLS TO MASTER</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {roadmapData.keySkillsToLearn.map((skill, i) => (
                    <span key={i} style={{
                      padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                      background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)',
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly plan */}
            {roadmapData.weeklyPlan?.breakdown?.length > 0 && (
              <div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#06B6D4', marginBottom: 12 }}>📅 DAILY STUDY PLAN ({roadmapData.weeklyPlan.hoursPerDay}h/day)</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  {roadmapData.weeklyPlan.breakdown.map((activity, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
                      display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                      <span style={{ color: '#06B6D4', fontWeight: 700, fontSize: 12 }}>·</span>
                      <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.8)' }}>{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phases */}
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 19, marginBottom: 16 }}>Learning Phases</h3>
            {roadmapData.phases?.map((phase, i) => (
              <PhaseCard key={i} phase={phase} index={i} color={phaseColors[i % phaseColors.length]} />
            ))}

            {/* Job titles */}
            {roadmapData.jobTitles?.length > 0 && (
              <div className="glass" style={{ padding: 24, borderRadius: 20, marginTop: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#22C55E', marginBottom: 12 }}>💼 POSSIBLE JOB TITLES</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {roadmapData.jobTitles.map((title, i) => (
                    <span key={i} style={{
                      padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                      background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)',
                    }}>{title}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
