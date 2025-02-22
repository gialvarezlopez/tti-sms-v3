import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CustomInputMask from "@/components/ui/customInputMask";
import CustomFormMessage from "../../../ui/CustomFormMessage";
import { TicketsProps } from "@/types/types";
import { highlightKeyword } from "@/lib/utils";

type Props = {
  ticket: TicketsProps;
};

const FieldsResendMessage = ({ ticket }: Props) => {
  const { control } = useFormContext();
  const [modelNumber, setModelNumber] = useState<string>("");

  useEffect(() => {
    if (ticket?.chat && ticket?.chat?.length > 0) {
      //setModelNumber(ticket?.chat[0]?.keyword || "");
    }
  }, [ticket?.chat]);

  const handleModelNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelNumber(e.target.value);
  };

  const renderMessage = () => {
    const message =
      ticket?.chat && ticket?.chat[0]?.message ? ticket?.chat[0]?.message : "";

    return message;
  };

  return (
    <div className="pb-2">
      <div className="w-full md:w-1/2">
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone number</FormLabel>
              <FormControl>
                <CustomInputMask
                  mask="(999) 999-9999"
                  placeholder={"Telephone number"}
                  type="text"
                  {...field}
                  upperCase={true}
                />
              </FormControl>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>

      <div className=" space-y-2">
        <Separator className="my-6" />
        <h6 className="font-semibold text-base">Message</h6>
        <div className="pl-2">
          {/* Aquí usamos highlightKeyword para reemplazar {{}} por modelNumber */}
          <div
            dangerouslySetInnerHTML={{
              __html: highlightKeyword(
                renderMessage(),
                modelNumber ? modelNumber : ticket?.chat[0]?.keyword ?? ""
              ),
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Separator className="my-6" />
        <div className="w-full md:w-1/2">
          <FormField
            control={control}
            name="modelNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SV or Model Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SV or Model Number"
                    {...field}
                    //value={modelNumber} // El campo está controlado por el estado
                    //onChange={handleModelNumberChange} // Actualiza el modelNumber al cambiar
                    onChange={(e) => {
                      field.onChange(e);
                      handleModelNumberChange(e);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FieldsResendMessage;
