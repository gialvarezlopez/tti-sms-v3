import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { BranchProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import useBranchesStore from "@/store/useBranches";
import { branchStatus } from "@/lib/utils/utils";
import UpdateBranch from "./UpdateBranch";

const UpdateCell = ({
  branch,
  setIsOpenDropdown,
}: {
  branch: BranchProps;
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
        <UpdateBranch
          branch={branch}
          isOpenModal={isOpen}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

const DeleteCell = ({
  branch,
  setIsOpenDropdown,
}: {
  branch: BranchProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setBranches } = useBranchesStore(); // Accedes a los usuarios
  const [, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);

    const newBranch: BranchProps[] = [
      {
        id: branch.id,
        name: branch.name,
        phone_number: branch.phone_number,
        address: branch.address,
        province: branch.province,
        status: branch.status,
        distributionList: branch.distributionList,
        city: branch.city,
        country: branch.country,
        postalCode: branch.postalCode,
      },
    ];

    setBranches(newBranch); // Update the list of users with new data
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

const Cell = ({ row }: { row: BranchProps }) => {
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
        <UpdateCell branch={row} setIsOpenDropdown={setIsOpenDropdown} />
        <DeleteCell branch={row} setIsOpenDropdown={setIsOpenDropdown} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BranchProps>[] = [
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
    //id: "user.first_name",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Name
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap md:text-wrap">{row.original.name}</span>
      );
    },
  },
  {
    accessorKey: "province",
    //id: "user.email",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Province
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span>
          {typeof row.original?.province === "string"
            ? row.original?.province
            : row.original?.province?.name}
        </span>
      ); //capitalizeFirstLetter(row.original.tipoCliente);
    },
  },

  {
    accessorKey: "number",
    //id: "user.role",
    header: () => {
      return (
        <Button variant="ghost" className="px-0">
          Number
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-nowrap">
          {row.original.sendingNumber
            ? row.original.sendingNumber
            : row.original.phone_number ?? "No number assigned"}
        </span>
      );
    },
  },

  {
    accessorKey: "status",
    //id: "user.branch.name",
    header: ({}: { column: ColumnDef<BranchProps> }) => {
      return (
        <Button variant="ghost" className="px-0">
          Status
        </Button>
      );
    },
    cell: ({ row }: { row: Row<BranchProps> }) => {
      return (
        <span className="text-nowrap md:text-wrap">
          {branchStatus(row.original.status ?? "Unknown", true)}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <Cell row={row.original} />,
  },
];
