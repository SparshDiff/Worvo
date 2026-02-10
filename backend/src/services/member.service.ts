import { Types } from "mongoose";
import { ErrorCodeEnum } from "../enums/error-code.enums";
import { Roles } from "../enums/role.enums";
import { Member } from "../models/member.model";
import { Role } from "../models/roles-permission.model";
import { Workspace } from "../models/workspace.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError";

//To confirm user is member of workspace and get workspace details
export const getMemberRoleInWorkspaceService = async (userId: Types.ObjectId, workspaceId: string) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    };

    const member = await Member.findOne({ userId, workspaceId }).populate("role");
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace", ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const roleName = member.role?.name;

    return { roleName, workspace };

}

//To join workspace by invite code
export const joinWorkspaceByInviteCode = async (userId: Types.ObjectId, inviteCode: string) => {
    const workspace = await Workspace.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new NotFoundException("Invalid invite code or workspace not found");
    }

    const existingMember = await Member.findOne({ userId, workspaceId: workspace._id }).exec();
    if (existingMember) {
        throw new BadRequestException("You are already a member of this workspace");
    }

    const role = await Role.findOne({ name: Roles.MEMBER });
    if (!role) {
        throw new NotFoundException("Member Role not found");
    }

    const newMember = new Member({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });
    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
}