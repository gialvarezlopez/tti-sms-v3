import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { TemplateProps, TicketsProps } from "@/types/types";
import TemplatesSend from "./templates-send/TemplatesSend";

type Props = {
  ticket: TicketsProps;
  modalOpen: boolean;
  onClose: () => void;
};

const ModalSendRemainder = ({ ticket, modalOpen, onClose }: Props) => {
  const [isOpen] = useState(modalOpen);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-md md:max-w-[913px] p-0 max-h-[90vh]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
              Send Reminder
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          <TemplatesSend ticket={ticket} onClose={onClose} isFromModel={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalSendRemainder;
