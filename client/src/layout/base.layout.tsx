import ThemeToggle from "@/components/themeToggle/themeToggle";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {

  return (
    <div className="w-full min-h-svh bg-muted">
      <Outlet />


      {/* Desktop Theme floating button */}
      <div className="hidden sm:block fixed top-2 right-2 z-50 ">
        <ThemeToggle />
      </div>

    </div>
  );
};

export default BaseLayout;
