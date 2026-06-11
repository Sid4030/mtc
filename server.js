import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet()); // Sets secure HTTP headers

// Rate Limiting (Prevent abuse / DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { error: "Too many requests, please try again later." }
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit payload size to prevent payload overflow attacks

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn("⚠️ Warning: MONGO_URI is not defined in .env file. Backend will not connect to database.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// Mongoose Schema & Model for full bootcamp registration
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
  githubUrl: { type: String, required: true },
  motivation: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Root Route to prevent 404 on base URL
app.get('/', (req, res) => {
  res.send('Database running');
});

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    if (!MONGO_URI) {
      return res.status(500).json({ error: "Backend database not configured." });
    }

    // Log removed for privacy

    const { 
      name, email, contactNumber, collegeType, enrollmentNo, collegeName, 
      courseName, specialisation, year, linkedinUrl, githubUrl, motivation 
    } = req.body;
    
    // Detailed validation for required fields
    const missing = [];
    if (!name) missing.push("Full Name");
    if (!email) missing.push("Email Address");
    if (!contactNumber) missing.push("Contact Number");
    if (!collegeType) missing.push("College Type");
    if (!courseName) missing.push("Course Name");
    if (!specialisation) missing.push("Specialisation");
    if (!year) missing.push("Year of Study");
    if (!linkedinUrl) missing.push("LinkedIn URL");
    if (!githubUrl) missing.push("GitHub URL");
    if (!motivation) missing.push("Motivation");

    if (missing.length > 0) {
      return res.status(400).json({ error: `Please fill all required fields. Missing: ${missing.join(', ')}` });
    }

    // Specific validation based on college type
    if (collegeType === 'Amity' && !enrollmentNo) {
      return res.status(400).json({ error: "Enrollment Number is required for Amity University." });
    }
    if (collegeType === 'Other' && !collegeName) {
      return res.status(400).json({ error: "College Name is required." });
    }

    const newRegistration = new Registration({ 
      name, email, contactNumber, collegeType, enrollmentNo, collegeName, 
      courseName, specialisation, year, linkedinUrl, githubUrl, motivation 
    });
    
    await newRegistration.save();

    res.status(201).json({ message: "Registration successful", data: newRegistration });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: `Database Error: ${error.message || 'Internal Server Error'}` });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Database running`);
});
