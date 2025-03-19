import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ModalUser from "./ModalUser";
import { UserProps } from "@/types/types";

type Props = {
  user: UserProps;
  isOpenModal: boolean;
  handleClose: () => void;
};

const UpdateUser = ({ user, isOpenModal, handleClose }: Props) => {
  const [isOpen, setIsOpen] = useState(isOpenModal);
  const closeModal = () => {
    setIsOpen(false);
    handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent
          className="sm:max-w-md md:max-w-[473px] p-0 max-h-[90vh]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <ModalUser setIsOpen={closeModal} user={user} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateUser;
