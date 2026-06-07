import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn("⚠️ Warning: MONGO_URI is not defined in .env file. Backend will not connect to database.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// Mongoose Schema & Model
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  university: { type: String, required: true },
  year: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    if (!MONGO_URI) {
      return res.status(500).json({ error: "Backend database not configured." });
    }

    const { name, email, university, year } = req.body;
    
    // Basic validation
    if (!name || !email || !university || !year) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRegistration = new Registration({ name, email, university, year });
    await newRegistration.save();

    res.status(201).json({ message: "Registration successful", data: newRegistration });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
