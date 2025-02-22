import { highlightKeyword } from "@/lib/utils";
import { TicketsProps } from "@/types/types";
import React from "react";
type Props = {
  ticket: TicketsProps;
};
const OneWay = ({ ticket }: Props) => {
  const renderMessage = () => {
    const message =
      ticket?.chat && ticket?.chat[0]?.message ? ticket?.chat[0]?.message : "";

    return message;
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-3 border-b border-[#CCD1DC]  px-6 py-2">
        <div className="flex gap-3">
          <span className="font-normal text-[#1D2433]/60">Message: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {ticket?.chat[0]?.date}
          </span>
        </div>
        <div>
          <span className="font-normal text-[#1D2433]/60">Description: </span>
          {/*<span className="">{ticket?.chat[0]?.message}</span>*/}

          <div
            dangerouslySetInnerHTML={{
              __html: highlightKeyword(
                renderMessage(),
                ticket?.chat[0]?.keyword || "",
                "black"
              ),
            }}
          />
        </div>
      </div>
      {ticket.errorMessage && (
        <div className="grid grid-cols-1 gap-3 border-b border-[#CCD1DC]  px-6 py-2">
          <div className="flex gap-3">
            <span className="font-bold text-[#DC2F2F]">Error: </span>
            <span className="text-base text-[#DC2F2F]">
              {ticket.errorMessage}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default OneWay;
