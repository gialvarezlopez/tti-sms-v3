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
import { branchStatus, formatPhoneNumber } from "@/lib/utils/utils";
import UpdateBranch from "./UpdateBranch";
import { useUpdateBranch } from "@/hooks/useBranches";

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

//To delete multiple options will be pending for now
/*
const DeleteCell = ({
  branch,
  setIsOpenDropdown,
}: {
  branch: BranchProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setBranches } = useBranchesStore();
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
*/

const DisableCell = ({
  branch,
  setIsOpenDropdown,
}: {
  branch: BranchProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const [, setIsOpen] = useState(false);

  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch(
    branch.id as string
  );

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);
  };

  const handleSubmit = () => {
    const dataUpdate = {
      status: "inactive",
      distribution_list: "",
    };
    updateBranch(dataUpdate, {
      onSuccess(data) {
        handleClose();
      },
      onError(data) {
        handleClose();
      },
    });
  };

  return (
    <div>
      <span
        className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal"
        onClick={handleSubmit}
      >
        {isUpdating ? "Sending..." : "Disable"}
      </span>
    </div>
  );
};

const EnableCell = ({
  branch,
  setIsOpenDropdown,
}: {
  branch: BranchProps;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const [, setIsOpen] = useState(false);

  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch(
    branch.id as string
  );

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);
  };

  const handleSubmit = () => {
    const dataUpdate = {
      status: "active",
      distribution_list: "",
    };
    updateBranch(dataUpdate, {
      onSuccess(data) {
        handleClose();
      },
      onError(data) {
        handleClose();
      },
    });
  };

  return (
    <div>
      <span
        className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal"
        onClick={handleSubmit}
      >
        {isUpdating ? "Sending..." : "Enable"}
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
        {row.status === "active" && (
          <DisableCell branch={row} setIsOpenDropdown={setIsOpenDropdown} />
        )}

        {row.status === "inactive" && (
          <EnableCell branch={row} setIsOpenDropdown={setIsOpenDropdown} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BranchProps>[] = [
  //The checkboxes will be pending for now to select multiple items
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
  */

  {
    accessorKey: "name",
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
      );
    },
  },

  {
    accessorKey: "number",
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
          {formatPhoneNumber(row.original.sendingNumber?.phoneNumber ?? "") ??
            "No number assigned"}
        </span>
      );
    },
  },

  {
    accessorKey: "status",
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
