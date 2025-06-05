"use client";

import React from "react";
import {
  IconErrorFound,
  IconOverdue,
  IconClosed,
} from "../../../../assets/images";
import { StatsProps } from "@/types/types";
import CardProcess from "./CardProcess";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  dataStats: StatsProps;
};

const statusKeys = {
  error: "Errors Found",
  overdue: "Overdue",
  to_be_overdue: "To Be Overdue",
  in_progress: "Unanswered Tickets",
  closed: "Recently Closed",
};

const Items = ({ dataStats }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams?.get("status")?.split(",") ?? [];

  const toggleStatus = (key: string) => {
    const newStatus = [...currentStatus];
    const index = newStatus.indexOf(key);

    if (index !== -1) {
      // Ya está, quitar
      newStatus.splice(index, 1);
    } else {
      // No está, agregar
      newStatus.push(key);
    }

    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (newStatus.length > 0) {
      params.set("status", newStatus.join(","));
    } else {
      params.delete("status");
    }

    router.push(`?${params.toString()}`);
  };

  const getNumber = (number: number) => {
    return `${number} ${number !== 1 ? "Tickets" : "Ticket"}`;
  };

  const isActive = (key: string) => currentStatus.includes(key);

  return (
    <>
      <div
        className={`cursor-pointer ${
          isActive("error")
            ? "border-2 border-black rounded-lg"
            : "border-black"
        }`}
        onClick={() => toggleStatus("error")}
      >
        <CardProcess
          title={statusKeys.error}
          footer={getNumber(+dataStats?.error)}
          icon={IconErrorFound}
          setClass={"cardErrors"}
        />
      </div>

      <div
        className={`cursor-pointer ${
          isActive("overdue") ? "border-2 border-black rounded-lg" : ""
        }`}
        onClick={() => toggleStatus("overdue")}
      >
        <CardProcess
          title={statusKeys.overdue}
          footer={getNumber(+dataStats?.overdue)}
          icon={IconOverdue}
          setClass={""}
        />
      </div>

      <div
        className={`cursor-pointer ${
          isActive("to_be_overdue") ? "border-2 border-black rounded-lg" : ""
        }`}
        onClick={() => toggleStatus("to_be_overdue")}
      >
        <CardProcess
          title={statusKeys.to_be_overdue}
          footer={getNumber(+dataStats?.toBeOverdue)}
          icon={IconOverdue}
          setClass={""}
        />
      </div>

      <div
        className={`cursor-pointer ${
          isActive("in_progress") ? "border-2 border-black rounded-lg" : ""
        }`}
        onClick={() => toggleStatus("in_progress")}
      >
        <CardProcess
          title={statusKeys.in_progress}
          footer={getNumber(+dataStats?.inProgress)}
          icon={IconOverdue}
          setClass={"cardUnansweredTickets"}
        />
      </div>

      <CardProcess
        title={statusKeys.closed}
        footer={getNumber(+dataStats?.closed?.total)}
        icon={IconClosed}
        setClass={"cardRecentlyClosed"}
      />
    </>
  );
};

export default Items;
