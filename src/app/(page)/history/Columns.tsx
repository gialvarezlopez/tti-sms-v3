import { ColumnDef, Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
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
  formatPhoneNumber,
  templateType,
} from "@/lib/utils/utils";
import { formatDate } from "@/lib/utils/dateUtils";
import { USER_ROLE } from "@/lib/constants";

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

const useColumns = () => {
  const { data: session } = useSession();

  const isAdmin =
    session?.user?.primaryRole === USER_ROLE.ADMIN ||
    session?.user?.primaryRole === USER_ROLE.CUSTOMER_EXPERIENCE;

  // Define the columns
  const columnDefs: ColumnDef<TicketsProps>[] = [
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
          <span className="text-nowrap">
            {formatPhoneNumber(row.original.recipientNumber ?? "", true)}{" "}
          </span>
        );
      },
    },
    // Add 'Branch' column only if user is 'admin'
    ...(isAdmin
      ? [
          {
            accessorKey: "Branch",
            id: "branch.name",
            header: ({}: { column: ColumnDef<TicketsProps> }) => {
              return (
                <Button variant="ghost" className="px-0">
                  Branch
                </Button>
              );
            },
            cell: ({ row }: { row: Row<TicketsProps> }) => {
              return (
                <span className="text-nowrap">
                  {row.original.branch &&
                  typeof row.original.branch !== "string"
                    ? row.original.branch.name
                    : null}
                </span>
              );
            },
          },
        ]
      : []),
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
            {row.original.closedBy?.user?.name ?? ""}
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
            <div>{row.original.closedBy?.closedReason ?? ""}</div>
          </>
        );
      },
    },
  ];

  // Column for actions
  columnDefs.push({
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  });

  return columnDefs;
};

export default useColumns;
/*
export const columns: ColumnDef<TicketsProps>[] = [

 

 

  

 

  {
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  },
];
*/
