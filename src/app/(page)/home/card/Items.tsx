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
  closed: "Recently Answered",
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

  const goHistory = () => {
    const today = new Date(); // Fecha actual
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // Resta 7 días

    // ✅ Sumar un día a closeDateTo (hoy + 1)
    today.setDate(today.getDate() + 1);

    // Formatea las fechas como mm/dd/yyyy
    const formatDate = (date: Date) => {
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    };

    const closeDateFrom = formatDate(sevenDaysAgo);
    const closeDateTo = formatDate(today);

    // Construye la URL con los parámetros
    const params = new URLSearchParams({
      page: "1",
      sortOrder: "ASC",
      typeOfMessage: "twoway",
      closeDateFrom,
      closeDateTo,
    });

    router.push(`/history?${params.toString()}`);
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
      {/*  
      //Temporally hidden
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
      */}
      <div className={`cursor-pointer`} onClick={() => goHistory()}>
        <CardProcess
          title={statusKeys.closed}
          footer={getNumber(+dataStats?.closed?.total)}
          icon={IconClosed}
          setClass={"cardRecentlyClosed"}
        />
      </div>
    </>
  );
};

export default Items;
