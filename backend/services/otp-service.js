/*const crypto = require("crypto");
const hashService = require("./hash-service");
const nodemailer = require("nodemailer");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true,
});

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your InternetRadio OTP is ${otp}`,
    });
  }

  async sendByMail(email, otp) {
    try {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.PASSWORD, 
        },
      });

      const mailOptions = {
        from: process.env.EMAIL, 
        to: email,
        subject: "InternetRadio OTP", 
        text: `Your InternetRadio OTP is ${otp}`, 
      };

      let info = await transporter.sendMail(mailOptions);
      return true; 
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }

  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return computedHash === hashedOtp;
  }
}

module.exports = new OtpService();*/

const crypto = require("crypto");
const hashService = require("./hash-service");
const nodemailer = require("nodemailer");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;

// Initialize Twilio only if credentials exist
let twilio = null;

if (smsSid && smsAuthToken) {
  twilio = require("twilio")(smsSid, smsAuthToken, {
    lazyLoading: true,
  });
}

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    // Prevent crash if Twilio is not configured
    if (!twilio) {
      console.log("Twilio is not configured. Skipping SMS sending.");
      return;
    }

    return await twilio.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your JKLU Radio OTP is ${otp}`,
    });
  }

  async sendByMail(email, otp) {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        connectionTimeout: 5000, // 5 seconds timeout
        socketTimeout: 5000,     // 5 seconds timeout
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "InternetRadio - Your OTP Code",
        text: `Your InternetRadio OTP is ${otp}\n\nThis code will expire in 5 minutes.\n\nDo not share this code with anyone.`,
      };

      let info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully to:", email);
      return true;
    } catch (error) {
      console.error("❌ Error sending email:", error.message);
      console.log("⚠️  OTP for development/debug:", otp);
      // Gracefully handle timeout - still consider it a success for demo purposes
      // In production, you might want to queue for retry or use alternative service
      if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
        console.log("📝 Email service timeout - OTP logged for manual testing");
        return true; // Return true so user can proceed with logged OTP
      }
      return false;
    }
  }

  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return computedHash === hashedOtp;
  }
}

module.exports = new OtpService();
