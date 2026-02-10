import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { InternalServerException } from "../utils/appError";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enums";
import { createProjectService, deleteProjectService, getAllProjectsInWorkspaceService, getAllUserProjectsInWorkspaceService, getProjectWithIdInWorkspaceAnalyticsService, getProjectWithIdInWorkspaceService, updateProjectService } from "../services/project.service";
import { HTTPSTATUS } from "../config/http.config";

export const createProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;
        const projectData = createProjectSchema.parse(req.body);

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.CREATE_PROJECT]);

        const { project } = await createProjectService(workspaceId, projectData, userId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Project created successfully",
            project
        });
    })

export const getAllProjectsInWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;

        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);
        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { projects, totalCount, totalPages, skip } = await getAllProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

        return res.status(HTTPSTATUS.OK).json({
            message: "Projects retrieved successfully",
            projects,
            pagination: {
                totalCount,
                pageSize,
                pageNumber,
                skip,
                totalPages,
                limit: pageSize
            }
        });
    });

export const getAllUserProjectsInWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;

        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);
        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { projects, totalCount, totalPages, skip } = await getAllUserProjectsInWorkspaceService(workspaceId, pageSize, pageNumber, userId);

        return res.status(HTTPSTATUS.OK).json({
            message: "User Projects retrieved successfully",
            projects,
            pagination: {
                totalCount,
                pageSize,
                pageNumber,
                skip,
                totalPages,
                limit: pageSize
            }
        });
    });

export const getProjectWithIdInWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);
        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { project } = await getProjectWithIdInWorkspaceService(projectId, workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Project retrieved successfully",
            project
        });
    });

export const getProjectWithIdInWorkspaceAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);
        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getProjectWithIdInWorkspaceAnalyticsService(projectId, workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Project analytics retrieved successfully",
            analytics
        });
    });

export const updateProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;
        const projectData = updateProjectSchema.parse(req.body);

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.EDIT_PROJECT]);

        const { updatedproject } = await updateProjectService(workspaceId, projectId, projectData);
        return res.status(HTTPSTATUS.OK).json({
            message: "Project updated successfully",
            updatedproject
        });
    });

export const deleteProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;

        const role_workpace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workpace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.DELETE_PROJECT]);

        await deleteProjectService(workspaceId, projectId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Project deleted successfully"
        });
    });