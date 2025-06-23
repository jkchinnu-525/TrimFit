import { SignJWT, jwtVerify } from "jose";

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

const SECRET = process.env.JWT_SECRET;
const key = new TextEncoder().encode(SECRET);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    if (!session || session.trim() === "") return null;
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
