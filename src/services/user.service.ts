import { User } from "../models";
import { CreateUserTaskDto, UpdateUserMoodDto } from "../dtos/user.dto";
import { CustomError } from "../errors/CustomError";
import Task from "../models/task.model";

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

    const task = new Task({
      user_id: user._id,
      name,
      time,
      date,
      priority,
      mood,
      image,
    });
    await task.save();
    return task;
  };
}

export default UserService;
