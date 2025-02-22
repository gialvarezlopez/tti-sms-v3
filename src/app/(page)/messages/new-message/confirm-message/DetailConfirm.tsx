import React from "react";
import { TYPE_OF_MESSAGE } from "@/lib/constants";
import { convertToSnakeCase } from "@/lib/utils";
import { TicketsProps } from "@/types/types";
import OneWay from "./OneWay";

type Props = {
  ticket: TicketsProps;
};

const DetailConfirm = ({ ticket }: Props) => {
  // Function to render the dynamic message

  return (
    <>
      <div className="grid grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60 text-nowrap">
            Telephone number:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1 ">
            {ticket.phoneNumber}
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

      {convertToSnakeCase(ticket.typeOfMessage) === TYPE_OF_MESSAGE.ONE_WAY && (
        <OneWay ticket={ticket} />
      )}
    </>
  );
};

export default DetailConfirm;
