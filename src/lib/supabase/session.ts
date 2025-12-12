"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { SessionData } from "@/types";

const JWT_SECRET =
  process.env.JWT_SECRET || "b3a7a03fd2b3813fc8c7e361644b62b612af2d1c";

const COOKIE_NAMES: Record<string, string> = {
  ADMIN: "a-session",
  MANUFACTURER: "m-session",
  DEALER: "d-session",
  CUSTOMER: "c-session",
};

function getCookieName(role: string): string {
  return COOKIE_NAMES[role] || "auth-session";
}

export async function createSession(data: SessionData) {
  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: "1d",
  });

  const cookieStore = await cookies();
  const cookieName = getCookieName(data.role);

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1,
    path: "/",
  });

  return token;
}

export async function getSession(role?: string): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();

    // If role is specified, get that specific session
    if (role) {
      const cookieName = getCookieName(role);
      const token = cookieStore.get(cookieName)?.value;

      if (!token) {
        return null;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
      return decoded;
    }

    // If no role specified, try all cookies and return the first valid one
    for (const cookieName of Object.values(COOKIE_NAMES)) {
      const token = cookieStore.get(cookieName)?.value;
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
          return decoded;
        } catch {}
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function destroySession(role: string) {
  const cookieStore = await cookies();
  const cookieName = getCookieName(role);
  cookieStore.delete(cookieName);
}

export async function getCurrentUser(role?: string): Promise<SessionData> {
  const session = await getSession(role);

  if (!session) {
    throw new Error("Unauthorized - No session found");
  }

  return session;
}

export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession(role);
  return session?.role === role;
}
