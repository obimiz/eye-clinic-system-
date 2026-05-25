import rateLimit from "express-rate-limit";
 
// ─── General rate limiter ─────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per window
  message: {
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
 
// ─── Login rate limiter (stricter) ───────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // max 5 login attempts
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
 
// ─── Password reset limiter ───────────────────────────────────
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,                    // max 3 reset requests per hour
  message: {
    message: "Too many password reset requests. Please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
 
export { generalLimiter, loginLimiter, resetLimiter };