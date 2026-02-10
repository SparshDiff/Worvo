import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useTheme, { Theme } from "@/context/theme-context"



function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button size="sm" className="border-2 dark:border-none" variant="secondary">
                    
                    <Sun fill=" #FF8100" color=" #FF8100" className="h-5 w-5 dark:hidden" />
                    <Moon fill="#F6F1D5" color="#F6F1D5" className="h-5 w-5 hidden dark:block" />

                    <span className="hidden capitalize sm:flex font-medium">
                        {theme}
                    </span>

                    <span className="sr-only">Toggle theme</span>

                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="mr-5 bg-secondary rounded-lg" >

                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup value={theme} onValueChange={(value) => (setTheme(value as Theme))}>
                    <DropdownMenuRadioItem className="focus:bg-foreground focus:text-background" value="light" >Light</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="focus:bg-foreground focus:text-background" value="dark">Dark</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="focus:bg-foreground focus:text-background" value="system">System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeToggle;


// import { Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {  useTheme } from "@/context/theme-context";

// const ThemeToggle = () => {
//     const { theme, toggleTheme } = useTheme();

//     return (
//         <Button variant="ghost" size="icon" onClick={toggleTheme}>
//             {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//         </Button>
//     );
// };

// export default ThemeToggle;

