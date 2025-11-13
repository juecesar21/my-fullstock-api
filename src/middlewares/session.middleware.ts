import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import env from "@/env.js";
import { pool } from "@/db/index.js";

const PgSession = connectPgSimple(session);

const isProduction = process.env["NODE_ENV"] === "production";

const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "sessions",
    createTableIfMissing: false,
    pruneSessionInterval: 60 * 60,
  }),
  name: env.SESSION_NAME,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction,
    maxAge: env.SESSION_MAX_AGE_HOURS * 60 * 60 * 1000,
  },
});

export default sessionMiddleware;
