import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { IconWarning } from "@/assets/images";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import useUsersStore from "@/store/useUsers";
import useBranchesStore from "@/store/useBranches";
import { useDeleteMultiplesUsers, useDeleteUser } from "@/hooks/useUsers";
import {
  useDeleteBranch,
  useDeleteMultiplesBranches,
} from "@/hooks/useBranches";

type Props = {
  setClearRowsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlertDelete = ({ setClearRowsSelected }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setIsFormSubmitted] = useState(false);

  //Store
  const { users, clearUsers } = useUsersStore();
  const { branches, clearBranches } = useBranchesStore();

  //Axios
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();
  const { mutate: deleteMultipleUsers, isPending: isDeletingMultipleUsers } =
    useDeleteMultiplesUsers();

  const { mutate: deleteBranch, isPending: isDeletingBranch } =
    useDeleteBranch();
  const {
    mutate: deleteMultipleBranches,
    isPending: isDeletingMultipleBranches,
  } = useDeleteMultiplesBranches();

  const successSubmission = () => {
    closeDialog();
    setClearRowsSelected(true);
    clearUsers();
    clearBranches();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true); // Mark as sent
    setIsDialogOpen(true);

    if (users && users.length === 1 && users[0]?.id) {
      deleteUser(users[0].id, {
        onSuccess(data) {
          successSubmission();
        },
      });
    } else if (users && users.length > 1) {
      //Delete multiple users
      const ids = users
        .map((item) => item.id)
        .filter((id): id is string => id !== undefined);

      deleteMultipleUsers(
        { ids, operation: "delete" },
        {
          onSuccess() {
            successSubmission();
          },
        }
      );
    }

    //Delete single branch
    if (branches && branches.length === 1 && branches[0]?.id) {
      deleteBranch(branches[0].id, {
        onSuccess() {
          successSubmission();
        },
      });
    } else if (branches && branches.length > 1) {
      //Delete multiple branches
      const ids = branches
        .map((item) => item.id)
        .filter((id): id is string => id !== undefined);

      deleteMultipleBranches(
        { ids, operation: "delete" },
        {
          onSuccess() {
            successSubmission();
          },
        }
      );
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    clearUsers();
    clearBranches();
  };

  useEffect(() => {
    if ((users && users.length > 0) || (branches && branches.length > 0)) {
      setIsDialogOpen(true);
    }
  }, [users, branches]);

  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-md md:max-w-[493px] p-0 max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle className="px-6 pt-4">
              <div className="flex justify-between gap-3 pb-2">
                <span className="flex gap-3 items-center font-bold text-2xl">
                  <Image src={IconWarning} alt="Delete" />
                  {users.length > 0 ? "Delete User" : "Delete Branch"}
                </span>
                <button
                  onClick={closeDialog}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
            </AlertDialogTitle>
            <Separator className="my-2" />
            <AlertDialogDescription className="px-6 py-3">
              <p className="pb-2">
                {users.length
                  ? `Are you sure you want to delete ${
                      users.length > 1 ? "these users" : "this user"
                    }? If you continue, this they will be permanently deleted.`
                  : `Are you sure you want to delete ${
                      branches.length > 1 ? "these branches" : "this branch"
                    } ? If you continue, this they will be permanently deleted.`}
              </p>
              <div className="overflow-y-auto max-h-[calc(100vh-350px)] text-left">
                <p className="font-bold mt-2">
                  {users?.map((user, index) => (
                    <p key={index}>{user.name}</p>
                  ))}

                  {branches?.map((branch, index) => (
                    <p key={index}>
                      {branch.name} - {branch.phone_number}
                    </p>
                  ))}
                </p>
              </div>
            </AlertDialogDescription>
            <Separator className="my-3" />
          </AlertDialogHeader>
          <AlertDialogFooter className="px-6 pb-4 pt-2 flex flex-row gap-3">
            <Button
              type="button"
              className="btn-white-normal w-full md:w-[33%]"
              variant={"outline"}
              onClick={closeDialog}
              disabled={
                isDeletingUser ||
                isDeletingBranch ||
                isDeletingMultipleUsers ||
                isDeletingMultipleBranches
              }
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-customRed-v3 w-full md:w-[33%]"
              variant={"destructive"}
              onClick={handleFormSubmit}
              disabled={
                isDeletingUser ||
                isDeletingBranch ||
                isDeletingMultipleUsers ||
                isDeletingMultipleBranches
              }
              isLoading={
                isDeletingUser ||
                isDeletingBranch ||
                isDeletingMultipleUsers ||
                isDeletingMultipleBranches
              }
            >
              {isDeletingUser ||
              isDeletingBranch ||
              isDeletingMultipleUsers ||
              isDeletingMultipleBranches
                ? "Deleting"
                : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDelete;
