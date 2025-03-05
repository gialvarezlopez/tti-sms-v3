import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { format } from "date-fns";
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
import { KeywordTemplates, TemplateProps } from "@/types/types";
import { cn, highlightKeyword } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  template: TemplateProps;
  isFromModal: boolean;
};

interface Keyword {
  id?: string;
  keyword: string;
  value: string;
  type: string;
}

const FieldsResendMessage = ({ template, isFromModal }: Props) => {
  const { control, setValue, watch, getValues } = useFormContext();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { fields, replace } = useFieldArray({
    control,
    name: "keywords",
  });

  const isValidDate = (date: string) => {
    return date && !isNaN(new Date(date).getTime());
  };

  const handleKeywordChange = (index: number, value: string) => {
    // Update the value of the keyword
    setValue(`keywords[${index}].value`, value);

    // Get the latest keyword values
    const keywordValues = getValues("keywords") as Keyword[];

    const message = template?.content ?? "";
    const updatedMessage = highlightKeyword(
      message,
      keywordValues?.map(({ keyword, value }) => ({ keyword, value })) ?? []
    );
    const stringWithoutHtml = updatedMessage; // updatedMessage.replace(/<[^>]*>/g, "");
    setValue("content", stringWithoutHtml, { shouldDirty: true });
  };

  useEffect(() => {
    if (template && template.keywords) {
      const existingKeywords = watch("keywords");
      const existingKeywordValues = existingKeywords?.map(
        (item: KeywordTemplates) => item.keyword
      );

      // Create a new array with the correct values
      const newKeywords = template.keywords.map((item) => ({
        keyword: item.keyword,
        type: item.type,
        value: item.keyword,
      }));

      // Replace the entire array
      replace(newKeywords);
    }
  }, [template, replace, watch]);

  return (
    <div className="pb-2">
      <div className="w-full grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={"Client Name"}
                  type="text"
                  {...field}
                  readOnly={isFromModal}
                />
              </FormControl>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />

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
                  readOnly={isFromModal}
                />
              </FormControl>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <div>
          <Separator className="my-6" />
          <h6 className="font-semibold text-base">Message</h6>
          <div className="pl-2">
            <div
              dangerouslySetInnerHTML={{
                __html: highlightKeyword(
                  watch("content") || template.content,
                  (getValues("keywords") as Keyword[])?.map(
                    ({ keyword, value }) => ({
                      keyword,
                      value,
                    })
                  ) ?? [],
                  "red"
                ),
              }}
            />
          </div>
        </div>
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={"Content"}
                  type="hidden"
                  {...field}
                  readOnly={isFromModal}
                />
              </FormControl>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map((item, index) => (
            <div key={index}>
              {(item as Keyword).type === "date" ? (
                <FormField
                  control={control}
                  name={`keywords[${index}].value`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-[10px] w-full">
                      <FormLabel>{(item as Keyword).keyword}</FormLabel>
                      <Popover
                        open={isPopoverOpen} // Controlar si el Popover está abierto
                        onOpenChange={setIsPopoverOpen}
                      >
                        <PopoverTrigger asChild className="w-full">
                          <FormControl className="w-full">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isFromModal}
                            >
                              {isValidDate(field.value) ? (
                                format(new Date(field.value), "MM/dd/yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const usDate = format(date, "MM/dd/yyyy");
                                field.onChange(usDate);
                                handleKeywordChange(index, usDate);
                                setIsPopoverOpen(false);
                              }
                            }}
                            initialFocus
                            disabled={isFromModal}
                            className="w-full"
                          />
                        </PopoverContent>
                      </Popover>
                      <CustomFormMessage className="w-full" />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={control}
                  name={`keywords[${index}].value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{(item as Keyword).keyword}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={(item as Keyword).keyword}
                          {...field}
                          autoComplete="off"
                          readOnly={isFromModal}
                          onChange={(e) => {
                            field.onChange(e);
                            handleKeywordChange(index, e.target.value);
                          }}
                        />
                      </FormControl>
                      <CustomFormMessage className="w-full" />
                    </FormItem>
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldsResendMessage;
