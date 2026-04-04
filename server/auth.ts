import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export function setupAuth(app: Express) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "khabir-secret-key-2026",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
      store: new MemoryStore({ checkPeriod: 86400000 }),
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
