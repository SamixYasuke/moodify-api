import mongoose, { Schema, Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/passwordHandler";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  mood: "energized" | "relaxed" | "neutral";
  theme: "light" | "dark" | string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ["energized", "relaxed", "neutral"],
      default: "neutral",
      required: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      this.password = await hashPassword(this.password);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return verifyPassword(this.password, candidatePassword);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
