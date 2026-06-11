import express from 'express';
import { generateRoadmap, getRoadmapHistory, getRoadmapById } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/generate', protect, generateRoadmap);
router.get('/history', protect, getRoadmapHistory);
router.get('/:id', protect, getRoadmapById);
export default router;
