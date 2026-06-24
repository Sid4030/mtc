import express from 'express';
import ProjectSubmission from '../models/ProjectSubmission.js';
import Progress from '../models/Progress.js';
import Session from '../models/Session.js';
import Participant from '../models/Participant.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
    try {
        const { name, email, sessionId, projectUrl } = req.body;

        if (!email || !sessionId || !projectUrl) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if session exists
        const session = await Session.findOne({ sessionId });
        if (!session) return res.status(404).json({ error: "Session not found" });

        // Save submission
        const existingSubmission = await ProjectSubmission.findOne({ email, sessionId });
        if (existingSubmission) {
            existingSubmission.projectUrl = projectUrl;
            existingSubmission.status = 'PENDING';
            existingSubmission.submittedAt = new Date();
            await existingSubmission.save();
        } else {
            await ProjectSubmission.create({ email, sessionId, projectUrl });
        }

        // Upsert Participant
        if (name) {
          await Participant.findOneAndUpdate(
            { email },
            { name },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
          );
        }

        res.json({ message: "Final project submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
