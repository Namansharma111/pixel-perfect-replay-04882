import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicHtml = path.join(rootDir, "public", "index.html");
const destHtml = path.join(distDir, "index.html");

console.log("Compiling TypeScript backend...");
execSync("npx tsc", { cwd: rootDir, stdio: "inherit" });

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(publicHtml)) {
  fs.copyFileSync(publicHtml, destHtml);
  console.log("Copied public/index.html to dist/index.html");
}

console.log("Backend build completed successfully.");
