import { WHO_SEND_MESSAGE } from "@/lib/constants";
import { formatDate } from "@/lib/utils/dateUtils";
import { highlightKeyword } from "@/lib/utils/utils";
import { TicketsProps } from "@/types/types";
import React from "react";
type Props = {
  ticket: TicketsProps;
};
const TwoWay = ({ ticket }: Props) => {
  const renderPreFix = (user: string, index: number, total: number) => {
    let word = "";
    if (user === WHO_SEND_MESSAGE.ADMIN && index === 0) {
      word = "First";
    }

    if (user === WHO_SEND_MESSAGE.ADMIN && index + 1 === total) {
      word = "Last";
    }

    if (user === WHO_SEND_MESSAGE.CUSTOMER) {
      word = "Customer";
    }

    return `${word} `;
  };
  return (
    <>
      <div>
        {ticket?.messages?.map((item, index) => (
          <div key={index} className={`border-b border-[#CCD1DC]  px-6  `}>
            <div className="text-[#1D2433]/60 pt-3">
              {index === 0 ? (
                <>{` First Message - ${formatDate(item.createdAt)} `}</>
              ) : (
                ""
              )}

              {ticket?.messages?.length === index + 1 ? (
                <>{` Last Message - ${formatDate(item.createdAt)} `}</>
              ) : (
                ""
              )}
            </div>

            <div
              className={`py-2  ${
                item?.sentByType === WHO_SEND_MESSAGE.CUSTOMER
                  ? "bg-[#F9F9F9] px-2"
                  : ""
              } `}
            >
              <div className="flex justify-end">
                <div className="">
                  <div className="flex gap-3 w-auto">
                    <span className="font-normal text-[#1D2433]/60">
                      {ticket?.messages &&
                        renderPreFix(
                          item?.sentByType as string,
                          index,
                          ticket?.messages?.length
                        )}
                      Message:{" "}
                    </span>
                    <span className="font-bold text-base text-customBlack-v1">
                      {ticket.date}
                    </span>
                  </div>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: highlightKeyword(
                        item.content ?? "Undefined",
                        ticket.template?.keywords?.map(
                          ({ keyword, value }) => ({
                            keyword,
                            value: keyword ?? "",
                          })
                        ) ?? [],
                        "red",
                        [], //No keyword

                        true
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TwoWay;
