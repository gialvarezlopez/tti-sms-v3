import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { UseFieldArrayRemove, useFormContext, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeywordProps } from "@/types/types";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import { keywordOptions } from "@/components/screens/add-keyword/keywordOptions";
import { renderIcon } from "@/lib/utils/utils";

type Props = {
  fields: KeywordProps[];
  remove: UseFieldArrayRemove;
  maxWidthMainDiv: number;
};

const InputTypeKeyword = ({ fields, remove, maxWidthMainDiv }: Props) => {
  const { control, setValue, watch } = useFormContext();

  const keywordValues = useWatch({
    control,
    name: "keywords", // We specify that we want to see the value of 'keywords'
  });

  const handleRemoveKeyword = (index: number, keywordName: string) => {
    remove(index);
    const content = watch("content");
    // Remove the keyword from the text
    const result = removeKeywordFromText(content, keywordName);

    setValue("content", result, { shouldDirty: true });
  };

  const removeKeywordFromText = (text: string, keyword: string) => {
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
      if (!item.type) {
        setValue(`keywords[${index}].type`, item.type, { shouldDirty: true });
      }
    });
  }, [fields, setValue]);

  return (
    <div
      className={`grid ${
        maxWidthMainDiv <= 768 ? "grid-cols-1" : "md:grid-cols-2"
      } gap-4 items-end`}
    >
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
                        onClick={() => handleRemoveKeyword(index, item.keyword)}
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
