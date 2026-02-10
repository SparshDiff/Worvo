import { ReactNode } from "react";
import { PermissionType } from "@/constant";

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: ReactNode;
  showMessage?: boolean;
};

const PermissionsGuard = ( props: PermissionsGuardProps) => {
  return <></>;
};

export default PermissionsGuard;
