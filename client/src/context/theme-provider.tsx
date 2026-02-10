import { useLayoutEffect, useState } from "react"
import { Props } from "./query-provider";
import { Theme, ThemeProviderContext } from "./theme-context";



const ThemeProvider = ({ children }: Props) => {
    const storageKey = "ui-theme";
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || "light"
    )

    const setFavicon = (theme: Theme) => {
        const favicon = document.getElementById("app-favicon") as HTMLLinkElement;
        if (!favicon) return;

        favicon.href =
            theme === "dark"
                ? "/src/assets/logos/logo_dark.svg"
                : "/src/assets/logos/logo_light.svg";
    };

    useLayoutEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            setFavicon(systemTheme)
            return
        }

        root.classList.add(theme)
        setFavicon(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export default ThemeProvider





// import { useEffect, useState } from "react";
// import { Theme, ThemeContext } from "./theme-context";


// const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//     const [theme, setTheme] = useState<Theme>("light");

//     useEffect(() => {
//         const stored = localStorage.getItem("theme") as Theme | null;
//         if (stored) {
//             setTheme(stored);
//             document.documentElement.classList.toggle("dark", stored === "dark");
//             setFavicon(stored);
//         } else {
//             setFavicon("light");
//         }
//     }, []);

//     const setFavicon = (theme:Theme) => {
//         const favicon = document.getElementById("app-favicon") as HTMLLinkElement;
//         if (!favicon) return;

//         favicon.href =
//             theme === "dark"
//                 ? "/src/assets/logo_dark.svg"
//                 : "/src/assets/logo_light.svg";
//     };

//     const toggleTheme = () => {
//         const next = theme === "dark" ? "light" : "dark";
//         setTheme(next);
//         document.documentElement.classList.toggle("dark", next === "dark");
//         localStorage.setItem("theme", next);
//         setFavicon(next);
//     };

//     return (
//         <ThemeContext.Provider value={{ theme, toggleTheme }}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// export default ThemeProvider;