import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "educoach_super_secret_master_key_2026_antigravity_platform";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "COACHING_ADMIN" | "TENANT_OWNER";
  name: string;
  tenantId?: string;
  systemSlug?: string;
  coachingName?: string;
  systemUrl?: string;
}

export function signToken(payload: TokenPayload, expiresIn: string = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

