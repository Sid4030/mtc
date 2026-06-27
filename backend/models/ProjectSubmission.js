import mongoose from 'mongoose';

const projectSubmissionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sessionId: { type: String, required: true },
  pdfUrl: { type: String, required: false }, // PDF link (Google Drive / OneDrive)
  projectUrl: { type: String, required: false }, // Legacy field for earlier testing
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  marks: { type: Number, default: null }, // Assigned by admin during grading
  feedback: { type: String, default: null }, // Feedback from admin
  badgeUrl: { type: String, default: null }, // URL to the generated badge
  submittedAt: { type: Date, default: Date.now }
});

projectSubmissionSchema.index({ email: 1, sessionId: 1 }, { unique: true });

const ProjectSubmission = mongoose.models.ProjectSubmission || mongoose.model('ProjectSubmission', projectSubmissionSchema);

export default ProjectSubmission;
