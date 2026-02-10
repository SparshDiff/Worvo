import { Router } from "express";
import { changeWorkspaceMemberRoleController, createWorkspacesController, deleteWorkspaceByIdController, getAllWorkspacesUserisMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspceByIdController } from "../controllers/workspace.controller";


const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspacesController);

workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRoleController);

workspaceRoutes.put("/update/:id", updateWorkspceByIdController);

workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);

workspaceRoutes.get("/all", getAllWorkspacesUserisMemberController);

workspaceRoutes.get("/members/:id", getWorkspaceMembersController);

workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController);

workspaceRoutes.get("/:id", getWorkspaceByIdController);

export default workspaceRoutes;