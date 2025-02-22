import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TicketsProps } from "@/types/types";
import FormBuildMessage from "../../templates/BuildTemplate/FormBuildMessage";

type Props = {
  ticket: TicketsProps;
  modalOpen: boolean;
  onClose: () => void;
};

const ModalResendTicket = ({ ticket, modalOpen, onClose }: Props) => {
  const [isOpen] = useState(modalOpen);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md md:max-w-[650px] p-0 max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
              Resend Ticket
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          <FormBuildMessage
            ticket={ticket}
            onClose={onClose}
            isFromModal={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalResendTicket;
