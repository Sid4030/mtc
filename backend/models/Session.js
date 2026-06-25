import mongoose from 'mongoose';

import { getSecondaryConnection } from '../secondaryDb.js';

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  moduleName: { type: String, required: true },
  expectedBadgeTitle: { type: String, required: true },
  moduleUrl: { type: String } // Added for redirecting to the MS Learn module
});

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  sessionName: { type: String, required: true },
  modules: [moduleSchema] // e.g. 3-4 modules
});

const conn = getSecondaryConnection();
const Session = conn.models.Session || conn.model('Session', sessionSchema);

export default Session;
