import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("ERROR =>", err);

  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

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
  });
};

export default globalErrorHandler;
