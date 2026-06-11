import InterviewSession from '../models/InterviewSession.js';
import { generateHRInterviewQA } from '../services/aiService.js';

export const generateHR = async (req, res) => {
  try {
    const { role, experience } = req.body;
    if (!role || !experience) return res.status(400).json({ message: 'Role and experience are required' });

    const result = await generateHRInterviewQA(role, experience);

    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      experience,
      type: 'hr',
      questions: result.questions || [],
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHRHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id, type: 'hr' })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
