import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  collegeType: { type: String, required: true },
  enrollmentNo: { type: String }, // For Amity
  collegeName: { type: String }, // For Others
  courseName: { type: String, required: true },
  specialisation: { type: String, required: true },
  year: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  githubUrl: { type: String }, // Optional
  motivation: { type: String }, // Optional
  registrationDate: { type: Date, default: Date.now }
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

export default Registration;
