import express from 'express';
import Participant from '../models/Participant.js';
import Progress from '../models/Progress.js';
import ProjectSubmission from '../models/ProjectSubmission.js';

const router = express.Router();

let cachedLeaderboard = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5000; // 5 seconds cache

router.get('/leaderboard', async (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached data if within TTL
    if (cachedLeaderboard && (now - lastFetchTime < CACHE_TTL_MS)) {
      return res.json(cachedLeaderboard);
    }

    // Fetch fresh data from DB
    const participants = await Participant.find({});
    const progress = await Progress.find({ verified: true });
    const submissions = await ProjectSubmission.find({ marks: { $ne: null } });

    const leaderboard = participants.map(p => {
      // 5 marks per verified module
      const userProgress = progress.filter(pr => pr.email === p.email);
      const moduleMarks = userProgress.length * 5;
      
      // Add graded project marks
      const userSubmissions = submissions.filter(sub => sub.email === p.email);
      const projectMarks = userSubmissions.reduce((sum, sub) => sum + (sub.marks || 0), 0);

      const totalMarks = moduleMarks + projectMarks;
      const verifiedCount = userProgress.length;
      const completedCount = userSubmissions.length;

      return {
        email: p.email,
        name: p.name,
        totalMarks,
        verifiedCount,
        completedCount
      };
    });

    // Sort descending by marks, then completed projects
    leaderboard.sort((a, b) => b.totalMarks - a.totalMarks || b.completedCount - a.completedCount);

    // Update cache
    cachedLeaderboard = leaderboard;
    lastFetchTime = now;

    res.json(leaderboard);
  } catch (error) {
    console.error("Public Leaderboard Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
