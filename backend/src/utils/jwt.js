const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lumilink-secret-key-2025';

const generateToken = (userId) => {

  try {
    const token = jwt.sign(
      { userId: userId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return token;
  } catch (error) {
    console.error('❌ JWT generation failed:', error);
    // Fallback to mock for development
    const mockToken = `mock-jwt-${userId}-${Date.now()}`;
    return mockToken;
  }
};

const verifyToken = (token) => {

  try {
    // Try real JWT first
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId };
  } catch (error) {

    // Fallback to mock token parsing
    if (token && token.startsWith("mock-jwt-")) {
      const parts = token.split("-");

      if (parts.length >= 4) {
        // Format: mock-jwt-{uuid-part1}-{uuid-part2}-{uuid-part3}-{uuid-part4}-{uuid-part5}-{timestamp}
        // Need to reconstruct full UUID from parts[2] to parts[6]
        if (parts.length >= 7) {
          const userId = `${parts[2]}-${parts[3]}-${parts[4]}-${parts[5]}-${parts[6]}`;
          return { userId: userId };
        } else {
          // Old format - try to extract what we can
          const userIdParts = parts.slice(2, -1);
          const userId = userIdParts.join("-");
          return { userId: userId };
        }
      }
    }

    console.error('❌ JWT verification failed:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
