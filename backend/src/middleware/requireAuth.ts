import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/jwt.util.js";
import { User } from "../modules/auth/user.model.js";
import type { UserRole } from "../modules/types.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  if(!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = verifyToken(token) as {
      id: string;
      role: UserRole;
    };

    // 🔽 FETCH FULL USER CONTEXT
    const user = await User.findById(decoded.id).select(
      "_id username email role categories"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach FULL AuthUser
    (req as any).user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      categories: user.categories || []
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
