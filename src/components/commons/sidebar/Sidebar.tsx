"use client";
import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconMessage,
  IconHistory,
  MilwaukeeLogo,
  IconSettings,
  IconPageName,
} from "../../../assets/images";
import Image from "next/image";

const SideBar = () => {
  const pathname = usePathname();

  //const isActive = (link: string) => pathname === link;
  //const isActive = (link: string) => pathname.startsWith(link);

  const isActive = (link: string) => {
    // Check if the path name is exactly the same as the link for exact paths
    if (link === "/") {
      return pathname === link; // Exact match for Home route
    }
    return pathname?.startsWith(link); // Starts with for other routes
  };

  return (
    <div className="px-2 w-[227px] fixed h-full bg-[#141414] z-[2] flex flex-col justify-between pb-14">
      <div>
        <Image alt="" src={MilwaukeeLogo} className="mx-auto py-6" />

        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm p-4 py-3 rounded-lg menu-item ${
                isActive("/") ? "menu-item-active" : "menu-item-transition"
              }`}
            >
              <Image alt="" src={IconHome} />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/messages"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm p-4 py-3 rounded-lg menu-item ${
                isActive("/messages")
                  ? "menu-item-active"
                  : "menu-item-transition"
              }`}
            >
              <Image alt="" src={IconMessage} /> Message
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm p-4 py-3 rounded-lg menu-item ${
                isActive("/history")
                  ? "menu-item-active"
                  : "menu-item-transition"
              }`}
            >
              <Image alt="" src={IconHistory} /> History
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              href="/admin/settings"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm p-4 py-3 rounded-lg menu-item ${
                isActive("/admin/settings")
                  ? "menu-item-active"
                  : "menu-item-transition"
              }`}
            >
              <Image alt="" src={IconSettings} />
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm p-4 py-3 rounded-lg menu-item ${
                isActive("/login") ? "menu-item-active" : "menu-item-transition"
              }`}
            >
              <Image alt="" src={IconPageName} /> Log Out
            </Link>
          </li>
          <li className="inline-flex w-full gap-5 items-center text-white font-normal text-sm p-4 py-3">
            <div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-xs">Doron Smith</p>
              <p className="text-xs font-normal">Branch Name</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
