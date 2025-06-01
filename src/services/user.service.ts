import { User } from "../models";
import { CreateUserTaskDto, UpdateUserMoodDto } from "../dtos/user.dto";
import { CustomError } from "../errors/CustomError";
import Task from "../models/task.model";
import { parseClientDateTime } from "../utils/helper";
import { format } from "date-fns";

class UserService {
  public getUserById = async (user_id: string) => {
    const user = await User.findById(user_id).select(
      "-password -__v -createdAt -updatedAt -_id"
    );
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  };

  public setUserMood = async (
    moodData: UpdateUserMoodDto,
    user_id: string
  ): Promise<string | null> => {
    const { mood } = moodData;
    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (user.mood === mood) {
      throw new CustomError(`Mood is already set to ${mood}`, 400);
    }
    user.mood = mood;
    await user.save();
    return null;
  };

  public createTask = async (taskData: CreateUserTaskDto, user_id: string) => {
    const { date, image, mood, name, priority, time } = taskData;
    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const due = parseClientDateTime(date, time);

    const task = new Task({
      user_id: user._id,
      name,
      due,
      priority,
      mood,
      image,
    });
    await task.save();
    return {
      task_id: task._id,
      name: task.name,
      time: format(task.due, "h:mm a"), // "7:00 AM"
      date: format(task.due, "yyyy-MM-dd"), // "2025-04-17"
      priority: task.priority,
      mood: task.mood,
      image: task.image,
    };
  };

  public getTasksByUserId = async (userId: string, mood: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const query: { user_id: string; mood?: string } = {
      user_id: userId,
    };

    if (mood) {
      query.mood = mood;
    }

    const tasks = await Task.find(query).select("_id name due image mood");

    const cleanedTasks = tasks.map((task, id) => {
      return {
        task_id: task._id,
        name: task.name,
        image: task.image,
        mood: task.mood,
        time: format(task.due, "h:mm a"),
      };
    });

    return cleanedTasks;
  };

  public getTaskById = async (userId: string, taskId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const task = await Task.findOne({
      _id: taskId,
      user_id: user._id,
    }).select("_id name due image mood priority");
    if (!task) {
      throw new CustomError(
        "Task not found or does not belong to this user!",
        404
      );
    }
    return task;
  };

  public updateTaskById = async (
    user_id: string,
    taskId: string,
    taskData: CreateUserTaskDto
  ) => {
    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const { date, image, mood, name, priority, time } = taskData;
    const due = parseClientDateTime(date, time);

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user_id: user._id },
      { name, due, priority, mood, image },
      { new: true }
    ).select("_id name due image mood priority");

    if (!task) {
      throw new CustomError(
        "Task not found or does not belong to this user!",
        404
      );
    }

    return {
      task_id: task._id,
      name: task.name,
      time: format(task.due, "h:mm a"),
      date: format(task.due, "yyyy-MM-dd"),
      priority: task.priority,
      mood: task.mood,
      image: task.image,
    };
  };

  public deleteTaskById = async (userId: string, taskId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user_id: user._id,
    });

    if (!task) {
      throw new CustomError(
        "Task not found or does not belong to this user!",
        404
      );
    }

    return task;
  };

  public updateUsername = async (userId: string, newUsername: string) => {
    const user = await User.findById(userId).select("username");
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (user.username === newUsername) {
      throw new CustomError("New username must be different", 400);
    }
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      throw new CustomError("Username already taken!!!!!!", 400);
    }
    user.username = newUsername;
    await user.save();
    return user;
  };

  public updateUserTheme = async (userId: string, theme: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (user.theme === theme) {
      throw new CustomError(`Theme is already set to ${theme}`, 400);
    }
    user.theme = theme;
    await user.save();
    return null;
  };
}

export default UserService;
