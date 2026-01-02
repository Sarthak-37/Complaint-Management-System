import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const status = err.statusCode || 400;

  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
  });
}
