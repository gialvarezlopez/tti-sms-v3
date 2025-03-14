import { useSession } from "next-auth/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TemplateProps, TicketsProps } from "@/types/types";
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

  /*
  const templateProps: TemplateProps = {
    ...template,
    id: template.id?.toString(),
    responses: template.template?.responses?.map((response) => ({
      response: response.response || "", // Assign a default value if undefined
      reply: response.reply || "", // Assign a default value if undefined
    })),
  };
  */
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

        {convertToSnakeCase(template.status) ===
          TICKETS_STATUS.ERROR_IN_MESSAGE && (
          <ResendMessageCell
            template={template}
            setIsOpenDropdown={setIsOpenDropdown}
          />
        )}

        {convertToSnakeCase(template.status) === TICKETS_STATUS.IN_PROGRESS && (
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

/*
const role = "admin"; // o role = "user" según el contexto o estado
export const columns: ColumnDef<TicketsProps>[] = [
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
  // Condicional para mostrar la columna 'Branch' solo si el rol es 'admin'

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
          {row.original.clientName}
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
      return <span>{row.original.phoneNumber}</span>; //capitalizeFirstLetter(row.original.tipoCliente);
    },
  },
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
    accessorKey: "lastSent",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Last Sent
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="text-nowrap">{row.original.lastSent}</span>;
    },
  },
  {
    accessorKey: "lastReceived",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Last received
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="text-nowrap">{row.original.lastReceived}</span>;
    },
  },
  {
    accessorKey: "typeOfMessage",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Type of message
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.typeOfMessage}</span>;
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
      return <span className="text-nowrap">{row.original.createdAt}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  },
];
*/

const useColumns = () => {
  const { data: session } = useSession();

  // Comprobar si el usuario tiene rol 'admin'
  const isAdmin = session?.user?.primaryRole === USER_ROLE.ADMIN;

  // Definir las columnas
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
    // Condicional para mostrar la columna 'Branch' solo si el rol es 'admin'

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
        return (
          <span>{formatPhoneNumber(row.original.recipientNumber ?? "")}</span>
        ); //capitalizeFirstLetter(row.original.tipoCliente);
      },
    },
    // Add 'Branch' column only if user is 'admin'
    ...(isAdmin
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
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Last Sent
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className="text-nowrap">{row.original.lastSent}</span>;
      },
    },
    {
      accessorKey: "lastReceived",
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
            {formatDate(row.original.lastReceivedMessage.createdAt)}
          </span>
        );
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
            {formatDate(row.original.firstMessage?.createdAt ?? "")}
          </span>
        );
      },
    },
  ];

  // Columna para las acciones
  columnDefs.push({
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  });

  return columnDefs; // Retornar las columnas dinámicas
};

export default useColumns;
