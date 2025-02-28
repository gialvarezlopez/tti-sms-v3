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
import { showToast } from "@/lib/toastUtil";
//import { BranchProps, UserProps } from "@/types/types";
import useUsersStore from "@/store/useUsers";
import useBranchesStore from "@/store/useBranches";
import { useDeleteUser } from "@/hooks/useUsers";
import { useDeleteBranch } from "@/hooks/useBranches";

type Props = {
  //branchesSelected: BranchProps[];
  //usersSelected: UserProps[];
  setClearRowsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlertDelete = ({
  setClearRowsSelected,
}: //branchesSelected,
//usersSelected,
Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setIsFormSubmitted] = useState(false);

  //Store
  const { users, clearUsers } = useUsersStore(); // Accedes a los usuarios
  const { branches, clearBranches } = useBranchesStore(); // Accedes a los usuarios

  //Axios
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();
  const { mutate: deleteBranch, isPending: isDeletingBranch } =
    useDeleteBranch();

  const successSubmission = () => {
    closeDialog();
    setClearRowsSelected(true);
    clearUsers();
    clearBranches();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula una espera
    setIsFormSubmitted(true); // Marcar como enviado
    setIsDialogOpen(true); // Mostrar el diálogo después de la confirmación

    // Mensaje para los usuarios seleccionados
    const userMessage =
      users.length === 1
        ? "User removed successfully."
        : users.length > 1
        ? "Users removed successfully."
        : "";

    // Mensaje para las ramas seleccionadas
    const branchMessage =
      branches.length === 1
        ? "Branch removed successfully."
        : branches.length > 1
        ? "Branches removed successfully."
        : "";

    const message = userMessage || branchMessage;
    //showToast("success", "Success!", message);
    /*
    closeDialog();
    setClearRowsSelected(true);
    clearUsers();
    clearBranches();
    console.log("users", users);
    */

    //Delete single user
    if (users && users.length === 1 && users[0]?.id) {
      deleteUser(users[0].id, {
        onSuccess(data) {
          successSubmission();
        },
      });
    }

    //Delete single branch
    if (branches && branches.length === 1 && branches[0]?.id) {
      deleteBranch(branches[0].id, {
        onSuccess(data) {
          successSubmission();
        },
      });
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false); // Cerrar el diálogo cuando se haga una acción
    //onClose();
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
                  <X size={20} /> {/* El ícono de la X */}
                </button>
              </div>
            </AlertDialogTitle>
            <Separator className="my-2" />
            <AlertDialogDescription className="px-6 py-3">
              <p className="pb-2">
                {users.length
                  ? "Are you sure you want to delete this user? If you continue, this they will be permanently deleted."
                  : "Are you sure you want to delete this branch? If you continue, this they will be permanently deleted."}
              </p>
              <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
                <p className="font-bold mt-2">
                  {users?.map((user, index) => (
                    <p key={index}>{user.name}</p>
                  ))}

                  {branches?.map((branch, index) => (
                    <p key={index}>
                      {branch.name} - {branch.number}
                    </p>
                  ))}
                </p>
              </div>
            </AlertDialogDescription>
            <Separator className="my-3" />
          </AlertDialogHeader>
          <AlertDialogFooter className="px-6 pb-4 pt-2">
            <Button
              type="button"
              className="btn-white-normal w-1/2 md:w-[33%]"
              variant={"outline"}
              onClick={closeDialog}
              disabled={isDeletingUser || isDeletingBranch}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-customRed-v3 w-1/2 md:w-[33%]"
              variant={"destructive"}
              onClick={handleFormSubmit}
              disabled={isDeletingUser || isDeletingBranch}
              isLoading={isDeletingUser || isDeletingBranch}
            >
              {isDeletingUser || isDeletingBranch ? "Deleting" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDelete;
