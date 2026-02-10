import { PermissionType, RoleType } from "../enums/role.enums";
import { ForbiddenException } from "./appError";
import { RolePermissions } from "./role-permission";

export const roleGuard = (
    role: RoleType,
    requiredPermissions: PermissionType[]
) => {
    const permissions = RolePermissions[role];

    const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));

    if (!hasPermission) {
        throw new ForbiddenException("You do not have permission to perform this action");
    }
}
