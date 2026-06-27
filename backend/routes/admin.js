import express from 'express';
import Participant from '../models/Participant.js';
import Progress from '../models/Progress.js';
import ProjectSubmission from '../models/ProjectSubmission.js';
import Session from '../models/Session.js';
import Registration from '../models/Registration.js';
import { sendBadgeEmail } from '../utils/email.js';

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
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

      let earliestSubmission = Infinity;
      if (userSubmissions.length > 0) {
        earliestSubmission = Math.min(...userSubmissions.map(s => new Date(s.submittedAt).getTime()));
      } else if (userProgress.length > 0) {
        earliestSubmission = Math.min(...userProgress.map(p => new Date(p.submittedAt).getTime()));
      }

      return {
        email: p.email,
        name: p.name,
        totalMarks,
        verifiedCount,
        completedCount,
        earliestSubmission
      };
    });

    // Sort descending by totalMarks, then completedCount, then ascending by earliestSubmission
    leaderboard.sort((a, b) => 
      b.totalMarks - a.totalMarks || 
      b.completedCount - a.completedCount ||
      a.earliestSubmission - b.earliestSubmission
    );

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed participants for admin evaluation grid
router.get('/participants', async (req, res) => {
  try {
    const participants = await Participant.find({});
    const progress = await Progress.find({ verified: true });
    const submissions = await ProjectSubmission.find({});
    const sessions = await Session.find({});

    const participantsData = participants.map(p => {
      const userProgress = progress.filter(pr => pr.email === p.email);
      const userSubmissions = submissions.filter(sub => sub.email === p.email);
      
      const sessionData = {};
      // Hardcode 8 sessions to ensure data is always returned
      for (let i = 1; i <= 8; i++) {
        const sId = `session_${i}`;
        const sProgress = userProgress.filter(pr => pr.sessionId === sId);
        const sSub = userSubmissions.find(sub => sub.sessionId === sId);
        
        // Find the total modules for this session if it exists in the DB
        const sessionInDb = sessions.find(s => s.sessionId === sId);
        const totalModules = sessionInDb ? sessionInDb.modules.length : 0;

        const moduleMarks = sProgress.length * 5;
        const projectMarks = sSub && sSub.marks !== null ? sSub.marks : null;
        
        sessionData[sId] = {
          modulesCompleted: sProgress.length,
          totalModules: totalModules,
          pdfUrl: sSub ? (sSub.pdfUrl || sSub.projectUrl) : null,
          marks: projectMarks,
          totalMarks: moduleMarks + (projectMarks || 0),
          feedback: sSub ? sSub.feedback : null
        };
      }

      let totalMarks = 0;
      for (let i = 1; i <= 8; i++) {
        totalMarks += sessionData[`session_${i}`].totalMarks;
      }

      return {
        email: p.email,
        name: p.name,
        sessions: sessionData,
        totalMarks
      };
    });

    res.json(participantsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grade a project
router.post('/grade', async (req, res) => {
  try {
    const { email, sessionId, marks, feedback } = req.body;
    
    if (!email || !sessionId || marks === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const submission = await ProjectSubmission.findOne({ email, sessionId });
    if (!submission) {
      return res.status(404).json({ error: "Project submission not found" });
    }

    submission.marks = marks;
    submission.feedback = feedback || null;
    submission.status = 'APPROVED';

    // Issue Badge via External API if grading is successful and API details are provided
    if (process.env.BADGE_API_URL && process.env.BADGE_API_TOKEN) {
      try {
        const caseInsensitiveEmail = new RegExp(`^${email}$`, 'i');
        let userRegistration = await Registration.findOne({ email: caseInsensitiveEmail });
        if (!userRegistration) {
          userRegistration = await Participant.findOne({ email: caseInsensitiveEmail });
        }
        const fullName = userRegistration && userRegistration.name ? userRegistration.name : email.split('@')[0];

        // Parse numeric session ID (e.g., 'session_1' -> 1)
        const match = sessionId.match(/\d+/);
        const numericSessionId = match ? parseInt(match[0], 10) : 1;

        // Use a timestamp-based badge number to guarantee 100% uniqueness and avoid 409 conflicts
        const badgeNumber = `MTC-SOAI-AZURE-${Date.now()}`;

        const payload = {
          "holder_full_name": fullName,
          "holder_email": email,
          "badge_number": badgeNumber,
          "badge_definition_id": numericSessionId,
          "authorised_by": "Microsoft Tech Community",
          "added_by": "API"
        };

        const badgeResponse = await fetch(process.env.BADGE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BADGE_API_TOKEN}`
          },
          body: JSON.stringify(payload)
        });

        const badgeData = await badgeResponse.json();

        if (badgeData.success && badgeData.badge && badgeData.badge.badge_url) {
          // Construct full URL if returned URL is a relative path
          const baseUrl = process.env.BADGE_PORTAL_BASE_URL || '';
          submission.badgeUrl = badgeData.badge.badge_url.startsWith('http') 
            ? badgeData.badge.badge_url 
            : `${baseUrl}${badgeData.badge.badge_url}`;
            
          // Save the generated badge URL to the database
          await submission.save();

          // Fire email asynchronously (fire and forget)
          sendBadgeEmail(email, fullName, numericSessionId, submission.badgeUrl);
        } else {
          console.error("Badge API failed or returned unexpected format:", badgeData);
        }
      } catch (apiError) {
        console.error("Error issuing badge via API:", apiError);
      }
    }

    await submission.save();

    res.json({ message: "Marks uploaded successfully", submission });
  } catch (error) {
    console.error("Grade Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
