import { describe, it, expect } from "vitest";
import {
  authenticateUser,
  getStore,
  getAllArticles,
  getAllCmsServices,
  getPublicHomepage,
  saveWebsiteLead,
  getAllLeads,
  getDownloaderSettings,
} from "../storage/cms-storage.js";

describe("Social Waale CMS Backend Core Storage & Auth", () => {
  it("authenticates the default administrator securely", () => {
    const auth = authenticateUser("admin@socialwaale.com", "IS4OUe0rx4BfbMpJ!Sw2026");
    expect(auth.ok).toBe(true);
    if (auth.ok) {
      expect(auth.user.email).toBe("admin@socialwaale.com");
      expect(auth.token).toBeDefined();
      expect(typeof auth.token).toBe("string");
    }
  });

  it("rejects invalid credentials with security message", () => {
    const auth = authenticateUser("admin@socialwaale.com", "WrongPassword123!");
    expect(auth.ok).toBe(false);
  });

  it("retrieves published articles from storage", () => {
    const articles = getAllArticles(false);
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  it("retrieves published services from storage", () => {
    const services = getAllCmsServices(false);
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
  });

  it("retrieves public homepage sections", () => {
    const hp = getPublicHomepage();
    expect(hp).toBeDefined();
    expect(hp.hero).toBeDefined();
  });

  it("saves and retrieves website leads cleanly", () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const res = saveWebsiteLead({
      fullName: "Test Lead User",
      phone: "+91 98765 43210",
      email: testEmail,
      service: "SEO Services",
      sourceUrl: "/contact",
      formName: "Contact Page Form",
      formType: "contact",
    });
    expect(res.ok).toBe(true);
    expect(res.lead.fullName).toBe("Test Lead User");

    const allLeads = getAllLeads();
    const found = allLeads.find((l) => l.email === testEmail);
    expect(found).toBeDefined();
  });

  it("loads downloader settings correctly", () => {
    const settings = getDownloaderSettings();
    expect(settings).toBeDefined();
    expect(settings.apiProvider).toBeDefined();
  });
});
