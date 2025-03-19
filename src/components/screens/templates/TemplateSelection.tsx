import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import TypeTemplateSection from "./TypeTemplateSection";
import { Separator } from "@/components/ui/separator";
import { IconKeyboardTab, IconTwoWay } from "@/assets/images";
import { useGetTemplates } from "@/hooks/useTemplates";
import { TemplateProps } from "@/types/types";
import TemplatesSkeleton from "@/components/skeletons/TemplatesSkeleton";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import ErrorFetching from "@/components/ui/errorFetching";

type Props = {
  setTemplateSelected?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  className?: string;
  isLink: boolean;
  isFromModel?: boolean;
  templateId?: string;
  setDoAutoClick?: React.Dispatch<React.SetStateAction<boolean>>;
};

const TemplateSelection = ({
  setTemplateSelected,
  className = "grid grid-cols-1 md:grid-cols-3 gap-6",
  isLink,
  isFromModel,
  templateId,
  setDoAutoClick,
}: Props) => {
  const searchParams = useSearchParams();
  const selectedSearch = searchParams?.get("q")?.toLowerCase() || "";

  const [selected, setSelected] = useState<string | undefined>("");

  const {
    data: dataTemplates,
    error,
    isLoading,
    refetch,
    isFetched,
  } = useGetTemplates({
    page: 1,
    limit: 100,
    query: selectedSearch,
  });

  // Filter objects by type
  const oneWayItems = dataTemplates?.data?.filter(
    (item: TemplateProps) => item.isTwoWay === false
  );
  const twoWayItems = dataTemplates?.data?.filter(
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

  useEffect(() => {
    if (
      dataTemplates &&
      isFetched &&
      twoWayItems.length === 0 &&
      setDoAutoClick
    ) {
      setDoAutoClick(true);
    }
  }, [twoWayItems, dataTemplates, isFetched, setDoAutoClick]);

  return (
    <>
      <div className="space-y-6 w-full">
        {!isFromModel && (
          <>
            <div className="space-y-4">
              <div className="flex gap-3 items-center text-base text-[#1D2433]/60 font-semibold ">
                <Image src={IconKeyboardTab} alt="" /> One way Messages
              </div>
              {error && <ErrorFetching message={error.message} />}
              <div className={className}>
                {isLoading ? (
                  <TemplatesSkeleton number={3} />
                ) : (
                  <TypeTemplateSection
                    dataTemplates={oneWayItems}
                    handleSelected={handleSelected}
                    selected={selected}
                    isLink={isLink}
                  />
                )}
              </div>
            </div>
            <Separator className="" />
          </>
        )}

        <div className="space-y-4">
          <div className="flex gap-3 items-center text-base text-[#1D2433]/60 font-semibold ">
            <Image src={IconTwoWay} alt="" /> Two way Messages
          </div>
          {error && <ErrorFetching message={error.message} />}
          <div className={className}>
            {isLoading ? (
              <TemplatesSkeleton number={3} />
            ) : (
              <TypeTemplateSection
                dataTemplates={twoWayItems}
                handleSelected={handleSelected}
                selected={selected ?? ""}
                isLink={isLink}
                templateId={templateId}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateSelection;
