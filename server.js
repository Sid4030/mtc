import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import nodemailer from 'nodemailer';

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
app.use(mongoSanitize()); // Prevent NoSQL injection attacks

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

let cachedConnection = global.mongoose || { conn: null, promise: null };
global.mongoose = cachedConnection;

async function connectToDatabase() {
  if (cachedConnection.conn) return cachedConnection.conn;
  if (!MONGO_URI) {
    console.warn("⚠️ Warning: MONGO_URI is not defined in .env file. Backend will not connect to database.");
    return null;
  }
  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // fail early if it cannot connect
    }).then((mongoose) => mongoose);
  }
  cachedConnection.conn = await cachedConnection.promise;
  console.log('✅ Connected to MongoDB Atlas');
  return cachedConnection.conn;
}

// Connect initially
connectToDatabase().catch((err) => console.error('❌ MongoDB connection error:', err));

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
  githubUrl: { type: String }, // Optional
  motivation: { type: String }, // Optional
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
    const db = await connectToDatabase();
    if (!db) {
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

    // Send confirmation email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Successfully Registered for Microsoft Tech Community Bootcamp',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                /* Animations that work in modern email clients */
                @keyframes pulse {
                  0% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(0.8); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes flowRiver {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .river-bg {
                  background-size: 300% 300% !important;
                  animation: flowRiver 12s ease infinite !important;
                }
                .glow-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 15px 25px -5px rgba(37, 211, 102, 0.7) !important;
                }
              </style>
            </head>
            <body class="river-bg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0217; background-image: linear-gradient(-45deg, #0b0217 0%, #2e094f 20%, #6b21a8 40%, #00d2ff 50%, #6b21a8 60%, #2e094f 80%, #0b0217 100%); padding: 40px 20px; margin: 0; color: #ffffff;">
              
              <!-- Top Logo -->
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" alt="Microsoft" style="height: 36px; vertical-align: middle;" />
                <span style="color: #ffffff; font-size: 26px; font-weight: 700; margin-left: 12px; vertical-align: middle; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">Tech Community</span>
              </div>

              <!-- Main Card -->
              <div style="max-width: 540px; margin: 0 auto; background-color: rgba(15, 10, 20, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 24px; padding: 40px 30px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);">
                
                <!-- Animation (High-Quality 3D Rocket) -->
                <div style="margin-bottom: 24px;">
                  <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif" alt="Rocket" style="width: 100px; height: 100px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));" />
                </div>

                <!-- Title with Pulsing Status Indicator -->
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.5px; display: flex; align-items: center; justify-content: center; gap: 10px; text-shadow: 0 0 20px rgba(0, 210, 255, 0.5);">
                  You're on the list!
                  <span style="display: inline-block; width: 12px; height: 12px; background-color: #25D366; border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 12px #25D366;"></span>
                </h1>

                <!-- Welcome Message -->
                <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  Hello <strong style="color: #ffffff;">${name}</strong>, your application for the Microsoft Tech Community Bootcamp has been successfully received. We're thrilled to have you!
                </p>

                <!-- Unique Easter Egg: Terminal Window Snippet -->
                <div style="background-color: #050505; border: 1px solid #333333; border-radius: 12px; margin-bottom: 24px; overflow: hidden; text-align: left; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                  <!-- Terminal Header -->
                  <div style="background-color: #1a1a1a; padding: 10px 16px; border-bottom: 1px solid #333333;">
                    <div style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #ff5f56; margin-right: 6px;"></div>
                    <div style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #ffbd2e; margin-right: 6px;"></div>
                    <div style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #27c93f;"></div>
                    <span style="color: #888888; font-family: monospace; font-size: 12px; margin-left: 12px;">system_log.json</span>
                  </div>
                  <!-- Terminal Body (Syntax Highlighted) -->
                  <div style="padding: 16px; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.6; color: #a1a1a6;">
                    <span style="color: #ff7b72;">const</span> <span style="color: #79c0ff;">registration</span> <span style="color: #ff7b72;">=</span> {<br/>
                    &nbsp;&nbsp;<span style="color: #7ee787;">"status"</span>: <span style="color: #79c0ff;">200</span>,<br/>
                    &nbsp;&nbsp;<span style="color: #7ee787;">"user"</span>: <span style="color: #a5d6ff;">"${name}"</span>,<br/>
                    &nbsp;&nbsp;<span style="color: #7ee787;">"role"</span>: <span style="color: #a5d6ff;">"Innovator"</span>,<br/>
                    &nbsp;&nbsp;<span style="color: #7ee787;">"access_granted"</span>: <span style="color: #79c0ff;">true</span><br/>
                    };<br/>
                    <br/>
                    <span style="color: #8b949e;">// Welcome to the club 🚀</span>
                  </div>
                </div>

                <!-- Event Details Grid -->
                <div style="display: table; width: 100%; margin-bottom: 32px; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 16px 0; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="display: table-cell; width: 33%; text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: #6e6e73; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0; letter-spacing: 1px;">Date</p>
                    <p style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0;">TBA</p>
                  </div>
                  <div style="display: table-cell; width: 33%; text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: #6e6e73; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0; letter-spacing: 1px;">Time</p>
                    <p style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0;">TBA</p>
                  </div>
                  <div style="display: table-cell; width: 33%; text-align: center;">
                    <p style="color: #6e6e73; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0; letter-spacing: 1px;">Role</p>
                    <p style="color: #00d2ff; font-size: 14px; font-weight: 600; margin: 0; text-shadow: 0 0 10px rgba(0,210,255,0.5);">Innovator</p>
                  </div>
                </div>

                <p style="color: #a1a1a6; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                  Join the official group for event details or any queries to ask from our team.
                </p>

                <!-- Glowing Button -->
                <a href="https://chat.whatsapp.com/your-group-link-here" class="glow-btn" style="display: inline-block; background: linear-gradient(90deg, #1ebe57 0%, #25D366 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 36px; border-radius: 30px; margin-bottom: 16px; box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.5); transition: all 0.3s ease;">
                  Join WhatsApp Group
                </a>

                <!-- Helper Text -->
                <p style="color: #6e6e73; font-size: 13px; margin: 0;">
                  Or copy and paste this link:<br/>
                  <a href="https://chat.whatsapp.com/your-group-link-here" style="color: #00a4ef; text-decoration: none; word-break: break-all;">https://chat.whatsapp.com/your-group-link-here</a>
                </p>

                <!-- Unique Easter Egg: CSS Barcode Ticket Stub -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px dashed rgba(255, 255, 255, 0.1);">
                  <p style="color: #6e6e73; font-size: 11px; font-family: 'Courier New', monospace; letter-spacing: 4px; margin: 0 0 12px 0; text-transform: uppercase;">VIP Entry Pass</p>
                  
                  <!-- Pure CSS Barcode (Email Safe) -->
                  <div style="display: inline-block; height: 40px; opacity: 0.8;">
                    <span style="display: inline-block; width: 3px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 1px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 4px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 2px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 1px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 5px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 2px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 1px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 3px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 4px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 1px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 3px; height: 100%; background: #ffffff; margin-right: 2px;"></span>
                    <span style="display: inline-block; width: 2px; height: 100%; background: #ffffff; margin-right: 0;"></span>
                  </div>
                  
                  <p style="color: #6e6e73; font-size: 12px; font-family: 'Courier New', monospace; letter-spacing: 3px; margin: 12px 0 24px 0;">MS-TECH-ID-${Math.floor(1000 + Math.random() * 9000)}</p>
                  
                  <!-- Official Website Link -->
                  <a href="https://techcommunity.microsoft.com" style="display: inline-block; padding: 10px 24px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; color: #e2e8f0; font-size: 12px; font-weight: 500; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease;">
                    Visit Official Website
                  </a>
                </div>

              </div>

              <!-- Footer -->
              <div style="max-width: 540px; margin: 30px auto 0; text-align: center;">
                <p style="color: #6e6e73; font-size: 12px; line-height: 1.5; margin: 0;">
                  Microsoft Tech Community is a student-led initiative. This email was sent because you registered for our Bootcamp.<br/><br/>
                  &copy; ${new Date().getFullYear()} Microsoft Tech Community. All rights reserved.
                </p>
              </div>

            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to', email);
      } catch (mailError) {
        console.error('Error sending confirmation email:', mailError);
      }
    }

    res.status(201).json({ message: "Registration successful", data: newRegistration });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: `Database Error: ${error.message || 'Internal Server Error'}` });
  }
});

import jwt from 'jsonwebtoken';

// Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (!process.env.ADMIN_PASSWORD) {
    console.error("⚠️ Warning: ADMIN_PASSWORD is not defined in environment variables.");
    return res.status(500).json({ error: "Server misconfiguration. Admin login disabled." });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const jwtSecret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;
    const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '12h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: "Invalid password" });
});

// Middleware to verify admin JWT
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  const jwtSecret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  });
};

// Admin Registrations Route (Protected)
app.get('/api/admin/registrations', verifyAdmin, async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: "Backend database not configured." });
    }

    const registrations = await Registration.find().sort({ registrationDate: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Fetch Registrations Error:", error);
    res.status(500).json({ error: `Database Error: ${error.message || 'Internal Server Error'}` });
  }
});

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Database running`);
  });
}

export default app;
