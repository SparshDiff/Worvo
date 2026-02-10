import { z } from "zod";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { joinWorkspaceByInviteCode } from "../services/member.service";
import { HTTPSTATUS } from "../config/http.config";


export const joinWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const inviteCode = z.string().min(1).parse(req.params.inviteCode);
        const userId = req.user?._id;

        const { workspaceId, role } = await joinWorkspaceByInviteCode(userId, inviteCode);

        return res.status(HTTPSTATUS.OK).json({
            message: "Joined the workspace successfully",
            workspaceId,
            role
        });
    }
);