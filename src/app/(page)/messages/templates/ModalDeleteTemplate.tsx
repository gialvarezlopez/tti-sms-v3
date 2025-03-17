import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { TemplateProps } from "@/types/types";
import { useDeleteTemplate } from "@/hooks/useTemplates";

type Props = {
  rowSelected: TemplateProps;
  onCloseMenu: () => void;
};

const ModalDeleteTicket = ({ rowSelected, onCloseMenu }: Props) => {
  const { mutate, isPending } = useDeleteTemplate();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
    onCloseMenu();
  };

  const handleDelete = () => {
    mutate(rowSelected?.id as string, {
      onSuccess(data) {
        closeModal();
        onCloseMenu();
      },
    });
  };

  return (
    <div>
      <span
        className="w-full cursor-pointer hover:bg-[#FFF2F2] block p-3 text-sm font-normal"
        onClick={() => setIsOpen(true)}
      >
        Delete
      </span>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md md:max-w-[570px] p-0 space-y-0">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 text-2xl">
              <Image src={IconWarning} alt="Delete Template" /> Delete Template
            </DialogTitle>
            <Separator className="my-2" />
            <DialogDescription className="px-6  pt-3 text-base text-[#1D2433]/80">
              Are you sure you want to delete this template? If you continue,
              this they will be permanently deleted and you will no longer have
              access to it.
            </DialogDescription>
            <div className="pb-6">
              <Separator className="mb-6 mt-3" />
              <div className="flex flex-grow gap-3 justify-end  px-6">
                <Button
                  type="button"
                  className="btn-white-normal w-full md:w-[33%] semibold"
                  variant={"outline"}
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-customRed-v3 w-full md:w-[33%]"
                  variant={"destructive"}
                  onClick={handleDelete}
                  disabled={isPending}
                  isLoading={isPending}
                >
                  {isPending ? "Deleting" : "Delete"}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalDeleteTicket;
