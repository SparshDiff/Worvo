import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";

export type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }
    return context;
};

export default useTheme



// // export type ThemeContextType = {
// //     theme: Theme;
// //     toggleTheme: () => void;
// // };

// // export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);