"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
//import { useParams } from "next/navigation";

import FormBuildMessage from "@/components/screens/templates/BuildTemplate/FormBuildMessage";
import { dataTickets } from "@/app/(page)/home/mock/dataTickets";

const Page = () => {
  //const params = useParams();
  const elementId = 1; //params?.id ?? "";
  const ticket = dataTickets.filter((item) => item.id === +elementId)[0] ?? 1;
  return (
    <div>
      <div className="flex justify-between gap-3 mb-6">
        <h2 className="font-bold text-2xl">New Message</h2>
        <div className="text-customRed-v1 font-semibold text-sm">
          <Link
            href="/messages/new-message"
            className=" flex gap-2 items-center"
          >
            <ArrowLeft /> Go back to templates
          </Link>
        </div>
      </div>

      {ticket && <FormBuildMessage isFromModal={false} ticket={ticket} />}
    </div>
  );
};

export default Page;
