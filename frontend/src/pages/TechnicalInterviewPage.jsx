import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Code2, ChevronDown, ChevronUp, Copy, Check, Zap, RefreshCw } from 'lucide-react';
import { interviewAPI } from '../services/api';

const difficultyConfig = {
  Easy: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E', border: 'rgba(34,197,94,0.3)' },
  Medium: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  Hard: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
};

const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'Machine Learning Engineer', 'Cloud Architect', 'QA Engineer', 'Product Manager'];
const levels = ['0-1 years (Fresher)', '1-3 years (Junior)', '3-5 years (Mid-level)', '5-8 years (Senior)', '8+ years (Lead/Principal)'];

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = difficultyConfig[q.difficulty] || difficultyConfig.Medium;

  const copy = () => {
    navigator.clipboard.writeText(`Q: ${q.question}\n\nA: ${q.answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="glass card-hover" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: '18px 22px', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'flex-start' }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#6366F1', fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            }}>{q.difficulty}</span>
            {q.category && (
              <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'rgba(99,102,241,0.1)', color: 'rgba(248,250,252,0.6)', border: '1px solid rgba(99,102,241,0.15)' }}>
                {q.category}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC', lineHeight: 1.5 }}>{q.question}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={(e) => { e.stopPropagation(); copy(); }} style={{
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8, padding: '6px 10px', color: copied ? '#22C55E' : '#6366F1',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {open ? <ChevronUp size={18} color="rgba(248,250,252,0.4)" /> : <ChevronDown size={18} color="rgba(248,250,252,0.4)" />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '16px 22px 20px', margin: '0 22px 20px',
              background: 'rgba(99,102,241,0.06)', borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.12)',
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', marginBottom: 8 }}>SAMPLE ANSWER</p>
              <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.8)', lineHeight: 1.7 }}>{q.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TechnicalInterviewPage() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await interviewAPI.generate(data);
      setSession(res.data);
      toast.success(`Generated ${res.data.questions?.length || 0} technical questions!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>Technical Interview Prep</h1>
        <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 15, marginBottom: 32 }}>
          Generate role-specific technical questions with detailed answers, difficulty tags, and categories.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass" style={{ padding: 28, borderRadius: 24, marginBottom: 28 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Job Role</label>
              <select {...register('role', { required: 'Role is required' })} className="input-field" style={{ cursor: 'pointer' }}>
                <option value="">Select a role...</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors.role.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Experience Level</label>
              <select {...register('experience', { required: 'Experience is required' })} className="input-field" style={{ cursor: 'pointer' }}>
                <option value="">Select experience...</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.experience && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors.experience.message}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 15 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
              ) : (
                <><Zap size={16} /> Generate Questions</>
              )}
            </button>
            {session && (
              <button type="button" onClick={() => setSession(null)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={15} /> New Session
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {session && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
                  {session.role} Questions
                </h2>
                <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13 }}>
                  {session.questions?.length} questions • {session.experience}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Easy', 'Medium', 'Hard'].map(d => {
                  const count = session.questions?.filter(q => q.difficulty === d).length || 0;
                  const cfg = difficultyConfig[d];
                  return count > 0 ? (
                    <span key={d} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {count} {d}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            {session.questions?.map((q, i) => <QuestionCard key={i} q={q} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: 40, borderRadius: 24, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, marginBottom: 8 }}>AI is crafting your questions...</p>
          <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)' }}>Generating role-specific technical questions with detailed answers</p>
        </motion.div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
