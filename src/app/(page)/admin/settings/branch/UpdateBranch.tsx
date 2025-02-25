import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BranchProps } from "@/types/types";
import ModalBranch from "./ModalBranch";

type Props = {
  isOpenModal: boolean;
  handleClose: () => void;
  branch: BranchProps;
};

const UpdateBranch = ({ isOpenModal, handleClose, branch }: Props) => {
  const [isOpen, setIsOpen] = useState(isOpenModal);
  const closeModal = () => {
    setIsOpen(false);
    handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md md:max-w-[473px] p-0 max-h-[90vh]">
          <ModalBranch setIsOpen={closeModal} branch={branch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateBranch;
