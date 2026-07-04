import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Reusing the transporter setup logic
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export const sendBadgeEmail = async (email, name, sessionNumber, badgeUrl) => {
  if (!transporter) {
    console.warn("⚠️ No EMAIL_USER or EMAIL_PASS provided. Badge email not sent to", email);
    return;
  }

  const htmlContent = `
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
        
        <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 15px 0; text-align: left;">
          Congratulations, ${name}!<span style="color: #2ea043; font-size: 26px;">&bull;</span>
        </h1>
        
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin: 0 0 24px 0; text-align: left;">
          Your final project for <strong>Session ${sessionNumber}</strong> of Season of AI 2.0 – Azure Edition has been successfully graded and approved!
        </p>

        <!-- Badge Details -->
        <div style="background-color: #161b22; border-radius: 12px; padding: 25px 15px; margin-bottom: 24px; border: 1px solid #30363d; text-align: center;">
          <h3 style="color: #ffffff; font-size: 20px; margin: 0 0 20px 0;">You've Earned a Badge! 🏆</h3>
          
          <img src="cid:badge_image" alt="Badge" style="max-width: 250px; height: auto; border-radius: 8px; margin-bottom: 20px;">
          
          <p style="color: #8b949e; font-size: 14px; margin: 0 0 20px 0;">
            Click the button below to view and claim your official Microsoft Tech Community badge.
          </p>

          <a href="${badgeUrl}" style="display: inline-block; background-color: #2ea043; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 50px; box-shadow: 0 4px 15px rgba(46, 160, 67, 0.4);">
            View My Badge
          </a>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin: 0 0 30px 0; text-align: left;">
          Keep up the amazing work!<br><br>
          Regards,<br>
          <strong style="color: #ffffff;">Season of AI 2.0 – Azure Edition Team</strong><br>
          Microsoft Tech Community
        </p>
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

  try {
    await transporter.sendMail({
      from: `"Season of AI Team" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: `Congratulations! You've earned a badge for Session ${sessionNumber}`,
      html: htmlContent,
      attachments: [
        {
          filename: sessionNumber === 1 ? 'badge.png' : `badge${sessionNumber - 1}.png`,
          path: path.join(process.cwd(), sessionNumber === 1 ? 'badge.png' : `badge${sessionNumber - 1}.png`),
          cid: 'badge_image'
        }
      ]
    });
    console.log(`✅ Badge email sent successfully to ${email} for user ${name}`);
  } catch (err) {
    console.error(`❌ Failed to send badge email to ${email}:`, err);
  }
};
