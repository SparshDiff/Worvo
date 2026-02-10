import { createContext, useContext } from "react";

// Define the context shape
export type AuthContextType = {
    workspaceId: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useCurrentUserContext must be used within a AuthProvider");
    }
    return context;
};

export default useAuthContext;