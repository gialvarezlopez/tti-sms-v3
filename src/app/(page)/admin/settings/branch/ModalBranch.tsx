import React from "react";
import { IconPlus } from "@/assets/images";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { BranchProps } from "@/types/types";
import CreateEditBranch from "./CreateEditBranch";

type Props = {
  branch?: BranchProps;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ModalBranch = ({ setIsOpen, branch }: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3">
          {branch ? (
            "Update Branch"
          ) : (
            <>
              <Image src={IconPlus} alt="Add" /> Add Branch
            </>
          )}
        </DialogTitle>
        <Separator className="my-2" />
      </DialogHeader>
      <div>
        <CreateEditBranch setIsOpen={setIsOpen} branch={branch} />
      </div>
    </>
  );
};

export default ModalBranch;
