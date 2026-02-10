import { Router } from "express";
import { createTaskController, deleteTaskController, getAllTaskController, getTaskByIdController, updateTaskController } from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoutes.put("/:taskId/project/:projectId/workspace/:workspaceId/update", updateTaskController);
taskRoutes.delete("/:taskId/workspace/:workspaceId/delete", deleteTaskController);


taskRoutes.get("/workspace/:workspaceId/all", getAllTaskController);
taskRoutes.get("/:taskId/project/:projectId/workspace/:workspaceId/", getTaskByIdController);

export default taskRoutes;