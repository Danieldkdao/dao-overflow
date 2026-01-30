import { Navlinks } from "../navbar/nav-links";
import { SidebarAuthButtons } from "./sidebar-auth-buttons";

export const LeftSidebar = () => {
  return (
    <div className="h-full fixed -translate-x-full transition-all duration-200 ease-in-out sm:static sm:translate-x-0 bg-sidebar flex flex-col overflow-hidden w-60 p-4 border-r">
      <Navlinks />
      <SidebarAuthButtons />
    </div>
  );
};
