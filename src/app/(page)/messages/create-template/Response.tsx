import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AutomaticResponsesTemplates, ResponseProps } from "@/types/types";
import React, { useEffect } from "react";
import { FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import InputTypeResponse from "./InputTypeResponse";

// Define el tipo de los elementos en fields
type FormValues = {
  responses: AutomaticResponsesTemplates[]; // Asegúrate de que la propiedad "responses" tenga este tipo
};

type Props = {
  setOpenResponse: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseOption: React.Dispatch<React.SetStateAction<ResponseProps>>;
  responseOption: ResponseProps;
  errors: FieldErrors<{
    responses: {
      response: string;
      reply: string;
    }[];
    branch?: string[] | undefined;
  }>;
  //setMessage: React.Dispatch<React.SetStateAction<string>>;
  //message: string;
};

const Response = ({
  setOpenResponse,
  responseOption,
  setResponseOption,
  errors,
}: //setMessage,
//message,
Props) => {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "responses",
  });

  useEffect(() => {
    console.log("responseOption.name", responseOption.responseName);
    if (
      responseOption &&
      responseOption.responseName &&
      responseOption.automaticReply
    ) {
      const exists = fields.some(
        (field) => field.response === responseOption.responseName
      );

      if (!exists) {
        append({
          id: String(Date.now()),
          response: responseOption.responseName,
          reply: responseOption.automaticReply,
        });
      }

      if (fields.length === 0) {
        setResponseOption({ responseName: "", automaticReply: "" });
      }

      console.log("fields", fields);
    }
  }, [fields, responseOption, append, setResponseOption]);

  return (
    <>
      <Separator className="mt-6" />
      <div className="flex flex-col">
        <div className="flex justify-between gap-3 md:pt-6 w-full flex-col md:flex-row order-2">
          <div className="flex gap-3 items-center flex-1 text-xl font-bold">
            Automatic Responses{" "}
          </div>
          <Button
            type="button"
            className={`bg-customRed-v3 px-8`}
            variant={"destructive"}
            onClick={() => setOpenResponse(true)}
          >
            Add Responses
          </Button>
        </div>
        {errors && errors.responses?.message && (
          <div className="mt-3 font-medium bg-customRed-v4 text-[#1D2433] formMessageError rounded relative text-xs inline-block showIconError w-full">
            {errors.responses?.message}
          </div>
        )}
        <div className="mt-6 order-1 md:order-2">
          <InputTypeResponse
            fields={fields as unknown as AutomaticResponsesTemplates[]}
            remove={remove}
            //setMessage={setMessage}
            //message={message}
          />
        </div>
      </div>
    </>
  );
};

export default Response;
