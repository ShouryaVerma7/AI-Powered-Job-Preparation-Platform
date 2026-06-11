import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Lightbulb, X, Star, TrendingUp, RefreshCw } from 'lucide-react';
import { resumeAPI } from '../services/api';

function ProgressRing({ score, color, size = 120, label }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 28, color }}>{score}</div>
          <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', lineHeight: 1 }}>/ 100</div>
        </div>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginTop: 8 }}>{label}</p>
    </div>
  );
}

const ScoreColor = (score) => score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';

function TagList({ items, color, bg }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items?.map((item, i) => (
        <span key={i} style={{
          padding: '5px 12px', borderRadius: 999,
          background: bg, color, border: `1px solid ${color}40`,
          fontSize: 12, fontWeight: 500,
        }}>{item}</span>
      ))}
    </div>
  );
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback(accepted => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024,
    onDropRejected: () => toast.error('Please upload a PDF file under 5MB'),
  });

  const analyze = async () => {
    if (!file) return toast.error('Please upload a resume first');
    setLoading(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const res = await resumeAPI.analyze(fd);
      setResult(res.data);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>Resume Analyzer</h1>
        <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 15, marginBottom: 32 }}>
          Upload your resume and get AI-powered ATS score, skill gap analysis, and improvement suggestions.
        </p>
      </motion.div>

      {!result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Dropzone */}
          <div {...getRootProps()} className="glass" style={{
            padding: 60, borderRadius: 24, textAlign: 'center', cursor: 'pointer',
            border: `2px dashed ${isDragActive ? '#6366F1' : file ? '#22C55E' : 'rgba(99,102,241,0.3)'}`,
            background: isDragActive ? 'rgba(99,102,241,0.08)' : file ? 'rgba(34,197,94,0.05)' : 'rgba(30,41,59,0.4)',
            transition: 'all 0.3s', marginBottom: 20,
          }}>
            <input {...getInputProps()} />
            <div style={{
              width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
              background: file ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {file ? <FileText size={32} color="#22C55E" /> : <Upload size={32} color="#6366F1" />}
            </div>
            {file ? (
              <>
                <p style={{ fontWeight: 700, fontSize: 17, color: '#22C55E', marginBottom: 6 }}>{file.name}</p>
                <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: 13 }}>{(file.size / 1024).toFixed(1)} KB • Click to replace</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume PDF'}
                </p>
                <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: 14 }}>or click to browse • PDF only • Max 5MB</p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={analyze} className="btn-primary" disabled={!file || loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', fontSize: 15 }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analyzing with AI...
                </>
              ) : (
                <><Star size={16} /> Analyze Resume</>
              )}
            </button>
            {file && (
              <button onClick={reset} className="btn-secondary" style={{ padding: '14px 20px' }}>
                <X size={18} />
              </button>
            )}
          </div>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass"
              style={{ marginTop: 20, padding: 24, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
              <p style={{ fontWeight: 600, marginBottom: 6 }}>AI is analyzing your resume...</p>
              <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)' }}>Checking ATS compatibility, skills, and generating insights</p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Score overview */}
          <div className="glass" style={{
            padding: 32, borderRadius: 24, marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Analysis Complete ✨</h2>
                <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 14 }}>{result.fileName}</p>
              </div>
              <button onClick={reset} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: 13 }}>
                <RefreshCw size={14} /> Analyze Another
              </button>
            </div>
            <div style={{ display: 'flex', gap: 40, marginTop: 28, flexWrap: 'wrap' }}>
              <ProgressRing score={result.atsScore} color={ScoreColor(result.atsScore)} label="ATS Score" />
              <ProgressRing score={result.overallScore} color={ScoreColor(result.overallScore)} label="Overall Score" />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ marginBottom: 12 }}>
                  {result.atsScore >= 80 ? (
                    <div style={{ padding: '8px 16px', background: 'rgba(34,197,94,0.15)', borderRadius: 10, color: '#22C55E', fontSize: 14, fontWeight: 600, display: 'inline-block' }}>
                      🎉 Excellent ATS compatibility
                    </div>
                  ) : result.atsScore >= 60 ? (
                    <div style={{ padding: '8px 16px', background: 'rgba(245,158,11,0.15)', borderRadius: 10, color: '#F59E0B', fontSize: 14, fontWeight: 600, display: 'inline-block' }}>
                      ⚡ Good, but can improve
                    </div>
                  ) : (
                    <div style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.15)', borderRadius: 10, color: '#EF4444', fontSize: 14, fontWeight: 600, display: 'inline-block' }}>
                      🔧 Needs significant work
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.55)', lineHeight: 1.6 }}>
                  Your resume has been analyzed against ATS systems. Review the sections below for detailed feedback.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Strengths */}
            <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <CheckCircle size={20} color="#22C55E" />
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17 }}>Strengths</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.strengths?.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.75)', lineHeight: 1.5 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <AlertCircle size={20} color="#EF4444" />
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17 }}>Weaknesses</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.weaknesses?.map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.75)', lineHeight: 1.5 }}>{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Skills */}
          <div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <TrendingUp size={20} color="#F59E0B" />
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17 }}>Missing Skills</h3>
            </div>
            <TagList items={result.missingSkills} color="#F59E0B" bg="rgba(245,158,11,0.1)" />
          </div>

          {/* Keywords */}
          <div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Star size={20} color="#06B6D4" />
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17 }}>Detected Keywords</h3>
            </div>
            <TagList items={result.keywords} color="#06B6D4" bg="rgba(6,182,212,0.1)" />
          </div>

          {/* Suggestions */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Lightbulb size={20} color="#8B5CF6" />
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17 }}>AI Suggestions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {result.suggestions?.map((s, i) => (
                <div key={i} style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <span style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</span>
                  <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.8)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
