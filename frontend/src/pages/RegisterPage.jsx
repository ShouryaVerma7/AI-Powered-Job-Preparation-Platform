import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const perks = ['Free resume analysis', 'AI interview prep', 'Career roadmaps', 'Progress tracking'];

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authRegister(data.name, data.email, data.password);
      toast.success('Account created! Welcome to CareerPilot!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0F172A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div className="float-slow" style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
        top: '-10%', right: '-10%', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: '#F8FAFC' }}>CareerPilot AI</span>
            </div>
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: '#F8FAFC', marginTop: 24, marginBottom: 8 }}>
            Start your journey
          </h1>
          <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 15 }}>Create your free account</p>
        </div>

        {/* Perks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {perks.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              fontSize: 12, color: '#22C55E', fontWeight: 500,
            }}>
              <Check size={11} /> {p}
            </div>
          ))}
        </div>

        <div className="glass" style={{ padding: 36, borderRadius: 24 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe', rules: { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } } },
              { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com', rules: { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } } },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <field.icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.4)' }} />
                  <input {...register(field.name, field.rules)} type={field.type} placeholder={field.placeholder} className="input-field" style={{ paddingLeft: 42 }} />
                </div>
                {errors[field.name] && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors[field.name].message}</p>}
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.4)' }} />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="input-field"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(248,250,252,0.4)', cursor: 'pointer',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating Account...</>
              ) : (
                <>Create Free Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(248,250,252,0.5)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
