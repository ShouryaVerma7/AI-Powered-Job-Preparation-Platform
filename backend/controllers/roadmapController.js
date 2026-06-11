import Roadmap from '../models/Roadmap.js';
import { generateCareerRoadmap } from '../services/aiService.js';

export const generateRoadmap = async (req, res) => {
  try {
    const { currentSkills, targetRole, timeframe } = req.body;
    if (!currentSkills || !targetRole) return res.status(400).json({ message: 'Current skills and target role are required' });

    const result = await generateCareerRoadmap(
      Array.isArray(currentSkills) ? currentSkills : currentSkills.split(',').map(s => s.trim()),
      targetRole,
      timeframe || '6 months'
    );

    const roadmap = await Roadmap.create({
      userId: req.user._id,
      currentSkills: Array.isArray(currentSkills) ? currentSkills : currentSkills.split(',').map(s => s.trim()),
      targetRole,
      timeframe: timeframe || '6 months',
      roadmap: result,
    });

    res.status(201).json(roadmap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRoadmapHistory = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user._id });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
