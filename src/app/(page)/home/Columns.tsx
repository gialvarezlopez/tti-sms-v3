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
//import { useRouter } from "next/navigation";
import { convertToSnakeCase, statusType } from "@/lib/utils";
import ModalPreviewTicket from "../../../components/screens/preview-ticket/ModalPreviewTicket";
import useTicketsStore from "@/store/useTickets";
import { TICKETS_STATUS, USER_ROLE } from "@/lib/constants";
import ModalResendTicket from "@/components/screens/home/resend-ticket/ModalResendTicket";
import ModalSendRemainder from "@/components/screens/home/send-remainder/ModalSendRemainder";

/*
const DeleteCell = ({
  clientId,
  setIsOpenDropdown,
}: {
  clientId: string;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useClientDelete();

  const handleDeleteField = (companyId: string) => {
    mutate(companyId);
    setIsOpenDropdown(false); // close dropdown
  };

  const handleStateDialog = (newState: boolean) => {
    if (newState) {
      setIsOpen(true);
      return;
    }
    setIsOpen(true); // close modal
    setIsOpenDropdown(false); // close dropdown
  };

  return (
    <div>
      <Button
        className="w-full justify-start"
        variant="ghost"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Eliminar
      </Button>

      <Dialog open={isOpen} onOpenChange={handleStateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Eliminar Cliente</DialogTitle>
            <DialogDescription>
              Esta seguro que desea eliminar este cliente?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={() => {
                handleDeleteField(clientId);
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
*/

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
        Resend Message
      </span>

      {isOpen && (
        <ModalResendTicket
          ticket={ticket}
          modalOpen={isOpen}
          onClose={handleClose}
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
    //const id = ticket?.id;
    if (ticket) {
      //setTickets([...tickets, +id]); // Añadimos el nuevo número al arreglo
      setTickets([...tickets, ticket]); // Añadimos el nuevo número al arreglo
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
        {/* <DropdownMenuLabel>Acciones</DropdownMenuLabel>*/}

        <PreviewCell ticket={ticket} setIsOpenDropdown={setIsOpenDropdown} />

        {convertToSnakeCase(ticket.status) ===
          TICKETS_STATUS.ERROR_IN_MESSAGE && (
          <ResendMessageCell
            ticket={ticket}
            setIsOpenDropdown={setIsOpenDropdown}
          />
        )}

        {convertToSnakeCase(ticket.status) === TICKETS_STATUS.IN_PROGRESS && (
          <SendRemainderCell
            ticket={ticket}
            setIsOpenDropdown={setIsOpenDropdown}
          />
        )}

        <CloseTicketCell
          ticket={ticket}
          setIsOpenDropdown={setIsOpenDropdown}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
        <span className="text-nowrap md:text-wrap">{row.original.client}</span>
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
