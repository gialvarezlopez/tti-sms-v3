"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MoreVertical } from "lucide-react";
import TemplatesSkeleton from "@/components/skeletons/TemplatesSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ModalViewTemplate from "@/components/screens/templates/view-template/ViewTemplate";
import { TemplateProps } from "@/types/types";
import ModalDeleteTicket from "./ModalDeleteTemplate";
import { templateType } from "@/lib/utils/utils";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { removeAllParamsFromUrl } from "@/lib/utils/urlUtils";
import NoRecordFound from "@/components/ui/NoRecordFound";
import { USER_ROLE } from "@/lib/constants";
import withAdminProtection from "@/components/hoc/withAdminProtection";

const paramsToIgnore = [""];
type Props = {
  dataTemplates: TemplateProps[];
  isLoading: boolean;
  isDataLoaded: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
};

const PreviewCell = ({
  template,
  setIsOpenDropdown,
}: {
  template: TemplateProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);
  };

  return (
    <div>
      <span
        className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal"
        onClick={handleOpen}
      >
        View
      </span>

      {isOpen && (
        <ModalViewTemplate
          template={template}
          modalOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

const EditCell = ({ template }: { template: TemplateProps }) => {
  return (
    <div>
      <Link href={`/messages/templates/${template.id}`}>
        <span className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal">
          Edit
        </span>
      </Link>
    </div>
  );
};

const DeleteCell = ({
  template,
  setIsOpenDropdown,
}: {
  template: TemplateProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const [, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);
  };

  return <ModalDeleteTicket rowSelected={template} onCloseMenu={handleClose} />;
};

const Cell = ({ row }: { row: TemplateProps }) => {
  const { data: session } = useSession();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  return (
    <DropdownMenu open={isOpenDropdown} onOpenChange={setIsOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-[#E1E1E1] rounded-full"
          disabled={row.branch?.status === "inactive"}
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PreviewCell template={row} setIsOpenDropdown={setIsOpenDropdown} />
        {session && session?.user?.primaryRole === USER_ROLE.ADMIN && (
          <>
            <EditCell template={row} />
            <DeleteCell template={row} setIsOpenDropdown={setIsOpenDropdown} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const setMaxWidth = 850;

const ListTemplate = ({
  dataTemplates,
  isLoading,
  isDataLoaded,
  pagination,
  onPageChange,
}: Props) => {
  const searchParams = useSearchParams();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState<number>(300);

  const handleSelected = (item: string) => {
    console.log(item);
  };
  const selectedType = searchParams?.get("type");
  const hasParams = searchParams
    ? Array.from(searchParams.entries()).filter(
        ([key, value]) =>
          !paramsToIgnore.includes(key) && !(key === "page" && value === "1")
      ).length > 0
    : false;

  const filteredTemplates = dataTemplates.filter((item) =>
    selectedType && selectedType !== "all"
      ? item.isTwoWay ===
        (selectedType.toLowerCase() === "two way" ? true : false)
      : true
  );
  useEffect(() => {
    const checkPanelWidth = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const currentWidth = entry.contentRect.width;

        setPanelWidth(Math.round(currentWidth));
      }
    };

    const resizeObserver = new ResizeObserver(checkPanelWidth);

    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const renderPaginationItems = () => {
    const items = [];
    const currentPage = pagination.currentPage;
    const totalPage = pagination.totalPages;
    const maxVisiblePages = 2;

    if (totalPage <= maxVisiblePages + 4) {
      for (let i = 0; i < totalPage; i++) {
        items.push(
          <PaginationItem key={i} active={i === currentPage}>
            <PaginationLink
              onClick={() => (i !== currentPage ? onPageChange(i) : "")}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const firstPage = 0;
      const lastPage = totalPage - 1;

      items.push(
        <PaginationItem key={firstPage} active={firstPage === currentPage}>
          <PaginationLink onClick={() => onPageChange(firstPage)}>
            {firstPage + 1}
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i} active={i === currentPage}>
            <PaginationLink onClick={() => onPageChange(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPage - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={lastPage} active={lastPage === currentPage}>
          <PaginationLink onClick={() => onPageChange(lastPage)}>
            {lastPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };
  return (
    <>
      <div ref={panelRef}>
        {isLoading || !isDataLoaded ? (
          <div
            className={`grid grid-cols-1 ${
              panelWidth <= setMaxWidth
                ? "lg:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
            } gap-6 mt-8`}
          >
            <TemplatesSkeleton />
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 ${
                panelWidth <= setMaxWidth
                  ? "lg:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
              } gap-6 mt-8`}
            >
              {filteredTemplates.map((item, index) => (
                <div className="w-full" key={index}>
                  <div
                    className={`border-2 rounded-lg   h-full`}
                    onClick={() => handleSelected((item?.id ?? "") as string)}
                  >
                    <div className="flex flex-col gap-2 justify-between bg-[#F9F9F9] p-4 rounded-tl-lg rounded-tr-lg items-start w-full">
                      <div className="flex gap-3 justify-between w-full">
                        <span className="text-base font-semibold flex-1">
                          <p>{item.name}</p>
                        </span>
                        <div className="flex gap-2 items-center">
                          <span className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%] text-center w-[75px]  h-[24px]">
                            {templateType(item?.isTwoWay ?? false)}
                          </span>
                          <Cell row={item} />
                        </div>
                      </div>
                      <p className="col-span-2 flex-1 w-full">
                        <div className="flex justify-between gap-3">
                          <small className="text-gray-500 flex gap-3">
                            {item?.branch?.name ?? "All Branches"}{" "}
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
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <NoRecordFound
                paramsUrl={{ hasParams, removeAllParamsFromUrl }}
                messageNoRecord={
                  hasParams
                    ? "We have not found any results for your search."
                    : ""
                }
                messageFooter={"Change the parameters"}
              />
            )}
          </>
        )}
      </div>
      {!isLoading && filteredTemplates.length > 0 && (
        <>
          {/* Pagination controls */}
          <div className="flex items-center justify-end mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <PaginationPrevious
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="cursor-pointer border border-[#1D2433]/80"
              >
                Previous
              </PaginationPrevious>

              <PaginationNext
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="cursor-pointer border border-[#1D2433]/80"
              >
                Next
              </PaginationNext>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center md:justify-end ">
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="cursor-pointer border border-[#1D2433]/80"
                />
                {renderPaginationItems()}
                <PaginationNext
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  className="cursor-pointer border border-[#1D2433]/80"
                />
              </PaginationContent>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default withAdminProtection(ListTemplate);
