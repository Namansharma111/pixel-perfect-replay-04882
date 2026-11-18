import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const backendPublicHtml = path.join(rootDir, "backend", "public", "index.html");
const rootDestHtml = path.join(distDir, "index.html");

console.log("Running backend build...");
execSync("npm run build --prefix backend", { cwd: rootDir, stdio: "inherit" });

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(backendPublicHtml)) {
  fs.copyFileSync(backendPublicHtml, rootDestHtml);
  console.log("Copied backend/public/index.html to root dist/index.html");
}

console.log("Root build finished with dist/ created.");
