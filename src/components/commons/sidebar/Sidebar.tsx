"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { MilwaukeeLogo, IconPageName } from "../../../assets/images";
import Image from "next/image";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  CircleUser,
  History,
  House,
  MessageSquare,
  Settings,
} from "lucide-react";
import { USER_ROLE } from "@/lib/constants";
import { capitalizeFirstLetterOfEveryWord, isMobile } from "@/lib/utils/utils";

type Props = {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBar = ({ setIsSidebarOpen }: Props) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  //const [isOpen, setIsOpen] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  //const isActive = (link: string) => pathname === link;
  //const isActive = (link: string) => pathname.startsWith(link);
  const isActive = (link: string) => {
    // Check if the path name is exactly the same as the link for exact paths
    if (link === "/") {
      return pathname === link; // Exact match for Home route
    }
    return pathname?.startsWith(link); // Starts with for other routes
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if there is a value in localStorage
      const storedSidebarState = localStorage.getItem("sidebarOpen");

      if (storedSidebarState !== null) {
        // If there is a value in localStorage, use it
        const isOpenState = storedSidebarState === "true";
        setIsOpen(isOpenState);
        setIsSidebarOpen(isOpenState);
      } else {
        // If there is no value in localStorage, set the state to whether it is mobile or not
        const defaultState = !isMobile(); // Visible on desktop, collapsed on mobile
        setIsOpen(defaultState);
        setIsSidebarOpen(defaultState);
        localStorage.setItem("sidebarOpen", JSON.stringify(defaultState));
      }
    }
  }, [setIsSidebarOpen]);

  const handleToggleSideBar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  const handleSignOut = async () => {
    //Cookies.remove("session-token");

    //This ensures that the cookie is deleted throughout the application.
    Cookies.remove("session-token", { path: "/" });

    // Get the base URL dynamically
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    await signOut({ redirect: true, callbackUrl: `${baseUrl}/login` });
  };

  return (
    <div
      className={`px-2 transition-all duration-300 ease-in-out ${
        isOpen ? "w-[227px]" : "w-[60px]"
      }  fixed h-full bg-[#141414] z-[2] flex flex-col justify-between pb-14`}
    >
      <div>
        <div className="bg-red text-white flex justify-end pt-3">
          {isOpen ? (
            <ArrowLeftToLine
              className="cursor-pointer"
              onClick={handleToggleSideBar}
            />
          ) : (
            <ArrowRightToLine
              className="cursor-pointer"
              onClick={handleToggleSideBar}
            />
          )}
        </div>
        <Image
          alt=""
          src={MilwaukeeLogo}
          className={`mx-auto py-6 ${!isOpen ? "opacity-0" : ""}`}
        />

        <ul className={`${isOpen ? "space-y-1" : "space-y-3"}`}>
          <li className="relative group">
            <Link
              href="/"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm ${
                isOpen ? "p-4 py-3 " : "p-2 py-2 justify-center"
              } rounded-lg menu-item ${
                isActive("/") ? "menu-item-active" : "menu-item-transition"
              }`}
            >
              <House
                className={`w-4 ${
                  isActive("/") && !isOpen ? "text-white" : "text-[#B8B8B8]"
                } `}
              />

              <span
                className={`${
                  !isOpen
                    ? "hidden group-hover:block absolute left-[50px] bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap"
                    : ""
                }`}
              >
                Home
              </span>
            </Link>
          </li>

          <li className="relative group">
            <Link
              href="/messages"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm ${
                isOpen ? "p-4 py-3 " : "p-2 py-2 justify-center"
              } rounded-lg menu-item ${
                isActive("/messages")
                  ? "menu-item-active"
                  : "menu-item-transition"
              }`}
            >
              <MessageSquare
                className={`w-4 ${
                  isActive("/messages") && !isOpen
                    ? "text-white"
                    : "text-[#B8B8B8]"
                } `}
              />
              <span
                className={`${
                  !isOpen
                    ? "hidden group-hover:block absolute left-[50px] bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap"
                    : ""
                }`}
              >
                Message
              </span>
            </Link>
          </li>
          <li className="relative group">
            <Link
              href="/history"
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm ${
                isOpen ? "p-4 py-3 " : "p-2 py-2 justify-center"
              }  rounded-lg menu-item ${
                isActive("/history")
                  ? "menu-item-active"
                  : "menu-item-transition"
              }`}
            >
              <History
                className={`w-4 ${
                  isActive("/history") && !isOpen
                    ? "text-white"
                    : "text-[#B8B8B8]"
                } `}
              />

              <span
                className={`${
                  !isOpen
                    ? "hidden group-hover:block absolute left-[50px] bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap"
                    : ""
                }`}
              >
                History
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          {session && session?.user?.primaryRole === USER_ROLE.ADMIN && (
            <li className="relative group">
              <Link
                href="/admin/settings"
                className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm ${
                  isOpen ? "p-4 py-3 " : "p-2 py-2 justify-center"
                } rounded-lg menu-item ${
                  isActive("/admin/settings")
                    ? "menu-item-active"
                    : "menu-item-transition"
                }`}
              >
                <Settings
                  className={`w-4 ${
                    isActive("/admin/settings") && !isOpen
                      ? "text-white"
                      : "text-[#B8B8B8]"
                  } `}
                />

                <span
                  className={`${
                    !isOpen
                      ? "hidden group-hover:block absolute left-[50px] bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap"
                      : ""
                  }`}
                >
                  Settings
                </span>
              </Link>
            </li>
          )}
          <li className="relative group">
            <span
              className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm cursor-pointer ${
                isOpen ? "p-4 py-3 " : "p-2 py-2 justify-center"
              } rounded-lg menu-item menu-item-transition`}
              onClick={handleSignOut}
            >
              <Image alt="" src={IconPageName} />

              <span
                className={`${
                  !isOpen
                    ? "hidden group-hover:block absolute left-[50px] bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap"
                    : ""
                }`}
              >
                Log Out
              </span>
            </span>
          </li>

          <li
            className={`inline-flex w-full gap-5 items-center text-white font-normal text-sm ${
              isOpen ? "p-4 py-3 " : "p-2 py-2 justify-center"
            }`}
          >
            <div>
              <CircleUser />
            </div>
            {isOpen && (
              <div className="space-y-2">
                <p className="font-bold text-xs">
                  {capitalizeFirstLetterOfEveryWord(session?.user.name)}
                </p>
                <p className="text-xs font-normal">
                  {session?.user.branch.name}
                </p>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
