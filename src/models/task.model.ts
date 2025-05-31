import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  user_id: string;
  name: string;
  due: Date;
  priority: "high" | "medium" | "low";
  mood: "energized" | "neutral" | "tired";
  image:
    | "https://avatar.iran.liara.run/public/45"
    | "https://avatar.iran.liara.run/public/30"
    | "https://avatar.iran.liara.run/public/48"
    | "https://avatar.iran.liara.run/public/65";
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema<ITask> = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    due: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ["energized", "neutral", "tired"],
    },
    image: {
      type: String,
      required: true,
      enum: [
        "https://avatar.iran.liara.run/public/45",
        "https://avatar.iran.liara.run/public/30",
        "https://avatar.iran.liara.run/public/48",
        "https://avatar.iran.liara.run/public/65",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
