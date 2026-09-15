import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@workspace/api-zod";

const SESSION_COOKIE = "campusos_session";
export const SESSION_COOKIE_NAME = SESSION_COOKIE;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type StoredUser = User & { passwordHash: string };

type SessionRecord = {
  userId: number;
  expiresAt: number;
};

const users = new Map<number, StoredUser>();
const sessions = new Map<string, SessionRecord>();

let nextUserId = 1;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(hash, "hex"), candidate);
}

function toPublic(user: StoredUser): User {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export type CreateUserResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

export function createUser(input: {
  name: string;
  email: string;
  password: string;
  school: string;
  program: string;
  year: string;
}): CreateUserResult {
  const email = input.email.trim().toLowerCase();
  const normalized = input.name.trim().toLowerCase();
  const taken = [...users.values()].some(
    (u) => u.email === email || u.name.trim().toLowerCase() === normalized,
  );
  if (taken) {
    return { ok: false, error: "That name or email is already registered." };
  }

  const stored: StoredUser = {
    id: nextUserId++,
    name: input.name.trim(),
    email,
    school: input.school.trim(),
    program: input.program.trim(),
    year: input.year.trim(),
    passwordHash: hashPassword(input.password),
  };
  users.set(stored.id, stored);
  return { ok: true, user: toPublic(stored) };
}

export type AuthenticateResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

export function authenticate(
  email: string,
  password: string,
): AuthenticateResult {
  const normalized = email.trim().toLowerCase();
  const match = [...users.values()].find((u) => u.email === normalized);
  if (!match || !verifyPassword(password, match.passwordHash)) {
    return { ok: false, error: "Email or password is incorrect." };
  }
  return { ok: true, user: toPublic(match) };
}

export function startSession(userId: number): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

export function resolveSession(token: string | undefined): User | null {
  if (!token) return null;
  const record = sessions.get(token);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  const user = users.get(record.userId);
  return user ? toPublic(user) : null;
}

export function endSession(token: string | undefined): void {
  if (token) sessions.delete(token);
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = resolveSession(req.cookies?.[SESSION_COOKIE]);
  if (!user) {
    res.status(401).json({ error: "You need to be signed in." });
    return;
  }
  req.user = user;
  next();
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export function seedDemoUser(): void {
  createUser({
    name: "Amara Okafor",
    email: "amara@campus.test",
    password: "demo1234",
    school: "University of Lagos",
    program: "Computer Science",
    year: "300 level",
  });
}