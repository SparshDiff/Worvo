import { useEffect } from "react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Props } from "./query-provider";
import { AuthContext } from "./auth-context";

const AuthProvider = ({ children }: Props) => {
  //const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  useEffect(() => { });

  return (
    <AuthContext.Provider
      value={{
        workspaceId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;