import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { randomBytes } from "crypto";
import { ZodError } from "zod";
import dotenv from "dotenv";
import { parse } from "date-fns";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generate a 6-character OTP.
 * @returns A random OTP as a string.
 */
const generateOtp = (): string => {
  return randomBytes(3).toString("hex");
};

/**
 * Generate a JWT token with the provided payload.
 * @param payload - Data to encode in the JWT (e.g., { id, email }).
 * @param expireIn - Expiration time
 * @returns A signed JWT token.
 */
const generateJwt = (payload: object, expireIn: any): string => {
  if (!JWT_SECRET) {
    throw new CustomError(
      "JWT_SECRET is not defined in the environment variables.",
      500
    );
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expireIn });
};

/**
 * Verify the provided JWT token and decode its payload.
 * @param token - JWT token to verify.
 * @returns Decoded token payload if valid.
 * @throws CustomError if the token is invalid or expired.
 */
const verifyJwt = (
  token: string
): JwtPayload | { email: string; user_id: string } => {
  try {
    if (!JWT_SECRET) {
      throw new CustomError(
        "JWT_SECRET is not defined in the environment variables.",
        500
      );
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("Token has expired.", 401);
    } else if (error.name === "JsonWebTokenError") {
      throw new CustomError("Invalid token.", 401);
    }
    throw new CustomError("Token verification failed.", 500);
  }
};

/**
 * Calculates the expiry date for an OTP based on the current time and the provided duration.
 *
 * @param {number} minutes - The duration in minutes for which the OTP should be valid.
 * @returns {Date} The calculated expiry date and time.
 *
 * @example
 * // Returns a Date object 10 minutes from now
 * const expiry = calculateOtpExpiry(10);
 */
const calculateOtpExpiry = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

const flattenZodErrors = (error: ZodError): string[] => {
  const recurse = (obj: any): string[] => {
    if (!obj || typeof obj !== "object") return [];

    // Collect errors at the current level
    const errors: string[] = obj._errors ? obj._errors : [];

    // Recurse into nested fields, excluding '_errors'
    return Object.entries(obj)
      .filter(([key]) => key !== "_errors")
      .flatMap(([_, value]) => recurse(value))
      .concat(errors);
  };

  return recurse(error.format()).filter(Boolean);
};

const parseClientDateTime = (dateStr: string, timeStr: string): Date => {
  const dateTimeString = `${dateStr} ${timeStr}`;
  // Parse "17 April 2025 7:00 AM" into a Date object
  return parse(dateTimeString, "d MMMM yyyy h:mm a", new Date());
};

export {
  generateOtp,
  generateJwt,
  verifyJwt,
  calculateOtpExpiry,
  flattenZodErrors,
  parseClientDateTime,
};
