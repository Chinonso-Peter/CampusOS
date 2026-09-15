import { Router, type IRouter } from "express";
import {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  GetMeResponse,
} from "@workspace/api-zod";
import {
  authenticate,
  clearSessionCookie,
  createUser,
  endSession,
  requireAuth,
  seedDemoUser,
  setSessionCookie,
  startSession,
  SESSION_COOKIE_NAME,
} from "../lib/auth";

const router: IRouter = Router();

function readingCookie(req: unknown): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any)?.cookies?.[SESSION_COOKIE_NAME];
}

router.post("/auth/register", (req, res) => {
  const input = RegisterBody.parse(req.body);
  const result = createUser(input);
  if (!result.ok) {
    res.status(409).json({ error: result.error });
    return;
  }
  const token = startSession(result.user.id);
  setSessionCookie(res, token);
  res.status(201).json(RegisterResponse.parse({ user: result.user }));
});

router.post("/auth/login", (req, res) => {
  const input = LoginBody.parse(req.body);
  const result = authenticate(input.email, input.password);
  if (!result.ok) {
    res.status(401).json({ error: result.error });
    return;
  }
  const token = startSession(result.user.id);
  setSessionCookie(res, token);
  res.json(LoginResponse.parse({ user: result.user }));
});

router.post("/auth/logout", (req, res) => {
  endSession(readingCookie(req));
  clearSessionCookie(res);
  res.status(204).end();
});

router.get("/auth/me", requireAuth, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Not signed in." });
    return;
  }
  res.json(GetMeResponse.parse(req.user));
});

seedDemoUser();

export default router;