import React from "react";
import { IconPlus } from "@/assets/images";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import CreateEditUser from "./CreateEditUser";
import { UserProps } from "@/types/types";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: UserProps;
};
const ModalUser = ({ setIsOpen, user }: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 text-2xl">
          <Image src={IconPlus} alt="Add" />
          {user ? "Update User" : "Add User"}
        </DialogTitle>
        <Separator className="my-2" />
        <DialogDescription className="px-6  pt-3 text-base text-[#1D2433]/80">
          {user
            ? "Please fill the information. "
            : "Add a user filling the information bellow."}
        </DialogDescription>
      </DialogHeader>
      <div>
        <CreateEditUser setIsOpen={setIsOpen} user={user} />
      </div>
    </>
  );
};

export default ModalUser;
