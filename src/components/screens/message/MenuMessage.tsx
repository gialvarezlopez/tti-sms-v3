import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { IconPencil, IconSend, IconTemplates } from "@/assets/images";
import { USER_ROLE } from "@/lib/constants";

const MenuMessage = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  //const isActive = (link: string) => pathname === link;
  const isActive = (link: string) => pathname?.startsWith(link);
  return (
    <ul className="space-y-3">
      <li>
        <Link
          href="/messages/new-message"
          className={`flex gap-2 items-center hover:bg-customPink-v1 hover:rounded-md px-3 text-base py-2 ${
            isActive("/messages/new-message")
              ? "bg-customPink-v1 rounded-md font-bold"
              : ""
          }`}
        >
          <Image alt="" src={IconSend} /> New Message
        </Link>
      </li>
      {session && session?.user?.primaryRole === USER_ROLE.ADMIN && (
        <>
          <li>
            <Link
              href="/messages/create-template"
              className={`flex gap-2 items-center hover:bg-customPink-v1 hover:rounded-md px-3 text-base py-2 ${
                isActive("/messages/create-template")
                  ? "bg-customPink-v1 rounded-md font-bold"
                  : ""
              }`}
            >
              <Image alt="" src={IconPencil} /> Create Template
            </Link>
          </li>
          <li>
            <Link
              href="/messages/templates"
              className={`flex gap-2 items-center hover:bg-customPink-v1 hover:rounded-md px-3 text-base py-2 ${
                isActive("/messages/templates")
                  ? "bg-customPink-v1 rounded-md font-bold"
                  : ""
              }`}
            >
              <Image alt="" src={IconTemplates} />
              Templates
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default MenuMessage;
