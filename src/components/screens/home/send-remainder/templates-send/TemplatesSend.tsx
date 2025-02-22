import React, { useState } from "react";
import TemplateSelection from "../../../templates/TemplateSelection";
import { TicketsProps } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FormBuildMessage from "../../../templates/BuildTemplate/FormBuildMessage";

type Props = {
  ticket: TicketsProps;
  onClose: () => void;
};

const TemplatesSend = ({ ticket, onClose }: Props) => {
  const [templateSelected, setTemplateSelected] = useState<string | undefined>(
    undefined
  );

  const [isNextStep, setIsNextStep] = useState(false);

  const handleNextStep = () => {
    if (templateSelected) {
      setIsNextStep(true);
    }
  };
  return (
    <>
      {!isNextStep && (
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6">
          <TemplateSelection
            setTemplateSelected={setTemplateSelected}
            isLink={false}
          />
        </div>
      )}

      {isNextStep && (
        <FormBuildMessage
          onClose={onClose}
          ticket={ticket}
          isFromModal={true}
          //dataTemplates={dataTemplates}
          //setTemplateSelected={setTemplateSelected}
        />
      )}

      {!isNextStep && (
        <div className="mb-4">
          <Separator className="my-2" />
          <div className="flex flex-grow gap-3 justify-end  px-6 pt-3">
            <Button
              type="button"
              className="btn-white-normal w-full md:w-[160px] semibold"
              variant={"outline"}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-customRed-v3 w-full md:w-[160px]"
              variant={"destructive"}
              onClick={handleNextStep}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatesSend;
