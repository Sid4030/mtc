import express from 'express';
import Progress from '../models/Progress.js';
import Session from '../models/Session.js';
import Participant from '../models/Participant.js';
import { verifyMsLearnBadge } from '../services/msLearn.js';

const router = express.Router();

// Get sessions info
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a badge
router.post('/submit-badge', async (req, res) => {
  try {
    const { name, email, sessionId, moduleId, badgeUrl } = req.body;

    if (!email || !sessionId || !moduleId || !badgeUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Find the session and module to know the expected badge title
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const module = session.modules.find(m => m.moduleId === moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found in this session" });
    }

    // 2. Check if already verified
    const existingProgress = await Progress.findOne({ email, sessionId, moduleId });
    if (existingProgress && existingProgress.verified) {
      return res.status(400).json({ message: "Module already verified" });
    }

    // 3. Call MS Learn API
    const verification = await verifyMsLearnBadge(badgeUrl);
    if (!verification.success) {
      return res.status(400).json({ error: "The URL might be wrong, please check again. This was verified by the MS Learn API to test." });
    }

    // 4. Compare titles (case insensitive)
    if (verification.title.toLowerCase() !== module.expectedBadgeTitle.toLowerCase()) {
      return res.status(400).json({ 
        error: "Badge title does not match the expected module. The URL might be wrong, please check again. This was verified by the MS Learn API to test."
      });
    }

    // 5. Save progress
    if (existingProgress) {
        existingProgress.verified = true;
        existingProgress.badgeUrl = badgeUrl;
        await existingProgress.save();
    } else {
        await Progress.create({
            email,
            sessionId,
            moduleId,
            badgeUrl,
            verified: true
        });
    }

    // 6. Upsert Participant
    if (name) {
      await Participant.findOneAndUpdate(
        { email },
        { name },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }

    res.json({ message: "Module verified successfully", title: verification.title });

  } catch (error) {
    console.error("Badge Submission Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get user progress
router.get('/progress/:email/:sessionId', async (req, res) => {
    try {
        const { email, sessionId } = req.params;
        const progress = await Progress.find({ email, sessionId });
        
        const session = await Session.findOne({ sessionId });
        if (!session) return res.status(404).json({ error: "Session not found" });

        const verifiedModules = progress.filter(p => p.verified).map(p => p.moduleId);
        const allModulesCompleted = session.modules.every(m => verifiedModules.includes(m.moduleId));

        res.json({
            session: session.sessionName,
            verifiedModules,
            allModulesCompleted,
            totalModules: session.modules.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
