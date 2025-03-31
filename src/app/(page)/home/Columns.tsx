import { useSession } from "next-auth/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TicketsProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  capitalizeFirstLetterOfEveryWord,
  convertToSnakeCase,
  formatPhoneNumber,
  statusType,
  templateType,
} from "@/lib/utils/utils";
import ModalPreviewTicket from "../../../components/screens/preview-ticket/ModalPreviewTicket";
import useTicketsStore from "@/store/useTickets";
import { TICKETS_STATUS, USER_ROLE } from "@/lib/constants";
import ModalResendTicket from "@/components/screens/home/resend-ticket/ModalResendTicket";
import ModalSendRemainder from "@/components/screens/home/send-remainder/ModalSendRemainder";
import { formatDate } from "@/lib/utils/dateUtils";

const PreviewCell = ({
  ticket,
  setIsOpenDropdown,
}: {
  ticket: TicketsProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resendMessageOrReminder, setResendMessageOrReminder] = useState("");

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

      {isOpen && !resendMessageOrReminder && (
        <ModalPreviewTicket
          ticket={ticket}
          modalOpen={isOpen}
          onClose={handleClose}
          setResendMessageOrReminder={setResendMessageOrReminder}
        />
      )}

      {resendMessageOrReminder && resendMessageOrReminder === "reminder" && (
        <ModalSendRemainder
          ticket={ticket}
          modalOpen={isOpen}
          onClose={handleClose}
        />
      )}

      {resendMessageOrReminder && resendMessageOrReminder === "message" && (
        <ModalResendTicket
          modalOpen={isOpen}
          onClose={handleClose}
          ticket={ticket}
        />
      )}
    </div>
  );
};

const ResendMessageCell = ({
  template,
  setIsOpenDropdown,
}: {
  template: TicketsProps;
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
        Resend Message
      </span>

      {isOpen && (
        <ModalResendTicket
          modalOpen={isOpen}
          onClose={handleClose}
          ticket={template}
        />
      )}
    </div>
  );
};

const SendRemainderCell = ({
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
        Send Reminder
      </span>

      {isOpen && (
        <ModalSendRemainder
          ticket={ticket}
          modalOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

const CloseTicketCell = ({
  ticket,
  setIsOpenDropdown,
}: {
  ticket: TicketsProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const { tickets, setTickets } = useTicketsStore();

  const handleAddTicketToClose = () => {
    if (ticket) {
      setTickets([...tickets, ticket]);
      setIsOpenDropdown(false);
    }
  };

  return (
    <div>
      <span
        className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal"
        onClick={handleAddTicketToClose}
      >
        Close Ticket
      </span>
    </div>
  );
};

const Cell = ({ row }: { row: TicketsProps }) => {
  const template = row;
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
        <PreviewCell ticket={template} setIsOpenDropdown={setIsOpenDropdown} />

        {!template?.template?.isTwoWay && (
          <ResendMessageCell
            template={template}
            setIsOpenDropdown={setIsOpenDropdown}
          />
        )}

        {convertToSnakeCase(template.status) === TICKETS_STATUS.IN_PROGRESS &&
          template?.template?.isTwoWay && (
            <SendRemainderCell
              ticket={template}
              setIsOpenDropdown={setIsOpenDropdown}
            />
          )}

        <CloseTicketCell
          ticket={template}
          setIsOpenDropdown={setIsOpenDropdown}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const useColumns = () => {
  const { data: session } = useSession();

  const isAdmin = session?.user?.primaryRole === USER_ROLE.ADMIN;

  // Define the columns
  const columnDefs: ColumnDef<TicketsProps>[] = [
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
            {formatPhoneNumber(row.original.recipientNumber ?? "", true)}
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
      accessorKey: "lastSent",
      id: "lastMessage.createdAt",
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Last Sent
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-nowrap">
            {formatDate(row.original.lastMessage?.createdAt ?? "")}
          </span>
        );
      },
    },
    {
      accessorKey: "lastReceived",
      id: "lastReceivedMessage.createdAt",
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Last Received
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-nowrap">
            {formatDate(row.original.lastReceivedMessage?.createdAt)}
          </span>
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
          <span>
            {row.original.template
              ? templateType(row.original.template?.isTwoWay ?? false)
              : "No template data"}
          </span>
        );
      },
    },
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
    {
      accessorKey: "createdAt",
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Created At
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-nowrap">
            {formatDate(row.original?.createdAt ?? "")}
          </span>
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
