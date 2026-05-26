import rateLimit from "express-rate-limit";

// LOGIN LIMITER

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: 5,

  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

// OTP LIMITER(not used yet, but can be applied to OTP generation routes)

export const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: 3,

  message: {
    success: false,
    message: "Too many OTP requests. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

// TRANSFER LIMITER

export const transferLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: 10,

  message: {
    success: false,
    message: "Transfer limit exceeded. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

// PUBLIC API LIMITER

export const publicApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: 100,

  message: {
    success: false,
    message: "Too many requests. Slow down.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});
