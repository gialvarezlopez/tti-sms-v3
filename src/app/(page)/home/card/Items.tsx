import React from "react";
import {
  IconErrorFound,
  IconOverdue,
  IconUnansweredTickets,
  IconClosed,
} from "../../../../assets/images";
import { StatsProps } from "@/types/types";
import CardProcess from "./CardProcess";

type Props = {
  dataStats: StatsProps;
};

const Items = ({ dataStats }: Props) => {
  const getNumber = (number: number) => {
    return `${number} ${number !== 1 ? "Tickets" : "Ticket"}`;
  };

  return (
    <>
      <CardProcess
        title={"Errors Found"}
        footer={getNumber(+dataStats?.error)}
        icon={IconErrorFound}
        setClass={"cardErrors"}
      />

      <CardProcess
        title={"Overdue"}
        footer={getNumber(+dataStats?.overdue)}
        icon={IconOverdue}
        setClass={""}
      />

      <CardProcess
        title={"To Be Overdue"}
        footer={getNumber(+dataStats?.toBeOverdue)}
        icon={IconOverdue}
        setClass={""}
      />

      <CardProcess
        title={"Unanswered Tickets"}
        footer={getNumber(+dataStats?.inProgress)}
        icon={IconOverdue}
        setClass={"cardUnansweredTickets"}
      />

      <CardProcess
        title={"Recently Closed"}
        footer={getNumber(+dataStats?.closed?.total)}
        icon={IconClosed}
        setClass={"cardRecentlyClosed"}
      />
    </>
  );
};

export default Items;
