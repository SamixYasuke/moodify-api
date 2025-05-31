import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status_code: err.statusCode,
      message: err.message,
      errors: err.data,
    });
  } else {
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};
