import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { Request, Response } from "express";

import {
  registerUserService,
  loginUserService,
  getProfileService,
} from "../services/auth.service";

import {
  registerSchema,
  loginSchema,
} from "../utils/validators/auth.validator";

import RefreshToken from "../models/refreshToken.model";

/* =========================
   COOKIE OPTIONS
========================= */

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
};

/* =========================
   REGISTER USER
========================= */

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const result = await registerUserService(validatedData);

  // ACCESS TOKEN COOKIE
  res.cookie("accessToken", result.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  // REFRESH TOKEN COOKIE
  res.cookie("refreshToken", result.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "User registered",
    data: result.user,
  });
});

/* =========================
   LOGIN USER
========================= */

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const result = await loginUserService(validatedData);

  // ACCESS TOKEN COOKIE
  res.cookie("accessToken", result.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  // REFRESH TOKEN COOKIE
  res.cookie("refreshToken", result.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: result.user,
  });
});

/* =========================
   REFRESH ACCESS TOKEN
========================= */

export const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as {
      userId: string;
      role: string;
    };

    const existingToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (!existingToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // DELETE OLD TOKEN
    await RefreshToken.deleteOne({
      token: refreshToken,
    });

    // CREATE NEW ACCESS TOKEN
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        role: decoded.role,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      },
    );

    // CREATE NEW REFRESH TOKEN
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
        role: decoded.role,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    // SAVE NEW REFRESH TOKEN
    await RefreshToken.create({
      user: decoded.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ACCESS TOKEN COOKIE
    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    // REFRESH TOKEN COOKIE
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  },
);

/* =========================
   LOGOUT USER
========================= */

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await RefreshToken.deleteOne({
      token: refreshToken,
    });
  }

  res.clearCookie("accessToken", cookieOptions);

  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/* =========================
   GET PROFILE
========================= */

export const getProfile = catchAsync(async (req: any, res: Response) => {
  const result = await getProfileService({
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    message: "User profile",
    data: result,
  });
});
