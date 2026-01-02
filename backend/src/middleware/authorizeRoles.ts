import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../modules/types.js";

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    const authUser = (req as any).user;

    if (!authUser || !allowedRoles.includes(authUser.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}
