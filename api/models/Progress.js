import mongoose from 'mongoose';
import { getSecondaryConnection } from '../secondaryDb.js';

const progressSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sessionId: { type: String, required: true },
  moduleId: { type: String, required: true },
  badgeUrl: { type: String, required: true },
  verified: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

// A user should only have one progress entry per module per session
progressSchema.index({ email: 1, sessionId: 1, moduleId: 1 }, { unique: true });

const conn = getSecondaryConnection();
const Progress = conn.models.Progress || conn.model('Progress', progressSchema);

export default Progress;
