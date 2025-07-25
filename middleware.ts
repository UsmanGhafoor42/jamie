import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// List of routes that should only be accessible to guests (not logged in)
const GUEST_ONLY_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// List of routes that require authentication
const AUTH_REQUIRED_PATHS = [
  "/cart",
  "/checkout",
  "/orders",
  // add more protected routes as needed
];

// Helper to check if path matches any in a list
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
  const isLoggedIn = !!(await verifyJWT(token));

  // 1. Redirect logged-in users away from guest-only pages
  if (isLoggedIn && matchesPath(pathname, GUEST_ONLY_PATHS)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Require login for protected pages
  if (!isLoggedIn && matchesPath(pathname, AUTH_REQUIRED_PATHS)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 3. Allow all other requests
  return NextResponse.next();
}

// Apply middleware to all routes except static, _next, and api
export const config = {
  matcher: ["/((?!_next|favicon.ico|api|public).*)"],
};
