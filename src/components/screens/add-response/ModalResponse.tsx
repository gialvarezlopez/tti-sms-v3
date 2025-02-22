import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import FormResponse from "./FormResponse";
import { ResponseProps } from "@/types/types";

type Props = {
  openResponse: boolean;
  setOpenResponse: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseOption: React.Dispatch<React.SetStateAction<ResponseProps>>;
};

const ModalResponse = ({
  openResponse,
  setOpenResponse,
  setResponseOption,
}: Props) => {
  const [isOpen, setIsOpen] = useState(openResponse);
  const closeModal = () => {
    setIsOpen(false);
    setOpenResponse(false);
  };

  useEffect(() => {
    if (openResponse) {
      setIsOpen(true);
    }
  }, [openResponse]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md md:max-w-[559px] p-0">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 text-2xl">
              Add Response
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          <div className="pb-6">
            <FormResponse
              setIsOpen={closeModal}
              setResponseOption={setResponseOption}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalResponse;
