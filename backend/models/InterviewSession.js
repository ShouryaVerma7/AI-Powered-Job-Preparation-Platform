import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  category: String,
});

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  type: { type: String, enum: ['technical', 'hr'], default: 'technical' },
  questions: [questionSchema],
}, { timestamps: true });

export default mongoose.model('InterviewSession', interviewSessionSchema);
