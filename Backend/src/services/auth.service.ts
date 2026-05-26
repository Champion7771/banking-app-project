import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import AppError from "../utils/AppError";
import RefreshToken from "../models/refreshToken.model";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export const registerUserService = async (data: RegisterUserInput) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // after 7 days
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

interface LoginUserInput {
  email: string;
  password: string;
}

export const loginUserService = async (data: LoginUserInput) => {
  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.isBlocked) {
    throw new AppError("Your account is blocked. Please contact support.", 403);
  }

  if (user.isFrozen) {
    throw new AppError("Your account is frozen. Please contact support.", 403);
  }

  const isPasswordMatched = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },

    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // after 7 days
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

interface GetProfileServiceInput {
  userId: string;
}

export const getProfileService = async (data: GetProfileServiceInput) => {
  const user = await User.findById(data.userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
