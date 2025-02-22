import React from "react";
import { TYPE_OF_MESSAGE } from "@/lib/constants";
import { convertToSnakeCase, statusType } from "@/lib/utils";
import { TicketsProps } from "@/types/types";
import OneWay from "./OneWay";
import TwoWay from "./TwoWay";

type Props = {
  ticket: TicketsProps;
};

const Features = ({ ticket }: Props) => {
  // Function to render the dynamic message

  return (
    <>
      <div className="grid grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">Client: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {ticket.client}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60 text-nowrap">
            Telephone number:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1 ">
            {ticket.phoneNumber}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">Status: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {statusType(ticket.status)}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">
            Type of message:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1">
            {ticket.typeOfMessage}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-3">
          <span className="font-normal text-[#1D2433]/60">Template: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {ticket.templateName}
          </span>
        </div>
        <div>
          <span className="font-normal text-[#1D2433]/60">Description: </span>
          <div className="text-[#1D2433]/60">{ticket.templateDescription}</div>
        </div>
      </div>

      {convertToSnakeCase(ticket.typeOfMessage) === TYPE_OF_MESSAGE.ONE_WAY && (
        <OneWay ticket={ticket} />
      )}
      {convertToSnakeCase(ticket.typeOfMessage) === TYPE_OF_MESSAGE.TWO_WAY && (
        <TwoWay ticket={ticket} />
      )}
    </>
  );
};

export default Features;
