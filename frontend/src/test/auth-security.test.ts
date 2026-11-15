import { describe, it, expect, beforeEach } from "vitest";
import {
  authenticateUser,
  createPasswordResetToken,
  validateResetToken,
  resetPasswordWithToken,
  hashPasswordSecure,
  verifyPassword,
} from "../lib/cms/cms-storage";

describe("CMS Admin Authentication Security", () => {
  it("strictly rejects the old compromised password", () => {
    const res = authenticateUser("admin@socialwaale.com", "Admin@SocialWaale2026!");
    expect(res.ok).toBe(false);
  });

  it("authenticates successfully with the new secure scrypt password", () => {
    const res = authenticateUser("admin@socialwaale.com", "IS4OUe0rx4BfbMpJ!Sw2026");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.user.email).toBe("admin@socialwaale.com");
      expect(res.token).toBeDefined();
    }
  });

  it("locks the account after 5 consecutive failed login attempts", () => {
    // Attempt 1 to 4 with wrong password
    for (let i = 0; i < 4; i++) {
      const res = authenticateUser("admin@socialwaale.com", "WrongPassword123!");
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.locked).toBeFalsy();
      }
    }

    // 5th failed attempt should trigger lockout
    const fifth = authenticateUser("admin@socialwaale.com", "WrongPassword123!");
    expect(fifth.ok).toBe(false);
    if (!fifth.ok) {
      expect(fifth.locked).toBe(true);
      expect(fifth.error).toContain("locked");
    }

    // Even the correct password should now be blocked while locked
    const blocked = authenticateUser("admin@socialwaale.com", "IS4OUe0rx4BfbMpJ!Sw2026");
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.locked).toBe(true);
    }
  });

  it("allows setting a new private password via secure reset token", () => {
    // 1. Generate reset token
    const tokenRes = createPasswordResetToken("admin@socialwaale.com");
    expect(tokenRes.ok).toBe(true);
    expect(tokenRes.token).toBeDefined();
    const token = tokenRes.token!;

    // 2. Validate token
    const valRes = validateResetToken(token);
    expect(valRes.ok).toBe(true);
    expect(valRes.email).toBe("admin@socialwaale.com");

    // 3. Reset password to custom new password
    const newCustomPass = "MyNewPrivateAdminPass!2026";
    const resetRes = resetPasswordWithToken(token, newCustomPass);
    expect(resetRes.ok).toBe(true);

    // 4. Token is single-use: re-using it must fail
    const reused = resetPasswordWithToken(token, "AnotherPass123!");
    expect(reused.ok).toBe(false);

    // 5. Account lockout is cleared and new custom password works
    const loginRes = authenticateUser("admin@socialwaale.com", newCustomPass);
    expect(loginRes.ok).toBe(true);

    // 6. Restore original generated secure password for normal server operation
    const restoreToken = createPasswordResetToken("admin@socialwaale.com").token!;
    resetPasswordWithToken(restoreToken, "IS4OUe0rx4BfbMpJ!Sw2026");
  });
});
