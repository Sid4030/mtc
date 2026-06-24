import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import path from 'path';

import Registration from './models/Registration.js';
import badgesRouter from './routes/badges.js';
import projectsRouter from './routes/projects.js';
import adminRouter from './routes/admin.js';
import publicRouter from './routes/public.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet()); // Sets secure HTTP headers

// Trust proxy for Vercel (required for rate limiting to work correctly)
app.set('trust proxy', 1);

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
// Removed mongoSanitize() due to Node.js 20+ compatibility TypeError

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
    cachedConnection.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }
  cachedConnection.conn = await cachedConnection.promise;
  console.log('✅ Connected to MongoDB Atlas');
  return cachedConnection.conn;
}

// Connect initially
connectToDatabase().catch((err) => console.error('❌ MongoDB connection error:', err));

// Email Transporter setup (reused across requests for better performance under high traffic)
let globalTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  globalTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  globalTransporter.verify((error, success) => {
    if (error) {
      console.error('⚠️ Email Transporter Error:', error);
    } else {
      console.log('✅ Email Transporter is ready');
    }
  });
}

// Registration model is now imported from ./models/Registration.js

// Root Route to prevent 404 on base URL
app.get('/', (req, res) => {
  res.send('Database running');
});

// API Routes
app.use('/api/badges', badgesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/public', publicRouter);

// Helper function to generate ticket HTML
const generateTicketHTML = (name) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f0518; background-image: radial-gradient(circle at top center, #2b124c 0%, #0f0518 80%); padding: 20px 10px; margin: 0; color: #ffffff;">
    
    <!-- Logo Section -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="margin: 0; line-height: 48px;">
        <img src="https://res.cloudinary.com/dkdvmchfi/image/upload/v1781550670/Logo-microsoft-transparent-background-PNG_remaac.png" height="44" alt="Microsoft" style="vertical-align: middle; margin-right: 8px; padding-bottom: 3px;">
        <span style="vertical-align: middle; color: #ffffff; font-weight: bold; font-size: 26px;">Tech Community</span>
      </h2>
    </div>

    <div style="max-width: 600px; margin: 0 auto; background-color: #111113; border-radius: 16px; padding: 25px 15px; border: 1px solid rgba(255,255,255,0.03); box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
      
      <!-- Rectangle Image -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:ticket_image" alt="Season of AI" style="display: block; width: 100%; max-width: 100%; height: auto; border-radius: 8px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); margin: 0 auto;" />
      </div>

      <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 15px 0; text-align: left;">
        Your Bootcamp Ticket!<span style="color: #2ea043; font-size: 26px;">&bull;</span>
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin: 0 0 24px 0; text-align: left;">
        Dear ${name},<br><br>
        We are excited to welcome you to Season of AI 2.0 – Azure Edition, an 8-session hands-on bootcamp focused on Azure AI and cloud technologies.
      </p>

      <!-- Session 1 Details -->
      <div style="background-color: #161b22; border-radius: 12px; padding: 15px; margin-bottom: 24px; border: 1px solid #30363d; text-align: left;">
        <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 12px 0; border-bottom: 1px solid #30363d; padding-bottom: 10px;">Session 1 Details</h3>
        <ul style="color: #d1d5db; font-size: 15px; margin: 0; padding-left: 20px; line-height: 1.6; padding-top: 10px;">
          <li style="margin-bottom: 5px;"><strong>Date:</strong> 25 June 2026</li>
          <li><strong>Time:</strong> 7:00 PM IST – 8:30 PM IST (Approx.)</li>
        </ul>
        <p style="color: #8b949e; font-size: 14px; margin: 15px 0 0 0; font-style: italic; background-color: rgba(255,255,255,0.02); padding: 10px; border-left: 3px solid #58a6ff; border-radius: 0 4px 4px 0;">
          Please join the session on time to avoid missing important announcements and onboarding information.
        </p>
      </div>

      <!-- Important Links -->
      <div style="background-color: #161b22; border-radius: 12px; padding: 20px 15px; margin-bottom: 24px; border: 1px solid #30363d; text-align: center;">
        <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 25px 0; text-transform: uppercase; letter-spacing: 1px;">Important Links</h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto; max-width: 320px;">
          <tr>
            <td style="padding-bottom: 12px;">
              <a href="https://teams.microsoft.com/meet/24122598981924?p=lk3mZe3WOksrcTk58F" style="display: block; background-color: #5b5fc7; color: #ffffff; font-size: 15px; font-weight: bold; text-decoration: none; padding: 16px 15px; border-radius: 50px; border: 1px solid #4a4d9e; box-shadow: 0 4px 15px rgba(91,95,199,0.3); text-align: center; white-space: nowrap;">
                <span style="font-size: 16px; margin-right: 6px;">📹</span> Microsoft Teams
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 12px;">
              <a href="https://discord.gg/PxejdseeB" style="display: block; background-color: #5865F2; color: #ffffff; font-size: 15px; font-weight: bold; text-decoration: none; padding: 16px 15px; border-radius: 50px; border: 1px solid #4752c4; box-shadow: 0 4px 15px rgba(88,101,242,0.3); text-align: center; white-space: nowrap;">
                <span style="font-size: 16px; margin-right: 6px;">💬</span> Discord Server
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a href="https://chat.whatsapp.com/LpzfCa69X0T01YaWdjYrlT?s=sh&p=i&ilr=0&amv=2" style="display: block; background-color: #25D366; color: #ffffff; font-size: 15px; font-weight: bold; text-decoration: none; padding: 16px 15px; border-radius: 50px; border: 1px solid #1da851; box-shadow: 0 4px 15px rgba(37,211,102,0.3); text-align: center; white-space: nowrap;">
                <span style="font-size: 16px; margin-right: 6px;">📱</span> WhatsApp Community
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Azure for Students -->
      <div style="background-color: #161b22; border-radius: 8px; padding: 15px; margin-bottom: 24px; border: 1px solid #2ea043; text-align: left; box-shadow: 0 0 15px rgba(46, 160, 67, 0.1);">
        <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 10px 0;">Azure for Students (Required)</h3>
        <p style="color: #d1d5db; font-size: 15px; margin: 0 0 15px 0; line-height: 1.6;">
          To participate in the hands-on activities, please activate your Azure for Students subscription before the session.
        </p>
        <h4 style="color: #ffffff; font-size: 15px; margin: 0 0 8px 0;">Benefits:</h4>
        <ul style="color: #d1d5db; font-size: 14px; margin: 0 0 20px 0; padding-left: 20px; line-height: 1.6;">
          <li>USD 100 Azure Credits</li>
          <li>No Credit Card Required</li>
          <li>Valid for One Year</li>
        </ul>
        <div style="text-align: center;">
          <a href="https://azure.microsoft.com/en-us/free/students?wt.mc_id=studentamb_496702" style="display: inline-block; background-color: #2ea043; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">Activate Azure for Students</a>
        </div>
      </div>

      <!-- Notes -->
      <div style="text-align: left; margin-bottom: 30px;">
        <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 12px 0;">Notes</h3>
        <ul style="color: #d1d5db; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Badge and certificate eligibility will be explained during the session.</li>
          <li>Session recordings and resources will be shared after the event.</li>
          <li>Please maintain professional and respectful conduct throughout the program.</li>
        </ul>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin: 0 0 30px 0; text-align: left;">
        We look forward to seeing you on 25 June.<br><br>
        Regards,<br>
        <strong style="color: #ffffff;">Season of AI 2.0 – Azure Edition Team</strong><br>
        Microsoft Tech Community
      </p>

      <!-- VIP Pass Section (Ticket) -->
      <div style="text-align: center; background-color: #080808; padding: 20px 15px; border-radius: 12px; border: 1px dashed #30363d;">
        <p style="color: #8b949e; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 15px 0;">VIP ENTRY PASS</p>
        
        <!-- Simulated Barcode using text -->
        <div style="font-family: 'Arial', sans-serif; font-size: 38px; font-weight: bold; letter-spacing: -2px; color: #ffffff; margin-bottom: 15px; transform: scaleY(1.5);">
          ||||| ||| || |||| ||
        </div>
        
        <p style="color: #8b949e; font-size: 11px; font-family: monospace; letter-spacing: 2px; margin: 0 0 15px 0;">MS-TECH-ID-6115</p>

        <a href="https://mtc-amity.tech" style="color: #58a6ff; font-size: 12px; font-weight: bold; text-decoration: none; letter-spacing: 1px; text-transform: uppercase;">VISIT OFFICIAL WEBSITE</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="max-width: 600px; margin: 30px auto 0; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0 0 10px 0;">
        Microsoft Tech Community is a student-led initiative.
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        &copy; ${new Date().getFullYear()} Microsoft Tech Community. All rights reserved.
      </p>
    </div>

  </body>
  </html>
`;


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

    // Check for duplicates
    const existingRegistration = await Registration.findOne({
      $or: [{ email }, { contactNumber }]
    });

    if (existingRegistration) {
      if (existingRegistration.email === email) {
        return res.status(409).json({ error: "This email address is already registered." });
      } else {
        return res.status(409).json({ error: "This contact number is already registered." });
      }
    }

    const newRegistration = new Registration({ 
      name, email, contactNumber, collegeType, enrollmentNo, collegeName, 
      courseName, specialisation, year, linkedinUrl, githubUrl, motivation 
    });
    
    await newRegistration.save();

    res.status(201).json({ message: "Registration successful", data: newRegistration });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// New Route: Send Welcome Emails (Called silently by frontend after registration)
app.post('/api/send-welcome-emails', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: "Missing email or name." });
    }

    if (!globalTransporter) {
      return res.status(500).json({ error: "Mail transporter not configured." });
    }

    const mailOptions = {
      from: `"Siddhant From Microsoft Tech Community" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: `Bootcamp Registration Confirmed: ${name} `,
      text: `Hello ${name},\n\nYour application for the Microsoft Tech Community Bootcamp has been successfully received. We're thrilled to have you! Check out the brochure to explore your journey.\n\nJoin the official WhatsApp group for event details or any queries: https://chat.whatsapp.com/LpzfCa69X0T01YaWdjYrlT?s=sh&p=i&ilr=0&amv=2\n\nSee you there!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f0518; background-image: radial-gradient(circle at top center, #2b124c 0%, #0f0518 80%); padding: 40px 20px; margin: 0; color: #ffffff;">
          
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0; line-height: 48px;">
              <img src="https://res.cloudinary.com/dkdvmchfi/image/upload/v1781550670/Logo-microsoft-transparent-background-PNG_remaac.png" height="44" alt="Microsoft" style="vertical-align: middle; margin-right: 8px; padding-bottom: 3px;">
              <span style="vertical-align: middle; color: #ffffff; font-weight: bold; font-size: 26px;">Tech Community</span>
            </h2>
          </div>

          <div style="max-width: 500px; margin: 0 auto; background-color: #111113; border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.03); box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
            
            <!-- Animated Rocket GIF -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif" alt="Rocket" style="width: 100px; height: 100px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));" />
            </div>

            <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 15px 0; text-align: left;">
              You're on the list!<span style="color: #2ea043; font-size: 26px;">&bull;</span>
            </h1>
            
            <p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin: 0 0 24px 0; text-align: left;">
              Hello <strong style="color: #ffffff;">${name}</strong>, your application for the Microsoft Tech Community Bootcamp has been successfully received. We're thrilled to have you! Check out the brochure to explore your journey.
            </p>


            <!-- Code Block -->
            <div style="background-color: #0d1117; border: 1px solid #2ea043; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
              <!-- Mac-style header -->
              <div style="background-color: #161b22; padding: 8px 12px; border-bottom: 1px solid #30363d;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #ff5f56; margin-right: 6px;"></span>
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #ffbd2e; margin-right: 6px;"></span>
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #27c93f; margin-right: 12px;"></span>
                <span style="color: #8b949e; font-size: 12px; font-family: monospace; vertical-align: middle;">system_log.json</span>
              </div>
              <div style="padding: 16px; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.5; text-align: left;">
                <span style="color: #ff7b72;">const</span> <span style="color: #79c0ff;">registration</span> <span style="color: #ff7b72;">=</span> {<br>
                &nbsp;&nbsp;<span style="color: #a5d6ff;">"status"</span>: <span style="color: #79c0ff;">200</span>,<br>
                &nbsp;&nbsp;<span style="color: #a5d6ff;">"user"</span>: <span style="color: #a5d6ff;">"${name}"</span>,<br>
                &nbsp;&nbsp;<span style="color: #a5d6ff;">"role"</span>: <span style="color: #a5d6ff;">"Innovator"</span>,<br>
                &nbsp;&nbsp;<span style="color: #a5d6ff;">"access_granted"</span>: <span style="color: #79c0ff;">true</span><br>
                };<br><br>
                <span style="color: #8b949e;">// Welcome to the club 🚀</span>
              </div>
            </div>

            <!-- Details Grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #080808; border-radius: 8px; border: 1px solid #1f1f1f;">
              <tr>
                <td style="padding: 15px; text-align: center; border-right: 1px solid #1f1f1f; width: 33%;">
                  <div style="color: #8b949e; font-size: 11px; text-transform: uppercase; margin-bottom: 5px;">Date</div>
                  <div style="color: #ffffff; font-size: 13px; font-weight: bold;">25th June</div>
                </td>
                <td style="padding: 15px; text-align: center; border-right: 1px solid #1f1f1f; width: 33%;">
                  <div style="color: #8b949e; font-size: 11px; text-transform: uppercase; margin-bottom: 5px;">Time</div>
                  <div style="color: #ffffff; font-size: 13px; font-weight: bold;">7-8:30</div>
                </td>
                <td style="padding: 15px; text-align: center; width: 33%;">
                  <div style="color: #8b949e; font-size: 11px; text-transform: uppercase; margin-bottom: 5px;">Role</div>
                  <div style="color: #58a6ff; font-size: 13px; font-weight: bold;">Innovator</div>
                </td>
              </tr>
            </table>

            <p style="font-size: 13px; line-height: 1.5; color: #8b949e; margin: 0 0 20px 0; text-align: center;">
              Join the official group for event details or any queries to ask from our team.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin-bottom: 15px;">
              <a href="https://chat.whatsapp.com/LpzfCa69X0T01YaWdjYrlT?s=sh&p=i&ilr=0&amv=2" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 20px;">Join WhatsApp Group</a>
            </div>

            <!-- Link below button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 11px; color: #8b949e; margin: 0 0 5px 0;">Or copy and paste this link:</p>
              <a href="https://chat.whatsapp.com/LpzfCa69X0T01YaWdjYrlT?s=sh&p=i&ilr=0&amv=2" style="font-size: 11px; color: #58a6ff; text-decoration: none; word-break: break-all;">https://chat.whatsapp.com/LpzfCa69X0T01YaWdjYrlT?s=sh&amp;p=i&amp;ilr=0&amp;amv=2</a>
            </div>

            <!-- Divider -->
            <hr style="border: none; border-top: 1px dashed #30363d; margin: 30px 0;">

            <!-- VIP Pass Section -->
            <div style="text-align: center;">
              <p style="color: #8b949e; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 15px 0;">VIP ENTRY PASS</p>
              
              <!-- Simulated Barcode using text -->
              <div style="font-family: 'Arial', sans-serif; font-size: 32px; font-weight: bold; letter-spacing: -2px; color: #ffffff; margin-bottom: 10px; transform: scaleY(1.5);">
                ||||| ||| || ||||
              </div>
              
              <p style="color: #8b949e; font-size: 10px; font-family: monospace; letter-spacing: 2px; margin: 0 0 20px 0;">MS-TECH-ID-6115</p>

              <a href="https://mtc-amity.tech" style="color: #ffffff; font-size: 11px; font-weight: bold; text-decoration: none; letter-spacing: 1px; text-transform: uppercase;">VISIT OFFICIAL WEBSITE</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="max-width: 500px; margin: 30px auto 0; text-align: center;">
            <p style="color: #6b7280; font-size: 11px; line-height: 1.5; margin: 0 0 10px 0;">
              Microsoft Tech Community is a student-led initiative. This email was sent because you registered for our Bootcamp.
            </p>
            <p style="color: #6b7280; font-size: 11px; margin: 0;">
              &copy; ${new Date().getFullYear()} Microsoft Tech Community. All rights reserved.
            </p>
          </div>

        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'Season of AI Brochure.pdf',
          path: path.join(process.cwd(), 'Season of AI Brochure.pdf')
        }
      ]
    };

    const ticketOptions = {
      from: `"Siddhant From Microsoft Tech Community" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: `Entry Ticket - Session 1 | Season of AI 2.0 – Azure Edition`,
      html: generateTicketHTML(name),
      attachments: [
        {
          filename: 'ticket.png',
          path: path.join(process.cwd(), 'ticket.png'),
          cid: 'ticket_image'
        }
      ]
    };

    // Await both emails simultaneously so Vercel keeps the function alive
    await Promise.all([
      globalTransporter.sendMail(mailOptions),
      globalTransporter.sendMail(ticketOptions)
    ]);
    console.log('Confirmation and Ticket emails sent simultaneously to', email);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending welcome emails:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

import jwt from 'jsonwebtoken';

// Admin Login Route
app.post('/api/admin/login', (req, res) => {
  // Force reload .env so manual changes apply immediately without server restart
  dotenv.config({ override: true });
  
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

// Mount modular admin routes
app.use('/api/admin', verifyAdmin, adminRouter);

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Database running`);
  });
}

export default app;
