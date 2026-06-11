import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, default: 'resume.pdf' },
  atsScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  strengths: [String],
  weaknesses: [String],
  missingSkills: [String],
  suggestions: [String],
  keywords: [String],
  rawText: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
