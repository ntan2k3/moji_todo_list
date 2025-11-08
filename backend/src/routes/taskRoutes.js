import express from "express";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskControllers.js";

const taskRouter = express.Router();

// Tạo task
taskRouter.post("/", addTask);

// Lấy task
taskRouter.get("/", getTasks);

// Update task
taskRouter.put("/:id", updateTask);

// Xóa task
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
