"use client";
import SideBar from "@/components/commons/sidebar/Sidebar";
import { useState } from "react";

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
        className={`flex-1 px-6 py-7 rounded-tl-[20px] min-h-[100vh] overflow-x-auto bg-[#F9F9F9] ml-[227px] z-auto relative`}
      >
        {children}
      </div>
    </div>
  );
}
