import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toastUtil";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconTicketDetail } from "@/assets/images";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { TicketsProps } from "@/types/types";
import Features from "./Features";
import { MESSAGE_EXCHANGE } from "@/lib/constants";
import { generateSlug, templateType } from "@/lib/utils/utils";

type Props = {
  ticket: TicketsProps;
  modalOpen: boolean;
  onClose: () => void;
  hideButtonsActions?: boolean;
  setResendMessageOrReminder?: Dispatch<SetStateAction<string>>;
};

const ModalPreviewTicket = ({
  ticket,
  modalOpen,
  onClose,
  hideButtonsActions,
  setResendMessageOrReminder,
}: Props) => {
  const [isOpen] = useState(modalOpen);

  const handleResendMessage = (resendType: string) => {
    if (resendType && setResendMessageOrReminder) {
      setResendMessageOrReminder(resendType);
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-md md:max-w-[650px] p-0 max-h-[90vh]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
              <Image src={IconTicketDetail} alt="Details" /> Ticket Details
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              <Features ticket={ticket} />
            </div>
          </div>

          <DialogFooter>
            <div className="flex flex-grow gap-3 justify-end px-6 py-5">
              {hideButtonsActions ? (
                <Button
                  type="button"
                  className="btn-white-normal w-full md:w-[33%] semibold"
                  variant={"outline"}
                  onClick={onClose}
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    className="btn-white-normal w-full md:w-[33%] semibold"
                    variant={"outline"}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-customRed-v3 w-full md:w-[33%]"
                    variant={"destructive"}
                    onClick={() =>
                      handleResendMessage(
                        ticket.template?.isTwoWay ?? false
                          ? "reminder"
                          : "message"
                      )
                    }
                  >
                    {generateSlug(
                      templateType(ticket.template?.isTwoWay ?? false)
                    ) === MESSAGE_EXCHANGE.ONE_WAY
                      ? "Resend Message"
                      : "Resend Reminder"}
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalPreviewTicket;
