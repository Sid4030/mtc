import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

// Load env vars
dotenv.config();

// We need to import the Registration model to fetch users from DB
import Registration from './backend/models/Registration.js';

// Function to generate the HTML template for a specific user
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

// Helper for delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runBulkSendTest() {
  let dbConnection;
  try {
    // 1. Connect to Database
    console.log("Connecting to database...");
    dbConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB.");

    // 2. Fetch ALL users
    console.log(`Fetching ALL registered users from the database...`);
    
    const users = await Registration.find({});
    
    if (users.length === 0) {
      console.log("⚠️ No users found matching those emails in the DB!");
      return;
    }
    
    console.log(`Found ${users.length} users in the database.`);

    // 3. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email Transporter is ready.');

    // 4. Parse sent_emails.log to find already sent emails
    const sentEmails = new Set();
    const logFilePath = path.join(process.cwd(), 'sent_emails.log');
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, 'utf-8');
      const lines = logContent.split('\n');
      for (const line of lines) {
        if (line.includes('✅ Successfully sent to')) {
          // Extract email from string: ✅ Successfully sent to Name (email@domain.com)
          const match = line.match(/\(([^)]+)\)$/);
          if (match && match[1]) {
            sentEmails.add(match[1].trim());
          }
        }
      }
      console.log(`\n📌 Found ${sentEmails.size} previously sent emails in the log. They will be skipped.`);
    }

    // 5. Send Emails with an interval
    const intervalMs = 2000; // 2 seconds between emails
    const maxRetries = 3;
    let skippedCount = 0;
    
    console.log(`\n🚀 Starting email send process with a ${intervalMs/1000} second delay between each...`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      if (sentEmails.has(user.email)) {
        console.log(`[${i+1}/${users.length}] ⏭️ Skipping ${user.name} (${user.email}) - Already Sent.`);
        skippedCount++;
        continue;
      }

      console.log(`[${i+1}/${users.length}] 📧 Preparing to send email to ${user.name} (${user.email})...`);

      const mailOptions = {
        from: `"Siddhant From Microsoft Tech Community" <${process.env.EMAIL_USER}>`,
        replyTo: process.env.EMAIL_USER,
        to: user.email,
        subject: `Entry Ticket - Session 1 | Season of AI 2.0 – Azure Edition`,
        html: generateTicketHTML(user.name),
        attachments: [
          {
            filename: 'ticket.png',
            path: path.join(process.cwd(), 'ticket.png'),
            cid: 'ticket_image'
          }
        ]
      };

      let sendSuccess = false;
      let attempt = 1;

      while (attempt <= maxRetries && !sendSuccess) {
        try {
          await transporter.sendMail(mailOptions);
          const successLog = `[${new Date().toISOString()}] ✅ Successfully sent to ${user.name} (${user.email})\n`;
          console.log(`  └─ ` + successLog.trim());
          fs.appendFileSync(logFilePath, successLog);
          sendSuccess = true;
        } catch (error) {
          console.warn(`  └─ ⚠️ Attempt ${attempt} failed for ${user.email}: ${error.message}`);
          attempt++;
          if (attempt <= maxRetries) {
            console.log(`  └─ ⏳ Retrying in 3 seconds...`);
            await delay(3000); // Wait 3 seconds before retrying
          } else {
            const errorLog = `[${new Date().toISOString()}] ❌ Failed all ${maxRetries} attempts for ${user.name} (${user.email})\n`;
            console.error(`  └─ ` + errorLog.trim());
            fs.appendFileSync(logFilePath, errorLog);
          }
        }
      }

      // Add delay before the next user (if not the last user)
      if (i < users.length - 1) {
        await delay(intervalMs);
      }
    }

    console.log(`\n🎉 Bulk email process completed. Sent: ${users.length - skippedCount}, Skipped: ${skippedCount}.`);

  } catch (err) {
    console.error("Critical Error during script execution:", err);
  } finally {
    if (dbConnection) {
      await mongoose.disconnect();
      console.log("Database connection closed.");
    }
  }
}

runBulkSendTest();
