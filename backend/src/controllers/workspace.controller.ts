import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { changeMemberRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { changeMemberRoleService, createWorkspaceService, deleteWorkspaceByIdService, getAllWorkspacesUserisMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService, updateWorkspaceByIdService } from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { Permissions } from "../enums/role.enums";
import { roleGuard } from "../utils/roleGuard";
import { InternalServerException } from "../utils/appError";

export const createWorkspacesController = asyncHandler
    (
        async (req: Request, res: Response) => {
            const body = createWorkspaceSchema.parse(req.body);

            const userId = req.user?._id;
            const { workspace } = await createWorkspaceService(userId, body);


            return res.status(HTTPSTATUS.CREATED).json({
                message: "Workspace created successfully",
                workspace
            })
        }
    );

export const getAllWorkspacesUserisMemberController = asyncHandler
    (
        async (req: Request, res: Response) => {
            const userId = req.user?._id;
            const workspaces = await getAllWorkspacesUserisMemberService(userId);

            return res.status(HTTPSTATUS.OK).json({
                message: "User All Workspaces retrieved successfully",
                workspaces
            });
        }
    );

export const getWorkspaceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const role_workspace = await getMemberRoleInWorkspaceService(userId, workspaceId);
        const memberConfirmedworkspace = role_workspace?.workspace;
        if (!memberConfirmedworkspace) {
            throw new InternalServerException;
        }

        const workspace = await getWorkspaceByIdService(workspaceId, memberConfirmedworkspace);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace retrieved successfully",
            workspace
        });
    });

export const getWorkspaceMembersController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const role_workspace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workspace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { members, roles } = await getWorkspaceMembersService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace members retrieved successfully",
            members,
            roles
        });

    });

export const getWorkspaceAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        await getMemberRoleInWorkspaceService(userId, workspaceId);

        const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace analytics retrieved successfully",
            analytics
        });
    });

export const changeWorkspaceMemberRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const { memberId, newRoleId } = changeMemberRoleSchema.parse(req.body);

        const role_workspace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workspace?.roleName;
        if (!role) {
            throw new InternalServerException;
        }
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { updatedMember } = await changeMemberRoleService(workspaceId, memberId, newRoleId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Member role changed successfully",
            updatedMember
        });
    })

export const updateWorkspceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const { name, description } = updateWorkspaceSchema.parse(req.body);

        const role_workspace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workspace?.roleName;
        roleGuard(role, [Permissions.EDIT_WORKSPACE]);

        const workspace = role_workspace?.workspace;
        if (!workspace) {
            throw new InternalServerException;
        }

        if (workspace.name === name && workspace.description === description) {
            return res.status(HTTPSTATUS.OK).json({
                message: "No change in workspace needed",
                workspace
            });
        }

        const { updatedWorkspace } = await updateWorkspaceByIdService(workspace, name, description);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace updated successfully",
            updatedWorkspace
        });
    });

export const deleteWorkspaceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const role_workspace = await getMemberRoleInWorkspaceService(userId, workspaceId);

        const role = role_workspace?.roleName;
        roleGuard(role, [Permissions.DELETE_WORKSPACE]);

        const { currentWorkspace } = await deleteWorkspaceByIdService(workspaceId, userId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace deleted successfully",
            currentWorkspace
        });
    });