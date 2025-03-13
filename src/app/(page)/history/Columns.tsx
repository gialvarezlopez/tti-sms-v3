import { ColumnDef } from "@tanstack/react-table";
//import { Checkbox } from "@/components/ui/checkbox";
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

//const role = "admin"; // o role = "user" según el contexto o estado
export const columns: ColumnDef<TicketsProps>[] = [
  /*
  {
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: never) =>
          table.toggleAllPageRowsSelected(value)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: never) => row.toggleSelected(value)}
        className="!hover:bg-gray-600"
      />
    ),
    enableSorting: false,
  },
  */
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
        <span className="text-nowrap md:text-wrap">
          {capitalizeFirstLetterOfEveryWord(row.original.client)}
        </span>
      );
    },
  },
  {
    accessorKey: "TelephoneNumber",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Telephone Number
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.recipient_number}</span>;
    },
  },

  {
    accessorKey: "typeOfMessage",
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
          {row.original.closed ?? "Undefined"}
        </span>
      );
    },
  },
  {
    accessorKey: "closedBy",
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
          {row.original.closedBy?.name ?? "Undefined"}
        </span>
      );
    },
  },
  /*
  ...(role === USER_ROLE.ADMIN || role === USER_ROLE.CUSTOMER_EXPERIENCE
    ? [
        {
          accessorKey: "Branch",
          id: "branch",
          header: ({}: { column: ColumnDef<TicketsProps> }) => {
            return (
              <Button variant="ghost" className="px-0">
                Branch
              </Button>
            );
          },
          cell: ({ row }: { row: Row<TicketsProps> }) => {
            return (
              <span className="text-nowrap md:text-wrap">
                {row.original.branch}
              </span>
            );
          },
        },
      ]
    : []),

  {
    accessorKey: "status",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Status
        </Button>
      );
    },
    cell: ({ row }) => {
      return <>{statusType(row.original.status, true)}</>;
    },
  },
  */
  {
    accessorKey: "reason",
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
          <div>{row.original.reason ?? "Undefined"}</div>
        </>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  },
];
