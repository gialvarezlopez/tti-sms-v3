import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { IconWarning } from "@/assets/images";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/lib/toastUtil";
import { TicketsProps } from "@/types/types";
import useTicketsStore from "@/store/useTickets";

type Props = {
  handleClearSelected: (value: boolean) => void;
  rowSelected: TicketsProps[];
};

const AlertDeleteTickets = ({ rowSelected, handleClearSelected }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setIsFormSubmitted] = useState(false);

  const { tickets, clearTickets } = useTicketsStore(); // Access the tickets

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setIsDialogOpen(true);

    const message =
      rowSelected.length === 1
        ? "Ticket removed successfully."
        : "Tickets removed successfully.";

    showToast("success", "Success!", message);
    closeDialog();
    handleClearSelected(true);

    clearTickets();
  };

  const ticketList = tickets.length > 0 ? tickets : rowSelected;

  const closeDialog = () => {
    setIsDialogOpen(false);
    clearTickets();
  };

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      setIsDialogOpen(true);
    }
  }, [tickets]);

  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="btn-white-bold"
            disabled={rowSelected.length === 0}
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-md md:max-w-[493px] p-0 max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle className="px-6 pt-4">
              <div className="flex justify-between gap-3 pb-2">
                <span className="flex gap-3 items-center font-bold text-2xl">
                  <Image src={IconWarning} alt="Delete" />
                  Delete {rowSelected.length > 1 ? "Tickets" : "Ticket"}
                </span>
                <button
                  onClick={closeDialog}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
            </AlertDialogTitle>
            <Separator className="my-2" />
            <AlertDialogDescription className="px-6 py-3">
              <p className="pb-2">
                {`Are you sure you want to delete ${
                  ticketList.length > 1 ? "these tickets" : "this ticket"
                }? If you continue, this they will be permanently deleted.`}
              </p>
              <div className="overflow-y-auto max-h-[calc(100vh-270px)]">
                <p className="font-bold mt-2">
                  {ticketList?.map((ticket, index) => (
                    <p key={index}>
                      {ticket.client} - {ticket.phoneNumber} - {ticket.branch}
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
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-customRed-v3 w-1/2 md:w-[33%]"
              variant={"destructive"}
              onClick={handleFormSubmit}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDeleteTickets;
