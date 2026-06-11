import ResumeAnalysis from '../models/ResumeAnalysis.js';
import InterviewSession from '../models/InterviewSession.js';
import Roadmap from '../models/Roadmap.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [resumeAnalyses, technicalSessions, hrSessions, roadmaps] = await Promise.all([
      ResumeAnalysis.find({ userId }).sort({ createdAt: -1 }),
      InterviewSession.find({ userId, type: 'technical' }).sort({ createdAt: -1 }),
      InterviewSession.find({ userId, type: 'hr' }).sort({ createdAt: -1 }),
      Roadmap.find({ userId }).sort({ createdAt: -1 }),
    ]);

    const latestResume = resumeAnalyses[0];
    const avgAtsScore = resumeAnalyses.length
      ? Math.round(resumeAnalyses.reduce((sum, r) => sum + r.atsScore, 0) / resumeAnalyses.length)
      : 0;

    // Score trend for chart (last 7 analyses)
    const scoreTrend = resumeAnalyses.slice(0, 7).reverse().map((r, i) => ({
      name: `Analysis ${i + 1}`,
      atsScore: r.atsScore,
      overallScore: r.overallScore,
    }));

    // Activity for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentActivity = [
      ...resumeAnalyses.filter(r => r.createdAt > thirtyDaysAgo).map(r => ({
        type: 'resume', title: 'Resume Analyzed', score: r.atsScore, date: r.createdAt, id: r._id
      })),
      ...technicalSessions.filter(s => s.createdAt > thirtyDaysAgo).map(s => ({
        type: 'technical', title: `Technical Interview: ${s.role}`, date: s.createdAt, id: s._id
      })),
      ...hrSessions.filter(s => s.createdAt > thirtyDaysAgo).map(s => ({
        type: 'hr', title: `HR Interview: ${s.role}`, date: s.createdAt, id: s._id
      })),
      ...roadmaps.filter(r => r.createdAt > thirtyDaysAgo).map(r => ({
        type: 'roadmap', title: `Roadmap: ${r.targetRole}`, date: r.createdAt, id: r._id
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    res.json({
      stats: {
        totalResumes: resumeAnalyses.length,
        totalTechnical: technicalSessions.length,
        totalHR: hrSessions.length,
        totalRoadmaps: roadmaps.length,
        avgAtsScore,
        latestAtsScore: latestResume?.atsScore || 0,
        latestOverallScore: latestResume?.overallScore || 0,
      },
      latestResume,
      scoreTrend,
      recentActivity,
      roadmaps: roadmaps.slice(0, 3),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
