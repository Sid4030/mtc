import mongoose from 'mongoose';
import { getSecondaryConnection } from '../secondaryDb.js';

const projectSubmissionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sessionId: { type: String, required: true },
  projectUrl: { type: String, required: true }, // GitHub repo or project link
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  marks: { type: Number, default: null }, // Assigned by admin during grading
  feedback: { type: String, default: null }, // Feedback from admin
  submittedAt: { type: Date, default: Date.now }
});

projectSubmissionSchema.index({ email: 1, sessionId: 1 }, { unique: true });

const conn = getSecondaryConnection();
const ProjectSubmission = conn.models.ProjectSubmission || conn.model('ProjectSubmission', projectSubmissionSchema);

export default ProjectSubmission;
