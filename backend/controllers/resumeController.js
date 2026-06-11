import fs from 'fs';
import pdfParse from 'pdf-parse';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { analyzeResumeWithAI } from '../services/aiService.js';

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No PDF file uploaded' });

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50)
      return res.status(400).json({ message: 'Could not extract text from PDF. Please ensure it is a text-based PDF.' });

    const analysis = await analyzeResumeWithAI(resumeText);

    const saved = await ResumeAnalysis.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      atsScore: analysis.atsScore || 0,
      overallScore: analysis.overallScore || 0,
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      missingSkills: analysis.missingSkills || [],
      suggestions: analysis.suggestions || [],
      keywords: analysis.keywords || [],
      rawText: resumeText.substring(0, 2000),
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json(saved);
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
