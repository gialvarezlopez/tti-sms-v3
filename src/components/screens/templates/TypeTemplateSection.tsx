import { TemplateProps } from "@/types/types";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { templateType } from "@/lib/utils/utils";

type Props = {
  dataTemplates: TemplateProps[];
  handleSelected: (item?: string) => void;
  selected?: string;
  isLink?: boolean;
  templateId?: string;
  addAutoSelect?: boolean;
};

const TypeTemplateSection = ({
  dataTemplates,
  handleSelected,
  selected,
  isLink = false,
  templateId,
  addAutoSelect,
}: Props) => {
  const autoClickRef = useRef<HTMLDivElement | null>(null);
  //const AUTO_CLICK_ID = templateId; // ID objetive
  useEffect(() => {
    if (autoClickRef.current) {
      setTimeout(() => {
        autoClickRef.current?.click();
      }, 100); // Add a small delay to ensure execution
    }
  }, []);
  return (
    <>
      {dataTemplates?.map((item, index) => {
        const isAutoClickItem =
          (templateId && item.id === templateId) || (addAutoSelect && !isLink);
        const content = (
          <div
            ref={isAutoClickItem ? autoClickRef : null}
            className={`border-2 rounded-lg  ${
              item.branch?.status !== "inactive"
                ? "hover:border-[#E02D3C] hover:border-2 cursor-pointer"
                : ""
            } h-full ${
              selected === item?.id ? "border-[#E02D3C]" : "border-[#E1E1E1]"
            }`}
            onClick={() =>
              item.branch?.status !== "inactive"
                ? handleSelected(item?.id ?? "")
                : ""
            }
          >
            <div className="flex flex-col gap-2 justify-between bg-[#F9F9F9] p-4 rounded-tl-lg rounded-tr-lg items-start w-full">
              <div className="flex gap-3 justify-between w-full">
                <div className="text-base font-semibold">{item.name}</div>
                <div className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%] text-center w-[70px] h-[25px] text-nowrap">
                  {templateType(item?.isTwoWay ?? false)}
                </div>
              </div>
              <p className="col-span-2 flex-1 w-full">
                <div className="flex justify-between gap-3">
                  <small className="text-gray-500 flex gap-3">
                    {item?.branch?.name ?? "All Branches"}

                    {item.branch?.status === "inactive" && (
                      <div className="bg-customGray-v1 text-[#1D2433]/80 flex place-items-center px-4 py-1 rounded-[12px] gap-2 text-xs">
                        <span className="rounded-full bg-[#1D2433]/80 flex-none w-[6px] h-[6px]"></span>
                        <span className="flex-none">Inactive</span>
                      </div>
                    )}
                  </small>
                  <small className="text-gray-500">
                    {item?.type ? `Is Reminder` : ""}
                  </small>
                </div>
              </p>
            </div>

            <div className="p-4 text-[#1D2433]/60 text-sm">
              <div className="line-clamp-2">{item.description}</div>
            </div>
          </div>
        );

        return (
          <div className="w-full" key={index}>
            {isLink ? (
              <>
                {item.branch?.status === "inactive" ? (
                  content
                ) : (
                  <Link href={`/messages/new-message/${item.id}`}>
                    {content}
                  </Link>
                )}
              </>
            ) : (
              content
            )}
          </div>
        );
      })}
    </>
  );
};

export default TypeTemplateSection;
