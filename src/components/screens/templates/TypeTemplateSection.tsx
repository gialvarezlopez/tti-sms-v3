import { TemplateProps } from "@/types/types";
import React, { useEffect, useRef } from "react";
import Link from "next/link"; // Asegúrate de importar Link desde Next.js
import { templateType } from "@/lib/utils/utils";

type Props = {
  dataTemplates: TemplateProps[];
  handleSelected: (item?: string) => void;
  selected?: string;
  isLink?: boolean; // Nueva propiedad isLink
  templateId?: string;
  addAutoSelect?: boolean;
};

const TypeTemplateSection = ({
  dataTemplates,
  handleSelected,
  selected,
  isLink = false, // Valor por defecto en false
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
            className={`border-2 rounded-lg hover:border-[#E02D3C] hover:border-2 cursor-pointer h-full ${
              selected === item?.id ? "border-[#E02D3C]" : "border-[#E1E1E1]"
            }`}
            onClick={() => handleSelected(item?.id ?? "")}
          >
            <div className="flex gap-3 justify-between bg-[#F9F9F9] p-4 rounded-tl-lg rounded-tr-lg">
              <div className="text-base font-semibold">{item.name}</div>

              <div className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%] text-center w-[70px] h-[25px] text-nowrap">
                {templateType(item?.isTwoWay ?? false)}
              </div>
            </div>

            <div className="p-4 text-[#1D2433]/60 text-sm">
              <div className="line-clamp-2">{item.description}</div>
            </div>
          </div>
        );

        return (
          <div className="w-full" key={index}>
            {isLink ? (
              <Link href={`/messages/new-message/${item.id}`}>{content}</Link>
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
