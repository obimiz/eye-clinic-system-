// Password reset email template
const passwordResetEmail = (firstName, resetURL) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #0d9488; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">👁️ EyeClinic</h1>
    </div>
    <div style="padding: 30px; background: #f9f9f9;">
      <h2>Password Reset Request</h2>
      <p>Hello <strong>${firstName}</strong>,</p>
      <p>You requested a password reset. Click the button below to reset your password.</p>
      <p>This link expires in <strong>10 minutes</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" 
           style="background: #0d9488; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset My Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        If you did not request this, please ignore this email.
        Your password will not be changed.
      </p>
    </div>
    <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
      © ${new Date().getFullYear()} EyeClinic System
    </div>
  </div>
`;
 
// Appointment reminder email template
const appointmentReminderEmail = (patientName, doctorName, date, time, type) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #0d9488; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">👁️ EyeClinic</h1>
    </div>
    <div style="padding: 30px; background: #f9f9f9;">
      <h2>Appointment Reminder</h2>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Type:</strong> ${type}</p>
      </div>
      <p>Please arrive <strong>10 minutes early</strong>.</p>
      <p style="color: #666; font-size: 14px;">
        To cancel or reschedule, please contact us as soon as possible.
      </p>
    </div>
    <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
      © ${new Date().getFullYear()} EyeClinic System
    </div>
  </div>
`;
 
export { passwordResetEmail, appointmentReminderEmail };
 
 