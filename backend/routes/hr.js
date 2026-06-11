import express from 'express';
import { generateHR, getHRHistory } from '../controllers/hrController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/generate', protect, generateHR);
router.get('/history', protect, getHRHistory);
export default router;
