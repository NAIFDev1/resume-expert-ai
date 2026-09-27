import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Express } from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import mysql from "mysql2";

// [C-2] SESSION_SECRET is required — no insecure hardcoded fallback
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET environment variable is required. Add it to your .env file."
  );
}
const sessionSecret: string = SESSION_SECRET;

// [H-3] MySQL-backed session store — persists across server restarts
const MySQLStore = MySQLStoreFactory(session);

// express-mysql-session expects a callback-style mysql2 Pool (not mysql2/promise).
// Note: @types/express-mysql-session bundles its own nested mysql2 typings which
// conflict with the project's identical runtime types — cast through the ctor param.
type SessionStoreConnection = ConstructorParameters<typeof MySQLStore>[1];
const sessionConnection: SessionStoreConnection =
  mysql.createPool(process.env.DATABASE_URL!) as unknown as SessionStoreConnection;

const sessionStore = new MySQLStore(
  {
    expiration: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    createDatabaseTable: true,            // auto-create sessions table if missing
    schema: {
      tableName: "sessions",
      columnNames: { session_id: "session_id", expires: "expires", data: "data" },
    },
  },
  sessionConnection
);

export function setupAuth(app: Express) {
  app.use(
session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        httpOnly: true,
        // Only force secure cookies when explicitly enabled (requires HTTPS termination).
        // Local + HTTP Deploy (= NODE_ENV production behind plain proxy) must keep cookies on HTTP.
        secure: process.env.COOKIE_SECURE === "1",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
      store: sessionStore,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

