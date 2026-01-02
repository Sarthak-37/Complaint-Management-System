import type { Request, Response, NextFunction } from "express";
import { User } from "../modules/auth/user.model.js";

export async function requireVerifiedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Middleware must NOT assume user exists at type level
  const authUser = (req as any).user;

  if (!authUser || !authUser.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(authUser.id);

  if (!user || user.accountStatus !== "ACTIVE") {
    return res.status(403).json({ message: "Account not active" });
  }

  next();
}
