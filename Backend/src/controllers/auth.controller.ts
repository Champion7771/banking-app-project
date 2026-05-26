import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { Request, Response } from "express";
import { registerUserService, loginUserService, getProfileService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../utils/validators/auth.validator";
import RefreshToken from "../models/refreshToken.model";

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const result = await registerUserService(validatedData);
  // STORES SHORT-LIVED ACCESS TOKEN
  // Used for protected APIs
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // after 15 minutes
  });
  // STORES LONG-LIVED REFRESH TOKEN
  // Used ONLY to generate new access tokens
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // after 7 days
  });
  res.status(201).json({
    success: true,
    message: "User registered",
    data: result.user,
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await loginUserService(validatedData);
  // ACCESS TOKEN COOKIE
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // after 15 minutes
  });
  // REFRESH TOKEN COOKIE
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // after 7 days
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: result.user,
  });
});

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
    await RefreshToken.deleteOne({
      token: refreshToken,
    });
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
    await RefreshToken.create({
      user: decoded.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // after 7 days
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // after 15 minutes
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // after 7 days
    });
    res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  },
);

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await RefreshToken.deleteOne({
      token: refreshToken,
    });
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getProfile = catchAsync(async (req: any, res: Response) => {
  const result = await getProfileService({ userId: req.user.userId });
  res.status(200).json({
    success: true,
    message: "User profile",
    data: result,
  });
});
