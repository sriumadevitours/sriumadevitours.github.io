import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Look for built files in the dist directory (one level up from server/)
  const distPath = path.resolve(__dirname, "..", "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}\n` +
      `Make sure to build the client first with: npm run build`
    );
  }

  // Serve static files from dist with caching
  app.use(express.static(distPath, {
    maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
  }));

  // SPA fallback - serve index.html for all unmatched routes
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
