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
        </div>
        <div>
          <span className="font-normal text-[#1D2433]/60"> </span>
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
    </>
  );
};

export default OneWay;
