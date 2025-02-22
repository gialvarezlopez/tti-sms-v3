import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import FormKeyword from "./FormKeyword";
import { KeywordProps } from "@/types/types";

type Props = {
  openKeyword: boolean;
  setOpenKeyword: React.Dispatch<React.SetStateAction<boolean>>;
  setKeywordOption: React.Dispatch<React.SetStateAction<KeywordProps>>;
};

const ModalKeyword = ({
  openKeyword,
  setOpenKeyword,
  setKeywordOption,
}: Props) => {
  const [isOpen, setIsOpen] = useState(openKeyword);
  const closeModal = () => {
    setIsOpen(false);
    setOpenKeyword(false);
  };

  useEffect(() => {
    if (openKeyword) {
      setIsOpen(true);
    }
  }, [openKeyword]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md md:max-w-[559px] p-0">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 text-2xl">
              Add Keyword
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          <div className="pb-6">
            <FormKeyword
              setIsOpen={closeModal}
              setKeywordOption={setKeywordOption}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalKeyword;
