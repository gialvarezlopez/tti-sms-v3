import { Button } from "@/components/ui/button";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
//import { Input } from "@/components/ui/input";
import { KeywordProps } from "@/types/types";
import React, { useEffect } from "react";
import { UseFieldArrayRemove, useFormContext, useWatch } from "react-hook-form";

//import CalendarField from "@/components/ui/CalendarField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { keywordOptions } from "@/components/screens/add-keyword/keywordOptions";
import { CalendarRange, DollarSign, Hash, LetterText } from "lucide-react";

type Props = {
  fields: KeywordProps[];
  remove: UseFieldArrayRemove;
  //setMessage: React.Dispatch<React.SetStateAction<string>>;
  //message: string;
};

const InputTypeKeyword = ({
  fields,
  remove /*setMessage, message*/,
}: Props) => {
  const { control, setValue, watch } = useFormContext();

  // Usamos `watch` para escuchar los cambios en el campo select
  const keywordValues = useWatch({
    control,
    name: "keywords", // Especificamos que queremos ver el valor de 'keywords'
  });

  const handleRemoveKeyword = (index: number, keywordName: string) => {
    remove(index);
    const content = watch("content");
    const result = removeKeywordFromText(content, keywordName);
    setValue("content", result, { shouldDirty: true });
    //setMessage(result);
  };

  const removeKeywordFromText = (text: string, keyword: string) => {
    // Creamos una expresión regular dinámica que busque la palabra clave dentro de corchetes
    const regex = new RegExp(`\\[${keyword}\\]`, "g");

    // Reemplazamos la palabra clave por una cadena vacía, eliminándola del texto
    const processedText = text
      .replace(regex, "")
      .replace(/\s{2,}/g, " ")
      .trim(); // También eliminamos los espacios extras

    return processedText;
  };

  const renderIcon = (type: string) => {
    // Función para devolver el ícono según el tipo seleccionado
    switch (type) {
      case "date":
        return <CalendarRange />;
      case "number":
        return <Hash />;
      case "currency":
        return <DollarSign />;
      default:
        return <LetterText />;
    }
  };

  useEffect(() => {
    console.log("fields", fields);
    fields.forEach((item, index) => {
      if (!item.type) {
        setValue(`keywords[${index}].type`, item.type, { shouldDirty: true });
        console.log("fields", fields);
      }
    });
  }, [fields, setValue]);

  return (
    <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 items-end">
      {/*JSON.stringify(fields)*/}
      {fields.map((item, index) => (
        <div key={item.id} className="w-full bg-red">
          {
            <>
              <FormField
                control={control}
                name={`keywords[${index}].keyword`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="w-full"></FormControl>
                    <CustomFormMessage className="w-full" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`keywords[${index}].type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex gap-3 justify-between items-center">
                      <span>{item.keyword}</span>
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => handleRemoveKeyword(index, item.keyword)} // Elimina el campo cuando se hace clic
                        className="text-customRed-v1"
                      >
                        Remove
                      </Button>
                    </FormLabel>

                    <div className="flex gap-1 items-center">
                      {renderIcon(
                        keywordValues[index]?.type
                          ? keywordValues[index]?.type
                          : item.type
                      )}

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          field.value === "string"
                            ? "text"
                            : field.value ||
                              (item.type !== "string" ? item.type : "currency")
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />{" "}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {keywordOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <CustomFormMessage className="w-full" />
                  </FormItem>
                )}
              />
            </>
          }
        </div>
      ))}
    </div>
  );
};

export default InputTypeKeyword;
