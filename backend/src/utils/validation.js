const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return false;
  }

  // Kiểm tra có khoảng trắng
  if (/\s/.test(password)) {
    return false;
  }

  // Kiểm tra có chữ cái
  if (!/[a-zA-Z]/.test(password)) {
    return false;
  }

  // Kiểm tra không được toàn bộ là số
  if (/^\d+$/.test(password)) {
    return false;
  }

  return true;
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateRequired = (data, fields) => {
  const missing = fields.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missing
  };
};

module.exports = {
  validateEmail,
  validateUsername,
  validatePassword,
  validateUrl,
  validateRequired
};
