import { formatDate } from "@/lib/utils/dateUtils";
import { highlightKeyword } from "@/lib/utils/utils";
import { TicketsProps } from "@/types/types";
import React from "react";
type Props = {
  ticket: TicketsProps;
};
const OneWay = ({ ticket }: Props) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 border-b border-[#CCD1DC]  px-6 py-2">
        <div className="flex gap-3">
          <span className="font-normal text-[#1D2433]/60">Message: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {ticket?.messages && formatDate(ticket?.messages[0]?.created_at)}
          </span>
        </div>
        <div>
          <span className="font-normal text-[#1D2433]/60">Description: </span>
          {/*<span className="">{ticket?.chat[0]?.message}</span>*/}

          <div
            dangerouslySetInnerHTML={{
              __html: highlightKeyword(
                (ticket?.messages && ticket?.messages[0]?.content) ??
                  "Undefined",
                ticket.template?.keywords?.map(({ keyword, value }) => ({
                  keyword,
                  value: keyword ?? "",
                })) ?? [],
                "red",
                [], //No keyword
                /*
                ticket.template?.responses
                  ?.filter((item) => item.response && item.reply) // Filter objects that have `response` and `reply`
                  .map((item) => ({
                    value: item.response, // Maps only the `response` property
                    color: "black",
                  })) ?? [],
                   */
                true
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
