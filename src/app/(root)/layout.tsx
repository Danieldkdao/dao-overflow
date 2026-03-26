import { Navbar } from "@/components/navigation/navbar/navbar";
import { RightSidebar } from "@/components/navigation/right-sidebar";
import { LeftSidebar } from "@/components/navigation/sidebar/left-sidebar";
import "@mdxeditor/editor/style.css";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="flex flex-1 h-full overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default RootLayout;
