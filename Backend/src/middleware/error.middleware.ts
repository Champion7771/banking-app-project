import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("ERROR =>", err);

  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  let errors: Record<string, string> | undefined;

  // ZOD VALIDATION ERROR
  if (err instanceof ZodError) {
    errors = {};

    err.issues.forEach((issue) => {
      const field = String(issue.path[0]);

      if (!errors![field]) {
        errors![field] = issue.message;
      }
    });

    message = err.issues.map((issue) => issue.message).join(", ");

    statusCode = 400;
  }

  // MONGOOSE VALIDATION ERROR
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");

    statusCode = 400;
  }

  // MONGOOSE CAST ERROR
  if (err.name === "CastError") {
    message = "Invalid ID";

    statusCode = 400;
  }

  // DUPLICATE KEY ERROR
  if (err.code === 11000) {
    message = "Duplicate field value";

    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export default globalErrorHandler;
