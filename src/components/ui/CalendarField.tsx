//src/components/screen/clientes/FormularioCliente.tsx
"use client";
import React, { useState } from "react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Control, FieldValues } from "react-hook-form"; // Importa tipos necesarios

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { enCA } from "date-fns/locale";
import { cn } from "@/lib/utils";
import CustomFormMessage from "./CustomFormMessage";

interface CalendarFieldProps {
  control: Control<FieldValues>;
  field: {
    value: Date | undefined; // O el tipo que estés utilizando para la fecha
    onChange: (date: Date) => void;
  };
  labelTitle: string;
  labelButton?: string;
  disabled?: boolean;
  minDate?: Date | undefined; // Fecha mínima para la selección del calendario (se pasa por prop)
  //onChange?: (date: Date) => void; // El nuevo onChange que se pasa como prop
}

const CalendarField: React.FC<CalendarFieldProps> = ({
  field,
  labelTitle,
  labelButton,
  disabled,
  minDate,
  //onChange, // Recibe el onChange como prop
}) => {
  const [isOpen, setIsOpen] = useState(false); // Mueve useState aquí

  return (
    <FormItem className="">
      <FormLabel className="text-[#1D2433]/60 text-xs">{labelTitle}</FormLabel>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              disabled={disabled}
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                //format(field.value, "PPP", { locale: enCA })
                format(field.value, "MM/dd/yyyy", { locale: enCA })
              ) : (
                <span>{labelButton ? labelButton : "Select... "}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex m-1">
            <div className="flex-1"></div>
            <PopoverClose asChild>
              {/*}
              <CircleX
                size={24}
                className="text-primary/60 hover:text-destructive"
                onClick={() => setIsOpen(false)} // Cierra el Popover al hacer clic
              />
              */}
            </PopoverClose>
          </div>

          <Calendar
            locale={enCA}
            mode="single"
            selected={field.value || undefined} // Asegúrate de que sea un único objeto Date o undefined
            onSelect={(date) => {
              if (date) {
                // Verifica que `date` no sea undefined
                field.onChange(date); // Cambia la fecha
                setIsOpen(false); // Cierra el Popover al seleccionar una fecha
              }
            }}
            //onSelect={handleSelect} // Llama a handleSelect aquí
            initialFocus
            disabled={disabled}
            fromDate={minDate}
          />
        </PopoverContent>
      </Popover>

      <CustomFormMessage className="w-full" />
    </FormItem>
  );
};

export default CalendarField;
