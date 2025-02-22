import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Add from "./Add";
import ModalUser from "./users/ModalUser";
import ModalBranch from "./branch/ModalBranch";

type Props = {
  selectedValue: string;
};

const ModalAdd = ({ selectedValue }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [formSelected, setFormSelected] = useState("");
  const closeModal = () => {
    setIsOpen(false);
    setFormSelected("");
    setIsNext(false);
  };

  return (
    <div>
      <Button
        type="submit"
        className="bg-customRed-v3 px-8"
        variant={"destructive"}
        onClick={() => setIsOpen(true)}
      >
        Add
      </Button>

      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md md:max-w-[473px] p-0 max-h-[90vh]">
          {!isNext && (
            <Add
              setIsNext={setIsNext}
              setIsOpen={closeModal}
              selectedValue={selectedValue}
              setFormSelected={setFormSelected}
            />
          )}

          {isNext && formSelected === "user" && (
            <ModalUser setIsOpen={closeModal} />
          )}

          {isNext && formSelected === "branch" && (
            <ModalBranch setIsOpen={closeModal} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalAdd;
