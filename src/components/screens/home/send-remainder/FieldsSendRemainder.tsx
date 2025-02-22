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
import { TYPE_OF_MESSAGE } from "@/lib/constants";
import { convertToSnakeCase, highlightKeyword } from "@/lib/utils";

type Props = {
  ticket: TicketsProps;
};

const FieldsBuildRemainder = ({ ticket }: Props) => {
  const { control, watch } = useFormContext();
  const [modelNumber, setModelNumber] = useState<string>("");

  // Se usa useEffect para inicializar el valor del modelNumber con el valor de ticket.chat
  useEffect(() => {
    if (ticket.chat && ticket.chat.length > 0) {
      setModelNumber(ticket.chat[0]?.keyword || ""); // Inicializamos con el valor de la keyword
    }
  }, [ticket.chat]);

  // Función para manejar el cambio en el campo modelNumber
  const handleModelNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelNumber(e.target.value); // Actualizamos el modelNumber con el valor del input
  };

  // Función para renderizar el mensaje dinámico
  const renderMessage = () => {
    // El mensaje original debe ser dinámico, por ejemplo, de ticket.chat
    const message =
      ticket.chat && ticket.chat[0]?.message
        ? ticket.chat[0]?.message
        : "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.";

    return message;
  };

  return (
    <div className="pb-2">
      <div className="px-6 w-full md:w-1/2">
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

      <div className="px-6 space-y-2">
        <Separator className="my-6" />
        <h6 className="font-semibold text-base">Message</h6>
        <div className="pl-2">
          {/* Aquí usamos highlightKeyword para reemplazar {{}} por modelNumber */}
          <div
            dangerouslySetInnerHTML={{
              __html: highlightKeyword(renderMessage(), modelNumber),
            }}
          />
        </div>
      </div>

      <div className="px-6 space-y-2">
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
                    value={modelNumber} // El campo está controlado por el estado
                    onChange={handleModelNumberChange} // Actualiza el modelNumber al cambiar
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

export default FieldsBuildRemainder;
