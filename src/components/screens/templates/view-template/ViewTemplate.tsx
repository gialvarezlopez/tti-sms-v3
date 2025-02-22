import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TemplateProps } from "@/types/types";
import Features from "./Features";

type Props = {
  template: TemplateProps;
  modalOpen: boolean;
  onClose: () => void;
};

const ModalViewTemplate = ({ template, modalOpen, onClose }: Props) => {
  const [isOpen] = useState(modalOpen);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md md:max-w-[650px] p-0 max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
              Template View
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              <Features template={template} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalViewTemplate;
