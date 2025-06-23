import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/app/api/auth";

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return { success: true };
}

export async function verifySession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  if (!session?.userId) {
    return { isAuth: false };
  }
  return { isAuth: true, userId: session.userId };
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);
  if (!session || !payload) {
    return null;
  }
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const updatedSession = await encrypt({
    userId: payload.userId as string,
    expiresAt: expires,
  });
  return { updatedSession, expires };
}

export async function deleteSession() {
  (await cookies()).delete("session");
  return { success: true };
}
