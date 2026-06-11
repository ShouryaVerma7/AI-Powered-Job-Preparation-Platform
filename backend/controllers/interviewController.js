import InterviewSession from '../models/InterviewSession.js';
import { generateTechnicalInterviewQA } from '../services/aiService.js';

export const generateInterview = async (req, res) => {
  try {
    const { role, experience } = req.body;
    if (!role || !experience) return res.status(400).json({ message: 'Role and experience are required' });

    const result = await generateTechnicalInterviewQA(role, experience);

    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      experience,
      type: 'technical',
      questions: result.questions || [],
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id, type: 'technical' })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
