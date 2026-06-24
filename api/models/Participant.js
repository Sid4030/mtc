import mongoose from 'mongoose';
import { getSecondaryConnection } from '../secondaryDb.js';

const participantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const conn = getSecondaryConnection();
const Participant = conn.models.Participant || conn.model('Participant', participantSchema);

export default Participant;
