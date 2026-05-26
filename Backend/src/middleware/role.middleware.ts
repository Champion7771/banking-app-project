import { NextFunction, Response } from "express";
import AppError from "../utils/AppError";
import { AuthRequest } from "./auth.middleware";

export const authorizeRoles =
  (...roles: string[]) =>
  (
    req: AuthRequest,

    res: Response,

    next: NextFunction,
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
