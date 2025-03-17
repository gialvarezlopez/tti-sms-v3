import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FormReviewMessageProps, TemplateProps } from "@/types/types";
import DetailConfirm from "./DetailConfirm";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateMessage } from "@/hooks/useMessages";
import { getJustNumber } from "@/lib/utils/utils";

type Props = {
  template: TemplateProps;
  modalOpen: boolean;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  formState: FormReviewMessageProps;
};

const MessageReviewConfirm = ({
  template,
  modalOpen,
  setOpenConfirm,
  formState,
}: Props) => {
  const [isOpen, setIsOpen] = useState(modalOpen);
  const [isChecked, setIsChecked] = useState(false);

  const { mutate: createMessage, isPending: isCreating } = useCreateMessage();

  const handleCloseModal = () => {
    setOpenConfirm(false);
    setIsOpen(false);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleSetConfirm = () => {
    const stringWithoutHtml =
      formState &&
      formState?.content &&
      formState?.content.replace(/<[^>]*>/g, "");

    const cleanData = {
      ...formState,
      message: { content: stringWithoutHtml },
      template_id: template?.id,
      recipient_number: getJustNumber(formState?.recipient_number ?? ""),
    };
    delete cleanData.content;
    delete cleanData.keywords;
    delete cleanData.responses;

    createMessage(cleanData, {
      onSuccess() {
        handleCloseModal();
      },
    });
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md md:max-w-[650px] p-0 max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
              Message Review
            </DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              <DetailConfirm formState={formState} template={template} />
            </div>
            <div className="flex items-center space-x-2  px-6 py-3 pb-2">
              <Checkbox
                id="terms"
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium cursor-pointer"
              >
                Accept terms and conditions
              </label>
            </div>
            <Separator className="my-2" />
          </div>

          <DialogFooter>
            <div className="flex flex-grow gap-3 justify-end px-6 pb-5 pt-2">
              <Button
                type="button"
                className="btn-white-normal w-full md:w-[33%] semibold"
                variant={"outline"}
                onClick={handleCloseModal}
              >
                Edit
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-full md:w-[33%]"
                variant={"destructive"}
                onClick={handleSetConfirm}
                disabled={!isChecked || isCreating}
                isLoading={isCreating}
              >
                {isCreating ? "Sending " : "Send"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageReviewConfirm;
