import { useSession } from "next-auth/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import UpdateUser from "./UpdateUser";
import ModalResetPassword from "./modal-reset-password/ModalResetPassword";
import useUsersStore from "@/store/useUsers";
import { USER_ROLE } from "@/lib/constants";
import { capitalizeFirstLetterOfEveryWord } from "@/lib/utils/utils";
import { formatDate } from "@/lib/utils/dateUtils";

const UpdateCell = ({
  user,
  setIsOpenDropdown,
}: {
  user: UserProps;
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
        Update
      </span>

      {isOpen && (
        <UpdateUser
          user={user}
          isOpenModal={isOpen}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

const ResetPasswordCell = ({
  user,
  setIsOpenDropdown,
}: {
  user: UserProps;
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
        Reset Password
      </span>

      {isOpen && (
        <ModalResetPassword
          user={user}
          modalOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

const DeleteCell = ({
  user,
  setIsOpenDropdown,
}: {
  user: UserProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setUsers } = useUsersStore(); // Accedes a los usuarios
  const [, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);

    const newUsers: UserProps[] = [
      {
        id: user.id,
        name: user.name,
        username: user.email,
        primary_role: user.primary_role,
        branch: {
          id: user?.branch?.id,
          name: user?.branch?.name,
        },
      },
    ];
    setUsers(newUsers); // Actualiza la lista de usuarios con nuevos datos
  };

  return (
    <div>
      <span
        className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal"
        onClick={handleClose}
      >
        Delete
      </span>
    </div>
  );
};

const Cell = ({ row }: { row: UserProps }) => {
  //const user = row;
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

        <UpdateCell user={row} setIsOpenDropdown={setIsOpenDropdown} />

        <ResetPasswordCell user={row} setIsOpenDropdown={setIsOpenDropdown} />

        <DeleteCell user={row} setIsOpenDropdown={setIsOpenDropdown} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/*
export const columns: ColumnDef<UserProps>[] = [
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
      <>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: never) => row.toggleSelected(value)}
          className="!hover:bg-gray-600"
        />
      </>
    ),
    enableSorting: false,
  },
  // Condicional para mostrar la columna 'Branch' solo si el rol es 'admin'

  {
    accessorKey: "name",
    //id: "user.name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Name
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap md:text-wrap">
          {row.original.name} {row.original.last_name}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    //id: "user.email",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Email
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.email}</span>; //capitalizeFirstLetter(row.original.tipoCliente);
    },
  },

  {
    accessorKey: "primaryRole.name",
    id: "primaryRole.name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          User Type
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap">
          {row.original.primaryRole && row.original.primaryRole.name}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Date Added
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="text-nowrap">{row.original.createdAt}</span>;
    },
  },

  {
    accessorKey: "branch.name",
    id: "branch.name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Branch
        </Button>
      );
    },
    cell: ({ row }: { row: Row<UserProps> }) => {
      const branch = row.original.branch;
      const branchName = branch?.name || "No branch assigned";

      return <span className="text-nowrap">{branchName}</span>;
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
  const columnDefs: ColumnDef<UserProps>[] = [
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
      accessorKey: "name",
      header: () => (
        <Button variant="ghost" className="px-0">
          Name
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-nowrap md:text-wrap">
          {capitalizeFirstLetterOfEveryWord(row.original.name ?? "")}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <Button variant="ghost" className="px-0">
          Email
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      accessorKey: "primaryRole.name",
      id: "primaryRole.name",
      header: () => (
        <Button variant="ghost" className="px-0">
          User Type
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-nowrap">
          {row.original.primary_role?.name ?? "No user type assigned"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      id: "createdAt",
      header: () => (
        <Button variant="ghost" className="px-0">
          Date Added
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-nowrap">
          {formatDate(row.original.created_at ?? "") ?? "Unknown"}
        </span>
      ),
    },
  ];

  // Agregar columna 'Branch' solo si el usuario es 'admin'
  if (isAdmin) {
    columnDefs.push({
      accessorKey: "branch.name",
      id: "branch.name",
      header: () => (
        <Button variant="ghost" className="px-0">
          Branch
        </Button>
      ),
      cell: ({ row }: { row: Row<UserProps> }) => {
        const branch = row.original.branch;
        const branchName = branch?.name || "No branch assigned";
        return <span className="text-nowrap">{branchName}</span>;
      },
    });
  }

  // Columna para las acciones
  columnDefs.push({
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  });

  return columnDefs; // Retornar las columnas dinámicas
};

export default useColumns;
