import { LeftSidebar } from "@/components/navigation/sidebar/left-sidebar";
import { Navbar } from "@/components/navigation/navbar/navbar";
import { RightSidebar } from "@/components/navigation/right-sidebar";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="flex flex-1 h-full overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 bg-red-400 overflow-y-auto">{children}</div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default RootLayout;
