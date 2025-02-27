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
//import { useRouter } from "next/navigation";
import UpdateUser from "./UpdateUser";
import ModalResetPassword from "./modal-reset-password/ModalResetPassword";
import useUsersStore from "@/store/useUsers";

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
        //status: "active",

        first_name: user.first_name,
        //last_name: "Doe",
        username: user.username,
        roles: user.roles,
        branch: {
          id: user.branch.id,
          name: user.branch.name,
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
    id: "user.first_name",
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
          {row.original.first_name} {row.original.last_name}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    id: "user.email",
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
    accessorKey: "role",
    id: "user.role",
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
          {row.original.roles && row.original.roles[0]}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    id: "user.created_at",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Date Added
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="text-nowrap">{row.original.created_at}</span>;
    },
  },

  {
    accessorKey: "branch",
    //id: "user.branch.name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Branch
        </Button>
      );
    },
    cell: ({ row }: { row: Row<UserProps> }) => {
      const branch = row.original.branch;
      // Asegúrate de que 'branch' existe y tiene un 'name' válido.
      const branchName = branch?.name || "No branch assigned";

      return <span className="text-nowrap md:text-wrap">{branchName}</span>;
    },
  },

  /*
  {
    accessorKey: "branch",
    id: "user.branch.name",
    header: ({}: { column: ColumnDef<UserProps> }) => {
      return (
        <Button variant="ghost" className="px-0">
          Branch
        </Button>
      );
    },
    cell: ({ row }: { row: Row<UserProps> }) => {
      return (
        <span className="text-nowrap md:text-wrap">
          {row.original.user.branch?.name || ""}
        </span>
      );
    },
  },
  */
  {
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  },
];
