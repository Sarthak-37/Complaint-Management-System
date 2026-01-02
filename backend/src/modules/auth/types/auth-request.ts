import type { Request } from "express";
import type { AuthUser } from "../../types.js";

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

/**
 * Runtime-safe helper to extract authenticated user
 * Middleware (requireAuth) guarantees this exists
 */
export function getAuthUser(req: Request): AuthUser {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    // This should never happen if middleware is wired correctly
    throw new Error("Authenticated user missing on request");
  }

  return user;
}
