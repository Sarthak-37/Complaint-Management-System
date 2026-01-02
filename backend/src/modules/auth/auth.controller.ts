import type { Request, Response, NextFunction } from "express";

import {
  verifyEmailService,
  registerUserService,
  resendVerificationEmailService,
  loginUser,
  acceptAuthorityInvite,
  verifyAuthorityInvite
} from "./auth.service.js";
import type { AuthenticatedRequest } from "./types/auth-request.js";

/**
 * Register USER
 * POST /api/auth/register
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      throw new Error("Email, password, and username are required");
    }

    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    if (username.length > 30) {
      throw new Error("Username must not exceed 30 characters");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new Error("Username can only contain letters, numbers, underscores, and hyphens");
    }

    const result = await registerUserService({ email, password, username });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 * GET /api/auth/verify-email
 */
export const verifyEmail = async (
    req : Request, 
    res : Response, 
    next : NextFunction) => {
  try {
    const { token } = req.query;
    if (!token) throw new Error("Verification token missing");

    const result = await verifyEmailService(token as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
export const resendVerificationEmail = async (
    req : Request, 
    res : Response, 
    next : NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    const result = await resendVerificationEmailService(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}

export async function acceptInvite(req: Request, res: Response) {
    const { token, password, username } = req.body;

    if (!token || !password || !username) {
      throw new Error("Token, password, and username are required");
    }

    const result = await acceptAuthorityInvite(
      token,
      password,
      username
    );

    res.status(200).json(result);
  }

export const me = async (
  req: Request,
  res: Response
) => {
  const authReq = req as AuthenticatedRequest;
  res.status(200).json(authReq.user);
};

export async function verifyInviteController(
  req: Request,
  res: Response
) {
  try {
    const { token } = req.query;

    const result = await verifyAuthorityInvite(token as string);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Invalid invite token"
    });
  }
}
