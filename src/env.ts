import dotenv from "dotenv";
dotenv.config();

interface Env {
  DATABASE_URL: string;
  PORT: number;
  SESSION_SECRET: string;
  SESSION_NAME: string;
  SESSION_MAX_AGE_HOURS: number;
}

const env: Env = {
  DATABASE_URL: process.env["DATABASE_URL"]!,
  PORT: Number(process.env["PORT"]) || 3000,
  SESSION_SECRET: process.env["SESSION_SECRET"]!,
  SESSION_NAME: process.env["SESSION_NAME"] || "sessionId",
  SESSION_MAX_AGE_HOURS: Number(process.env["SESSION_MAX_AGE_HOURS"]) || 24,
};

// Validate environment variables that do not have a default value
if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set");
}

export default env;
