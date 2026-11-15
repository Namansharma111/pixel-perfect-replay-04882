import { Router } from "express";
import {
  authenticateUser,
  createPasswordResetToken,
  validateResetToken,
  resetPasswordWithToken,
  verifyToken,
} from "../storage/cms-storage.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: "Email and password are required." });
      return;
    }

    const result = authenticateUser(email, password);
    if (!result.ok) {
      res.status(401).json({
        success: false,
        error: result.error || "Invalid email or password.",
        locked: result.locked,
        remainingAttempts: result.remainingAttempts,
      });
      return;
    }

    res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to authenticate." });
  }
});

authRouter.get("/me", requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

authRouter.post("/verify", (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ success: false, error: "Token is required." });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: "Invalid token" });
    return;
  }
  res.json({ success: true, user: payload });
});

authRouter.post("/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: "Email is required." });
      return;
    }
    const result = createPasswordResetToken(email);
    if (!result.ok) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }
    res.json({
      success: true,
      message: "If that email is registered, password reset instructions have been generated.",
      token: result.token,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

authRouter.post("/validate-reset-token", (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ success: false, error: "Reset token is required." });
    return;
  }
  const result = validateResetToken(token);
  if (!result.ok) {
    res.status(400).json({ success: false, error: result.error });
    return;
  }
  res.json({ success: true, email: result.email });
});

authRouter.post("/reset-password", (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ success: false, error: "Token and new password are required." });
      return;
    }
    const result = resetPasswordWithToken(token, newPassword);
    if (!result.ok) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    res.json({ success: true, message: "Password updated successfully. You can now sign in." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
