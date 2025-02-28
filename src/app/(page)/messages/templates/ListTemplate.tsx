"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
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
import { templateType } from "@/lib/utils";

type Props = {
  dataTemplates: TemplateProps[];
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
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  return (
    <DropdownMenu open={isOpenDropdown} onOpenChange={setIsOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-[#E1E1E1] rounded-full"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PreviewCell template={row} setIsOpenDropdown={setIsOpenDropdown} />
        <EditCell template={row} />
        <DeleteCell template={row} setIsOpenDropdown={setIsOpenDropdown} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const setMaxWidth = 720;

const ListTemplate = ({ dataTemplates }: Props) => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState<number>(300);

  const handleSelected = (item: string) => {
    console.log(item);
  };
  const selectedType = searchParams?.get("type");
  const selectedSearch = searchParams?.get("q")?.toLowerCase() || "";

  const filteredTemplates = dataTemplates
    .filter((item) =>
      selectedType && selectedType !== "all"
        ? item.isTwoWay ===
          (selectedType.toLowerCase() === "one way" ? true : false)
        : true
    )
    .filter((item) =>
      selectedSearch ? item.name.toLowerCase().includes(selectedSearch) : true
    );

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

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
  return (
    <>
      <div
        className={`grid grid-cols-1 ${
          panelWidth <= setMaxWidth
            ? "lg:grid-cols-2"
            : "md:grid-cols-2 lg:grid-cols-3"
        } gap-6 mt-8`}
        ref={panelRef}
      >
        {loading ? (
          <TemplatesSkeleton />
        ) : (
          <>
            {filteredTemplates.map((item, index) => (
              <div className="w-full" key={index}>
                <div
                  className={`border-2 rounded-lg   h-full`}
                  onClick={() => handleSelected((item?.id ?? "") as string)}
                >
                  <div className="flex gap-3 justify-between bg-[#F9F9F9] p-4 rounded-tl-lg rounded-tr-lg">
                    <span className="text-base font-semibold">{item.name}</span>
                    <div className="flex gap-2 items-center">
                      <span className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%] text-center">
                        {templateType(item?.isTwoWay ?? false)}
                      </span>
                      <Cell row={item} />
                    </div>
                  </div>

                  <div className="p-4 text-[#1D2433]/60 text-sm">
                    <div className="line-clamp-2">{item.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default ListTemplate;
