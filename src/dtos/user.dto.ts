import { z } from "zod";

export const createUserDto = z.object({
  username: z
    .string({ required_error: "Username Required" })
    .min(2, "Username must be at least 2 characters long"),
  email: z
    .string({ required_error: "Email Required" })
    .email("Invalid email address"),
  password: z.string({ required_error: "Password Required" }),
});

export const loginUserDto = z.object({
  username: z
    .string({ required_error: "Username Required" })
    .min(2, "Username must be at least 2 characters long"),
  password: z
    .string({ required_error: "Password is Required" })
    .min(1, "Password is Required"),
});

export const updateUserMoodDto = z.object({
  mood: z
    .enum(["energized", "relaxed", "neutral"], {
      required_error: "Mood is required",
    })
    .default("neutral"),
});

export const createUserTaskDto = z.object({
  name: z.string({ required_error: "Task name is required" }),
  time: z.string({ required_error: "Task time is required" }),
  date: z.string({ required_error: "Task date is required" }),
  priority: z.enum(["High", "Medium", "Low"], {
    required_error: "Task priority is required",
    invalid_type_error: "Task priority must be one of High, Medium, Low",
  }),
  mood: z.enum(["Energized", "Neutral", "Tired"], {
    required_error: "Task mood is required",
    invalid_type_error: "Task mood must be one of Energized, Neutral, Tired",
  }),
  image: z
    .string({ required_error: "Task image is required" })
    .url({ message: "Invalid image URL" }),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
export type LoginUserDto = z.infer<typeof loginUserDto>;
export type UpdateUserMoodDto = z.infer<typeof updateUserMoodDto>;
export type CreateUserTaskDto = z.infer<typeof createUserTaskDto>;
