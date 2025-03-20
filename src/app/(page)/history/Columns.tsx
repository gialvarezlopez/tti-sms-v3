import { ColumnDef } from "@tanstack/react-table";
import { TicketsProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import ModalPreviewTicket from "../../../components/screens/preview-ticket/ModalPreviewTicket";
import {
  capitalizeFirstLetterOfEveryWord,
  templateType,
} from "@/lib/utils/utils";
import { formatDate } from "@/lib/utils/dateUtils";

const PreviewCell = ({
  ticket,
  setIsOpenDropdown,
}: {
  ticket: TicketsProps;
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
        Preview
      </span>

      {isOpen && (
        <ModalPreviewTicket
          ticket={ticket}
          modalOpen={isOpen}
          onClose={handleClose}
          hideButtonsActions={true}
        />
      )}
    </div>
  );
};

const Cell = ({ row }: { row: TicketsProps }) => {
  const ticket = row;
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
        <PreviewCell ticket={ticket} setIsOpenDropdown={setIsOpenDropdown} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<TicketsProps>[] = [
  {
    accessorKey: "client",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Client
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap">
          {capitalizeFirstLetterOfEveryWord(row.original.client)}
        </span>
      );
    },
  },
  {
    accessorKey: "recipientNumber",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Telephone Number
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap">{row.original.recipientNumber}</span>
      );
    },
  },

  {
    accessorKey: "typeOfMessage",
    id: "template.isTwoWay",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Type of Message
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span>{templateType(row.original.template?.isTwoWay ?? false)}</span>
      );
    },
  },

  {
    accessorKey: "template",
    id: "template.name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Template
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.template?.name ?? "Undefined"}</span>;
    },
  },

  {
    accessorKey: "closed",
    id: "closedBy.closedAt",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Closed
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap">
          {formatDate(row.original.closedBy?.closedAt ?? "") ?? "Undefined"}
        </span>
      );
    },
  },
  {
    accessorKey: "closedBy",
    id: "user.name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Closed By
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap">
          {row.original.closedBy?.user?.name ?? "Undefined"}
        </span>
      );
    },
  },

  {
    accessorKey: "reason",
    id: "closedBy.closedReason",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Reason
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.closedBy?.closedReason ?? "Undefined"}</div>
        </>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  },
];
