import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconWarning } from "@/assets/images";
import FormCloseTicket from "./FormCloseTicket";
import { Separator } from "@/components/ui/separator";
import useTicketsStore from "@/store/useTickets";
import { TicketsProps } from "@/types/types";

type Props = {
  rowSelected: TicketsProps[];
  handleClearSelected: (value: boolean) => void;
};

const CloseTicket = ({ rowSelected, handleClearSelected }: Props) => {
  const { tickets, setTickets } = useTicketsStore();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setTickets([]);
    setIsOpen(false);
  };

  const ticketList = tickets.length > 0 ? tickets : rowSelected;

  useEffect(() => {
    if (tickets.length > 0) {
      setIsOpen(true);
    }
  }, [tickets]);

  return (
    <div className="flex-1">
      <Button
        disabled={!rowSelected.length}
        type="button"
        className="btn-white-bold w-full md:w-auto"
        onClick={() => setIsOpen(true)}
      >
        {`Close Selected Ticket(s)`}
      </Button>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md md:max-w-[559px] p-0">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 text-2xl">
              <Image src={IconWarning} alt="Close Ticket" /> Close Ticket
            </DialogTitle>
            <Separator className="my-2" />
            <DialogDescription className="px-6  pt-3 text-base text-[#1D2433]/80">
              Please provide a reason for close the{" "}
              {`${ticketList.length > 1 ? "tickets" : "ticket"}`}.
            </DialogDescription>
          </DialogHeader>

          <div className="pb-6">
            <FormCloseTicket
              setIsOpen={closeModal}
              handleClearSelected={handleClearSelected}
              tickets={ticketList}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CloseTicket;
