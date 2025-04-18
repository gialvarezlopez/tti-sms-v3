import React, { useEffect } from "react";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AutomaticResponsesTemplates } from "@/types/types";

type Props = {
  fields: AutomaticResponsesTemplates[];
  remove: UseFieldArrayRemove;
  maxWidthMainDiv: number;
};

const InputTypeResponse = ({ fields, remove, maxWidthMainDiv }: Props) => {
  const { control, setValue, watch } = useFormContext();

  const handleRemoveResponse = (index: number, keywordName: string) => {
    remove(index);
    const content = watch("content");
    // Remove the response from the text
    const result = removeResponseFromText(content, keywordName);
    setValue("content", result, { shouldDirty: true });
  };

  const removeResponseFromText = (text: string, keyword: string) => {
    // We create a dynamic regular expression that searches for the keyword within brackets
    const regex = new RegExp(`\\[${keyword}\\]`, "g");

    // We replace the keyword with an empty string, removing it from the text
    const processedText = text
      .replace(regex, "") // Delete the keyword
      .replace(/\n/g, "\n") // Ensures that line breaks are preserved
      // .replace(/\s{2,}/g, " "); // Normalize white spaces
      .replace(/[ ]{2,}/g, " ") // Normalizes only consecutive spaces (does not affect line breaks)
      .trim();

    return processedText;
  };

  useEffect(() => {
    fields.forEach((item, index) => {
      setValue(`responses[${index}].response`, item.response);
      setValue(`responses[${index}].reply`, item.reply);
      setValue(`responses[${index}].isInvalidReply`, item.isInvalidReply);
    });

    console.log("fields", fields);
  }, [fields, setValue]);

  return (
    <div
      className={`mb-4 grid ${
        maxWidthMainDiv <= 768 ? " grid-cols-1" : "md:grid-cols-2"
      }  gap-2 md:gap-4 h-full items-end`}
    >
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="border border-[#CCD1DC] rounded-md px-3  pb-3 md:pb-6 md:px-6 h-full space-y-3"
        >
          <div className="w-full bg-red">
            <FormField
              control={control}
              name={`responses[${index}].response`}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-base font-semibold flex gap-3 justify-between items-center">
                    Response Value
                    <Button
                      variant="link"
                      type="button"
                      onClick={() =>
                        handleRemoveResponse(index, item?.response ?? "")
                      }
                      className="text-customRed-v1"
                    >
                      Remove
                    </Button>
                  </FormLabel>

                  <FormControl className="w-full">
                    <div>{item.response}</div>
                  </FormControl>

                  <CustomFormMessage className="w-full" />
                </FormItem>
              )}
            />
          </div>
          <div className="">
            <FormField
              control={control}
              name={`responses[${index}].reply`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex gap-3 justify-between items-center">
                    {item.isInvalidReply ? "Invalid Reply" : "Automatic Reply"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                      defaultValue={item.reply}
                    />
                  </FormControl>
                  <CustomFormMessage className="w-full" />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InputTypeResponse;
