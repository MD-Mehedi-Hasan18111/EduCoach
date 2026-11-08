import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";

export function getSessionFromRequest(request: NextRequest): TokenPayload | null {
  // Check cookie
  const tokenCookie = request.cookies.get("educoach_token")?.value;
  if (tokenCookie) {
    const payload = verifyToken(tokenCookie);
    if (payload) return payload;
  }

  // Check Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (payload) return payload;
  }

  return null;
}

export function requireSuperAdmin(request: NextRequest): { errorResponse?: NextResponse; session?: TokenPayload } {
  const session = getSessionFromRequest(request);
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Authentication required. Please log in." },
        { status: 401 }
      ),
    };
  }

  if (session.role !== "SUPER_ADMIN") {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Access denied. Super Admin privileges required." },
        { status: 403 }
      ),
    };
  }

  return { session };
}

