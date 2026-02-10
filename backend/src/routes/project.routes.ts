import { Router } from "express";
import { createProjectController, deleteProjectController, getAllProjectsInWorkspaceController, getAllUserProjectsInWorkspaceController, getProjectWithIdInWorkspaceAnalyticsController, getProjectWithIdInWorkspaceController, updateProjectController } from "../controllers/project.controller";

const projectRoutes = Router();
projectRoutes.post("/workspace/:workspaceId/create", createProjectController);
projectRoutes.put("/:projectId/workspace/:workspaceId/update", updateProjectController);
projectRoutes.delete("/:projectId/workspace/:workspaceId/delete", deleteProjectController);

projectRoutes.get("/:projectId/workspace/:workspaceId/analytics", getProjectWithIdInWorkspaceAnalyticsController);
projectRoutes.get("/workspace/:workspaceId/all", getAllProjectsInWorkspaceController);
projectRoutes.get("/workspace/:workspaceId/userProjects", getAllUserProjectsInWorkspaceController);
projectRoutes.get("/:projectId/workspace/:workspaceId", getProjectWithIdInWorkspaceController);

export default projectRoutes;