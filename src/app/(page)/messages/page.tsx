"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { USER_ROLE } from "@/lib/constants";

const Page = () => {
  const { data: session } = useSession();
  if (session && session?.user?.primaryRole !== USER_ROLE.ADMIN) {
    redirect("/messages/new-message");
  }
  return (
    <div className="p-6 bg-[#F9F9F9] rounded-md border border-gray-300">
      Please select an option from the menu on the left
    </div>
  );
};

export default Page;
