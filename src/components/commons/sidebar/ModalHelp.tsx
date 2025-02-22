import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "@/components/ui/button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalHelp = ({ isOpen, onClose }: ModalProps) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[425px] bg-[#FCFCFC]/100 rounded-lg p-4 max-w-full md:max-w-[500px] mx-3 boxShadow-400"
          overlayColor="bg-black/40"
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex gap-3 items-center">
                <span className="font-bold text-2xl">Help</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-base text-black pt-4">
              <div className="space-y-3">
                <p>
                  You can find your device IMEI in the following ways Open your
                  phone app and dial *#06#. The IMEI will display on your
                  screen.
                </p>
                <p>
                  <strong>iPhone:</strong> Open the Settings app, search
                  General, then Select About. Search for the IMEI or Physical
                  SIM section. The IMEI will be listed there.
                </p>
                <p>
                  <strong>Android:</strong> Open the Settings App, Seach About
                  Phone, and Scroll to get the IMEI or IMEI1.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalHelp;
