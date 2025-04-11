import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import TypeTemplateSection from "./TypeTemplateSection";
import { Separator } from "@/components/ui/separator";
import { IconKeyboardTab, IconTwoWay } from "@/assets/images";
import { useGetTemplates } from "@/hooks/useTemplates";
import { TemplateProps } from "@/types/types";
import TemplatesSkeleton from "@/components/skeletons/TemplatesSkeleton";
import ErrorFetching from "@/components/ui/errorFetching";
import { USER_ROLE } from "@/lib/constants";

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
  const { data: session } = useSession();
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
    branch:
      (session && session?.user?.primaryRole === USER_ROLE.USER
        ? session?.user.branch.id
        : "") ?? "",
  });

  const itemsTemplates = () => {
    const isUser = session?.user?.primaryRole === USER_ROLE.USER;
    const userBranchId = session?.user?.branch?.id;

    let oneWayItems = dataTemplates?.data?.filter((item: TemplateProps) => {
      const isOneWay = item.isTwoWay === false;
      const matchesBranch = !isUser || item.branch?.id === userBranchId;
      return isOneWay && matchesBranch;
    });

    let twoWayItems = dataTemplates?.data?.filter((item: TemplateProps) => {
      const isTwoWay = item.isTwoWay === true;
      const matchesBranch = !isUser || item.branch?.id === userBranchId;
      return isTwoWay && matchesBranch;
    });

    if (isFromModel) {
      oneWayItems = dataTemplates?.data?.filter(
        (item: TemplateProps) =>
          item.isTwoWay === false && item.type === "reminder"
      );

      twoWayItems = dataTemplates?.data?.filter(
        (item: TemplateProps) =>
          item.isTwoWay === true && item.type === "reminder"
      );
    }

    return {
      oneWayItems,
      twoWayItems,
    };
  };

  const { oneWayItems, twoWayItems } = itemsTemplates();

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
      twoWayItems.length + oneWayItems.length === 1 &&
      setDoAutoClick
    ) {
      setDoAutoClick(true);
    }
  }, [twoWayItems, oneWayItems, dataTemplates, isFetched, setDoAutoClick]);

  return (
    <>
      <div className="space-y-6 w-full">
        <>
          <div className="space-y-4">
            <div className="flex gap-3 items-center text-base text-[#1D2433]/60 font-semibold ">
              <Image src={IconKeyboardTab} alt="" /> One-Way Messages
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
                  addAutoSelect={twoWayItems.length + oneWayItems.length === 1}
                />
              )}
            </div>
          </div>
          <Separator className="" />
        </>

        <div className="space-y-4">
          <div className="flex gap-3 items-center text-base text-[#1D2433]/60 font-semibold ">
            <Image src={IconTwoWay} alt="" /> Two-Way Messages
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
                addAutoSelect={twoWayItems.length + oneWayItems.length === 1}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateSelection;
