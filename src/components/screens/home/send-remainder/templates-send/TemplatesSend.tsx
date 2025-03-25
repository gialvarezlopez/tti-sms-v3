import React, { useEffect, useRef, useState } from "react";
import TemplateSelection from "../../../templates/TemplateSelection";
import { TemplateProps, TicketsProps } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FormBuildMessage from "../../../templates/BuildTemplate/FormBuildMessage";
import { useSingleTemplate } from "@/hooks/useTemplates";
import { showToast } from "@/lib/toastUtil";

type Props = {
  ticket: TicketsProps;
  onClose: () => void;
  isFromModel?: true;
  typeOperation: string;
};

const TemplatesSend = ({
  ticket,
  onClose,
  isFromModel,
  typeOperation,
}: Props) => {
  const [templateSelected, setTemplateSelected] = useState<string | undefined>(
    undefined
  );

  const [doAutoClick, setDoAutoClick] = useState(false);
  const autoClickRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: currentTemplate,
    isFetching,
    error,
  } = useSingleTemplate((templateSelected as string) ?? "");

  const [isNextStep, setIsNextStep] = useState(false);

  const handleNextStep = () => {
    if (templateSelected) {
      setIsNextStep(true);
    }
  };

  useEffect(() => {
    if (error) {
      showToast(
        "destructive",
        "Error!",
        `${error.message ?? "There was an error to get the data"}`
      );
    }
  }, [error]);

  useEffect(() => {
    if (doAutoClick) {
      setTimeout(() => {
        if (autoClickRef.current) {
          autoClickRef.current.click();
        }
      }, 500);
    }
  }, [doAutoClick]);

  const template = currentTemplate?.data || [];
  return (
    <>
      {!isNextStep && (
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6">
          <TemplateSelection
            setTemplateSelected={setTemplateSelected}
            isLink={false}
            isFromModel={isFromModel}
            templateId={ticket?.template?.id ?? ""}
            setDoAutoClick={setDoAutoClick}
          />
        </div>
      )}
      {isNextStep && (
        <FormBuildMessage
          onClose={onClose}
          template={template}
          isFromModal={true}
          ticket={ticket}
          typeOperation={typeOperation}
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
              disabled={isFetching || !templateSelected}
              ref={doAutoClick ? autoClickRef : null}
            >
              {isFetching ? "Loading" : "Next"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatesSend;
