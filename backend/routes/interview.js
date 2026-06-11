// routes/interview.js
import express from 'express';
import { generateInterview, getInterviewHistory, getInterviewById } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/generate', protect, generateInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);
export default router;
