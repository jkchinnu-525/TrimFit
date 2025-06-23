import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./app/api/auth";
import { updateSession } from "./lib/session";

const protectedRoutes = ["/", "/chat", "/conversations"];
const publicRoutes = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (isProtectedRoute) {
      if (!session?.userId) {
        return NextResponse.redirect(new URL("/signin", req.nextUrl));
      }

      const updated = await updateSession();
      const response = NextResponse.next();
      if (updated) {
        response.cookies.set("session", updated.updatedSession, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: updated.expires,
          sameSite: "lax",
          path: "/",
        });
      }
      return response;
    }

    if (isPublicRoute && session?.userId && path !== "/") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
