import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, FileText, Code2, Users, Map, Star, ChevronDown, ChevronUp,
  ArrowRight, Check, TrendingUp, Target, Brain, Shield, BarChart2
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };
const stagger = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { staggerChildren: 0.1 } };
const staggerChild = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { icon: FileText, title: 'AI Resume Analyzer', desc: 'Get ATS scores, identify missing keywords, and receive actionable improvement suggestions instantly.', color: '#6366F1' },
  { icon: Code2, title: 'Technical Interview Prep', desc: 'AI-generated role-specific technical questions with detailed answers and difficulty ratings.', color: '#8B5CF6' },
  { icon: Users, title: 'HR Interview Coach', desc: 'Master behavioral questions with STAR-method answers and insider tips from top recruiters.', color: '#06B6D4' },
  { icon: Map, title: 'Career Roadmap Generator', desc: 'Personalized learning paths with weekly plans, resources, and milestones to reach your dream role.', color: '#22C55E' },
  { icon: BarChart2, title: 'Progress Analytics', desc: 'Track your improvement over time with detailed charts and activity history.', color: '#F59E0B' },
  { icon: Brain, title: 'AI-Powered Insights', desc: 'Powered by Llama 3 and DeepSeek for state-of-the-art career guidance.', color: '#EF4444' },
];

const stats = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '95%', label: 'Interview Success Rate' },
  { value: '200+', label: 'Job Roles Covered' },
  { value: '4.9★', label: 'User Rating' },
];

const faqs = [
  { q: 'How does the AI resume analyzer work?', a: 'Upload your PDF resume and our AI extracts and analyzes the content, checking it against ATS criteria, identifying keyword gaps, and providing specific improvement suggestions.' },
  { q: 'What AI models power CareerPilot?', a: 'We use Llama 3 70B via Groq API for ultra-fast, high-quality AI responses across all features.' },
  { q: 'Is my resume data secure?', a: 'Yes. Uploaded files are processed and immediately deleted. We never store your actual resume content permanently.' },
  { q: 'Can I use this for any job role?', a: 'Absolutely. Our AI covers 200+ job roles across tech, finance, marketing, design, and more.' },
  { q: 'Is CareerPilot free to use?', a: 'Yes! Sign up for free and get access to all core features including resume analysis and interview preparation.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', text: 'CareerPilot helped me identify gaps in my resume and prepare for the technical rounds. Got my dream job in 6 weeks!', rating: 5 },
  { name: 'Rahul Verma', role: 'Product Manager at Flipkart', text: 'The HR interview prep is incredibly detailed. The STAR-method answers are exactly what interviewers want to hear.', rating: 5 },
  { name: 'Ananya Patel', role: 'Data Scientist at Amazon', text: 'The career roadmap feature gave me a clear 6-month plan to transition into data science. Highly recommended!', rating: 5 },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#0F172A', color: '#F8FAFC', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18 }}>CareerPilot AI</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" style={{
            color: 'rgba(248,250,252,0.7)', textDecoration: 'none',
            padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            border: '1px solid rgba(99,102,241,0.2)', transition: 'all 0.2s',
          }}>Login</Link>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 18px', fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="animated-gradient" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Floating orbs */}
        {[
          { size: 400, color: 'rgba(99,102,241,0.12)', top: '10%', left: '5%', delay: 0 },
          { size: 300, color: 'rgba(139,92,246,0.1)', top: '60%', right: '5%', delay: 2 },
          { size: 200, color: 'rgba(6,182,212,0.08)', top: '30%', right: '20%', delay: 4 },
        ].map((orb, i) => (
          <div key={i} className="float-slow" style={{
            position: 'absolute', width: orb.size, height: orb.size,
            borderRadius: '50%', background: `radial-gradient(circle, ${orb.color}, transparent)`,
            top: orb.top, left: orb.left, right: orb.right,
            animationDelay: `${orb.delay}s`, pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999, marginBottom: 32,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
              fontSize: 13, color: '#8B5CF6', fontWeight: 600,
            }}
          >
            <Zap size={12} /> AI-Powered Career Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, fontFamily: 'Space Grotesk' }}
          >
            Land Your Dream Job{' '}
            <span className="gradient-text">Faster with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 20, color: 'rgba(248,250,252,0.65)', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}
          >
            AI-powered resume analysis, interview preparation, ATS optimization, and personalized learning roadmaps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: 16 }}>
              Sign In
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 64, flexWrap: 'wrap' }}
          >
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 28, color: '#6366F1' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.5)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: '#6366F1', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>EVERYTHING YOU NEED</p>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, marginBottom: 16 }}>
            Your Complete Career Toolkit
          </h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            From resume to offer letter, CareerPilot has every tool you need to succeed.
          </p>
        </motion.div>

        <motion.div {...stagger} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div key={i} {...staggerChild} className="glass card-hover" style={{
              padding: 28, borderRadius: 20,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${f.color}20`, border: `1px solid ${f.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', background: 'rgba(30,41,59,0.3)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginBottom: 16 }}>
              How It Works
            </h2>
            <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: 17 }}>Get started in minutes, see results immediately</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              { step: '01', title: 'Create Your Account', desc: 'Sign up for free in under 30 seconds. No credit card required.', icon: Shield },
              { step: '02', title: 'Upload Your Resume', desc: 'Drop your PDF resume and let our AI extract and analyze every detail.', icon: FileText },
              { step: '03', title: 'Get AI Insights', desc: 'Receive your ATS score, skill gaps, improvement suggestions, and personalized roadmap.', icon: Brain },
              { step: '04', title: 'Prepare & Apply', desc: 'Practice with AI-generated interview questions and land your dream job.', icon: Target },
            ].map((step, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <step.icon size={22} color="#6366F1" />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6366F1', fontWeight: 700, marginBottom: 6 }}>{step.step}</div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: 15, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginBottom: 16 }}>
            Trusted by Job Seekers
          </h2>
        </motion.div>
        <motion.div {...stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} {...staggerChild} className="glass card-hover" style={{ padding: 28, borderRadius: 20 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} color="#F59E0B" fill="#F59E0B" />)}
              </div>
              <p style={{ color: 'rgba(248,250,252,0.75)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                <p style={{ color: '#6366F1', fontSize: 12, marginTop: 2 }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: 'rgba(30,41,59,0.2)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginBottom: 12 }}>
              Frequently Asked Questions
            </h2>
          </motion.div>
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
              style={{
                marginBottom: 12, borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(99,102,241,0.15)',
                background: openFaq === i ? 'rgba(99,102,241,0.08)' : 'rgba(30,41,59,0.4)',
                transition: 'background 0.2s',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                  color: '#F8FAFC', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 15, fontWeight: 600, fontFamily: 'Inter',
                }}
              >
                {faq.q}
                {openFaq === i ? <ChevronUp size={18} color="#6366F1" /> : <ChevronDown size={18} color="rgba(248,250,252,0.4)" />}
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  style={{ padding: '0 24px 20px', color: 'rgba(248,250,252,0.65)', fontSize: 14, lineHeight: 1.7 }}
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <motion.div {...fadeUp} className="glass" style={{
          maxWidth: 700, margin: '0 auto', padding: 60, borderRadius: 28,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.3)',
        }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
            Ready to Launch Your Career?
          </h2>
          <p style={{ color: 'rgba(248,250,252,0.65)', fontSize: 18, marginBottom: 36 }}>
            Join thousands of job seekers who landed their dream roles with CareerPilot AI.
          </p>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 40px', fontSize: 17, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start for Free <ArrowRight size={18} />
          </Link>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(248,250,252,0.4)' }}>No credit card required</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(99,102,241,0.15)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={12} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15 }}>CareerPilot AI</span>
        </div>
        <p style={{ color: 'rgba(248,250,252,0.35)', fontSize: 13 }}>
          © 2025 CareerPilot AI. Built with ❤️ for ambitious job seekers.
        </p>
      </footer>
    </div>
  );
}
