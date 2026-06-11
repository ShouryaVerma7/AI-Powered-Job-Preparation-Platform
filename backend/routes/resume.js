import express from 'express';
import { analyzeResume, getResumeHistory, getResumeById } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getResumeHistory);
router.get('/:id', protect, getResumeById);
export default router;
