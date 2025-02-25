"use client";
import SideBar from "@/components/commons/sidebar/Sidebar";
import { useEffect, useState } from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-[#141414] relative">
      <SideBar setIsSidebarOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 px-6 py-7 rounded-tl-[20px] min-h-[100vh]  bg-[#F9F9F9] ${
          isSidebarOpen ? "md:ml-[227px]" : "ml-[65px]"
        } z-auto relative`}
        id="container_message"
      >
        <div className="flex justify-end">
          {isSidebarOpen ? "true" : "false"}
        </div>
        {children}
      </div>
    </div>
  );
}
