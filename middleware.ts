import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const GUEST_ONLY_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const AUTH_REQUIRED_PATHS = ["/cart", "/checkout", "/orders"];

const ADMIN_ONLY_PATHS = ["/dashboard"];

function matchesPath(path: string, patterns: string[]) {
  return patterns.some((pattern) => path.startsWith(pattern));
}

async function verifyJWT(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 🔹 Log cookies in production
  if (process.env.NODE_ENV === "production") {
    console.log("🔍 Incoming cookies:", req.cookies.getAll());
    console.log("🔍 Request path:", pathname);
  }

  const payload = await verifyJWT(token);
  const isLoggedIn = !!payload;
  const role = payload?.role;

  console.log("Auth check → isLoggedIn:", isLoggedIn, "role:", role);

  // 1. Redirect logged-in users away from guest-only pages
  if (isLoggedIn && matchesPath(pathname, GUEST_ONLY_PATHS)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Require login for protected pages
  if (!isLoggedIn && matchesPath(pathname, AUTH_REQUIRED_PATHS)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 3. Admin-only pages
  if (matchesPath(pathname, ADMIN_ONLY_PATHS)) {
    if (!isLoggedIn || role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|public).*)"],
};
