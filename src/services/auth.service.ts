import mongoose from "mongoose";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
import { CustomError } from "../errors/CustomError";
import { User } from "../models";
import { generateJwt, verifyJwt } from "../utils/helper";
import { checkPasswordStrength } from "../utils/passwordHandler";
import EmailService from "./email.service";
import { Logger } from "../utils/logger";

interface UserResponse {
  email?: string;
  data?: {
    access_token: string;
    refresh_token: string;
  };
  created_at?: Date;
}

class AuthService {
  private readonly ACCESS_TOKEN_VALIDITY: string = "24h";
  private readonly REFRESH_TOKEN_VALIDITY: string = "7d";
  private readonly emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public registerUserService = async (
    userData: CreateUserDto
  ): Promise<UserResponse> => {
    const { email, password, username } = userData;

    const passwordStrength = checkPasswordStrength(password);

    if (!passwordStrength.isStrong) {
      throw new CustomError(
        "Password does not meet strength requirements",
        400,
        passwordStrength.missing
      );
    }

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      throw new CustomError("Email or username already exists", 409);
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      throw new CustomError("Username already exists", 409);
    }

    const newUser = new User({
      ...userData,
    });
    const savedUser = await newUser.save();

    const payload = {
      email: savedUser.email,
      username: savedUser.username,
      user_id: savedUser._id,
    };

    const accessToken = generateJwt(payload, this.ACCESS_TOKEN_VALIDITY);
    const refreshToken = generateJwt(payload, this.REFRESH_TOKEN_VALIDITY);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  };

  public loginUserService = async (
    loginInfo: LoginUserDto
  ): Promise<UserResponse> => {
    const { username, password } = loginInfo;

    const user = await User.findOne({ username });
    if (!user) {
      throw new CustomError("User with username not found", 404);
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      throw new CustomError("Incorrect password", 401);
    }

    const payload = {
      email: user.email,
      user_id: user._id,
    };
    const accessToken = generateJwt(payload, this.ACCESS_TOKEN_VALIDITY);
    const refreshToken = generateJwt(payload, this.REFRESH_TOKEN_VALIDITY);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  };

  public async getAccessTokenService(
    refreshToken: string
  ): Promise<string | false> {
    const decoded = verifyJwt(refreshToken);

    if (!decoded || typeof decoded !== "object") {
      return false;
    }

    const { email, user_id } = decoded;

    const accessToken = generateJwt(
      { email, user_id },
      this.ACCESS_TOKEN_VALIDITY
    );

    Logger.info(`ACCESS TOKEN REQUESTED BY: ${user_id}`);

    return accessToken;
  }
}

export default AuthService;
