/**
 * Input Validation Helper
 * Validates common input patterns
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  // Accept various phone formats: +1234567890, 1234567890, etc
  const phoneRegex = /^[\d+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validateOtp = (otp) => {
  // OTP should be 4 digits
  return /^\d{4}$/.test(otp.toString());
};

const validateName = (name) => {
  // Name should be 2-50 characters, no special characters except spaces and hyphens
  return /^[a-zA-Z\s\-]{2,50}$/.test(name);
};

module.exports = {
  validateEmail,
  validatePhone,
  validateOtp,
  validateName,
};
