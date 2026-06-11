import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Mail, Target, Code2, Save, Edit3, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, bio: user?.bio, targetRole: user?.targetRole },
  });

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ ...data, skills });
      updateUser(res.data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>Profile</h1>
        <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 15, marginBottom: 32 }}>
          Manage your account details and career preferences.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass" style={{ padding: 32, borderRadius: 24, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 800, color: 'white',
                fontFamily: 'Space Grotesk',
                boxShadow: '0 0 30px rgba(99,102,241,0.4)',
              }}>
                {initials}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: '#1E293B', border: '2px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Camera size={12} color="#6366F1" />
              </div>
            </div>

            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user?.name}</h2>
            <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13, marginBottom: 16 }}>{user?.email}</p>

            {user?.targetRole && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 999,
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                fontSize: 12, color: '#6366F1', fontWeight: 600, marginBottom: 16,
              }}>
                <Target size={11} /> {user.targetRole}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 16, marginTop: 4 }}>
              <p style={{ fontSize: 12, color: 'rgba(248,250,252,0.35)' }}>Member since {memberSince}</p>
            </div>
          </div>

          {/* Skills card */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Code2 size={16} color="#6366F1" />
              <p style={{ fontWeight: 700, fontSize: 14 }}>Skills</p>
            </div>
            {(user?.skills?.length > 0) ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {user.skills.map((s, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 999,
                    background: 'rgba(99,102,241,0.1)', color: '#6366F1',
                    border: '1px solid rgba(99,102,241,0.25)', fontSize: 12, fontWeight: 500,
                  }}>{s}</span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.35)' }}>No skills added yet. Edit your profile to add skills.</p>
            )}
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass" style={{ padding: 32, borderRadius: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18 }}>Account Details</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', fontSize: 13 }}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <button onClick={() => setEditing(false)} style={{
                  background: 'none', border: 'none', color: 'rgba(248,250,252,0.5)',
                  cursor: 'pointer', fontSize: 13, fontFamily: 'Inter',
                }}>Cancel</button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.35)' }} />
                      <input {...register('name', { required: 'Name is required' })} className="input-field" style={{ paddingLeft: 38 }} />
                    </div>
                    {errors.name && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.35)' }} />
                      <input value={user?.email} disabled className="input-field" style={{ paddingLeft: 38, opacity: 0.5, cursor: 'not-allowed' }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Target Role</label>
                  <div style={{ position: 'relative' }}>
                    <Target size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.35)' }} />
                    <input {...register('targetRole')} placeholder="e.g. Senior Frontend Developer" className="input-field" style={{ paddingLeft: 38 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>Bio</label>
                  <textarea {...register('bio')} rows={3} placeholder="Tell us about yourself..." className="input-field" style={{ resize: 'vertical', lineHeight: 1.6 }} />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(248,250,252,0.7)', marginBottom: 8 }}>
                    Skills <span style={{ color: 'rgba(248,250,252,0.4)', fontWeight: 400 }}>(press Enter to add)</span>
                  </label>
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="Add a skill..."
                    className="input-field"
                    style={{ marginBottom: skills.length > 0 ? 10 : 0 }}
                  />
                  {skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                      {skills.map((s, i) => (
                        <span key={i} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '4px 12px', borderRadius: 999,
                          background: 'rgba(99,102,241,0.12)', color: '#6366F1',
                          border: '1px solid rgba(99,102,241,0.25)', fontSize: 12, fontWeight: 500,
                        }}>
                          {s}
                          <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#6366F1', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {loading ? (
                    <><div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving...</>
                  ) : (
                    <><Save size={15} /> Save Changes</>
                  )}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Full Name', value: user?.name, icon: User },
                  { label: 'Email Address', value: user?.email, icon: Mail },
                  { label: 'Target Role', value: user?.targetRole || 'Not set', icon: Target },
                ].map((field, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(99,102,241,0.1)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <field.icon size={16} color="#6366F1" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', fontWeight: 600, marginBottom: 3 }}>{field.label}</p>
                      <p style={{ fontSize: 15, fontWeight: 500, color: field.value === 'Not set' ? 'rgba(248,250,252,0.3)' : '#F8FAFC' }}>{field.value}</p>
                    </div>
                  </div>
                ))}

                {user?.bio && (
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', fontWeight: 600, marginBottom: 8 }}>BIO</p>
                    <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.75)', lineHeight: 1.7 }}>{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
