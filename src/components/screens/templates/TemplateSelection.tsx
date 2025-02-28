import React, { useState } from "react";
import Image from "next/image";

//import { dataTemplates } from "@/components/screens/templates/dataMock";
import TypeTemplateSection from "./TypeTemplateSection";
import { Separator } from "@/components/ui/separator";
import { IconKeyboardTab, IconTwoWay } from "@/assets/images";
import { useGetTemplates } from "@/hooks/useTemplates";
import { TemplateProps } from "@/types/types";

type Props = {
  setTemplateSelected?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  className?: string;
  isLink: boolean;
};

const TemplateSelection = ({
  setTemplateSelected,
  className = "grid grid-cols-1 md:grid-cols-3 gap-6",
  isLink,
}: Props) => {
  const [selected, setSelected] = useState<string | undefined>("");

  const {
    data: dataTemplates,
    error,
    isLoading,
    refetch,
  } = useGetTemplates({
    page: 1,
    limit: 100,
    search: "",
  });

  // Filtrar objetos por tipo
  const oneWayItems = dataTemplates.filter(
    (item: TemplateProps) => item.isTwoWay === false
  );
  const twoWayItems = dataTemplates.filter(
    (item: TemplateProps) => item.isTwoWay === true
  );

  const handleSelected = (item?: string) => {
    if (item) {
      if (setTemplateSelected) {
        setTemplateSelected(item.toString());
      }
      setSelected(item);
    }
  };
  return (
    <>
      <div className="space-y-6 w-full">
        <div className="space-y-4">
          <div className="flex gap-3 items-center text-base text-[#1D2433]/60 font-semibold ">
            <Image src={IconKeyboardTab} alt="" /> One way Messages
          </div>
          <div className={className}>
            <TypeTemplateSection
              dataTemplates={oneWayItems}
              handleSelected={handleSelected}
              selected={selected}
              isLink={isLink}
            />
          </div>
        </div>
        <Separator className="" />
        <div className="space-y-4">
          <div className="flex gap-3 items-center text-base text-[#1D2433]/60 font-semibold ">
            <Image src={IconTwoWay} alt="" /> Two way Messages
          </div>
          <div className={className}>
            <TypeTemplateSection
              dataTemplates={twoWayItems}
              handleSelected={handleSelected}
              selected={selected ?? ""}
              isLink={isLink}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateSelection;
