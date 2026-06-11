import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentSkills: [String],
  targetRole: { type: String, required: true },
  timeframe: { type: String, default: '6 months' },
  roadmap: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);
