import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);

export default Participant;
