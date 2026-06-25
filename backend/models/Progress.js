import mongoose from 'mongoose';

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

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

export default Progress;
