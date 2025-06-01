import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models";
import { flattenZodErrors } from "../utils/helper";
import { createUserTaskDto, updateUserMoodDto } from "../dtos/user.dto";
import { CustomError } from "../errors/CustomError";
import UserService from "../services/user.service";

class UserController {
  private readonly userService: UserService = new UserService();

  constructor() {}

  public getUserInfo = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const user = await this.userService.getUserById(user_id);
      res.status(200).json({
        status_code: 200,
        message: "User details fetched successfully",
        data: user,
      });
    }
  );

  public setUserMood = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const validatedBody = updateUserMoodDto.safeParse(req.body);

      if (!validatedBody.success) {
        const errorMessages = flattenZodErrors(validatedBody.error);
        throw new CustomError("Validation failed", 400, errorMessages);
      }

      const moodData = {
        ...validatedBody.data,
      };

      await this.userService.setUserMood(moodData, user_id);
      res.status(200).json({
        status_code: 201,
        message: "Mood updated successfully",
      });
    }
  );

  public createTask = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const validatedBody = createUserTaskDto.safeParse(req.body);

      if (!validatedBody.success) {
        const errorMessages = flattenZodErrors(validatedBody.error);
        throw new CustomError("Validation failed", 400, errorMessages);
      }

      const taskData = {
        ...validatedBody.data,
      };

      const newTask = await this.userService.createTask(taskData, user_id);
      res.status(201).json({
        status_code: 201,
        message: "Task created successfully",
        data: newTask,
      });
    }
  );

  public getTasks = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const mood = req.query.mood;
      const tasks = await this.userService.getTasksByUserId(user_id, mood);
      res.status(200).json({
        status_code: 200,
        message: "Tasks fetched successfully",
        data: tasks,
      });
    }
  );

  public getTaskById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { taskId } = req.params;
      const task = await this.userService.getTaskById(user_id, taskId);
      res.status(200).json({
        status_code: 200,
        message: "Task fetched successfully",
        data: task,
      });
    }
  );

  public updateTask = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { taskId } = req.params;
      const validatedBody = createUserTaskDto.safeParse(req.body);

      if (!validatedBody.success) {
        const errorMessages = flattenZodErrors(validatedBody.error);
        throw new CustomError("Validation failed", 400, errorMessages);
      }

      const taskData = {
        ...validatedBody.data,
      };

      const updatedTask = await this.userService.updateTaskById(
        user_id,
        taskId,
        taskData
      );
      res.status(200).json({
        status_code: 200,
        message: "Task updated successfully",
        data: updatedTask,
      });
    }
  );

  public deleteTask = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { taskId } = req.params;
      const data = await this.userService.deleteTaskById(user_id, taskId);
      res.status(200).json({
        status_code: 200,
        message: "Task deleted successfully",
        data,
      });
    }
  );

  public updateUsername = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { username } = req.body;

      const updatedUser = await this.userService.updateUsername(
        user_id,
        username
      );
      res.status(200).json({
        status_code: 200,
        message: "Username updated successfully",
        data: updatedUser,
      });
    }
  );

  public updateUserTheme = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { theme } = req.body;

      await this.userService.updateUserTheme(user_id, theme);
      res.status(200).json({
        status_code: 200,
        message: `Theme updated to ${theme} successfully`,
      });
    }
  );
}

export default UserController;
