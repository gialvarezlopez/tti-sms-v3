import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { UserProps } from "@/types/types";
import FormReset from "./FormReset";

type Props = {
  user: UserProps;
  modalOpen: boolean;
  onClose: () => void;
};

const ModalResetPassword = ({ user, modalOpen, onClose }: Props) => {
  const [isOpen] = useState(modalOpen);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md md:max-w-[493px] p-0 max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
              Reset Password
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>
          <DialogDescription className="px-6  pt-3 text-base text-[#1D2433]/80">
            An email will be sent to help the user reset their password.
          </DialogDescription>
          <FormReset user={user} onClose={onClose} />
          {/*<TemplatesSend ticket={ticket} onClose={onClose} />*/}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalResetPassword;
