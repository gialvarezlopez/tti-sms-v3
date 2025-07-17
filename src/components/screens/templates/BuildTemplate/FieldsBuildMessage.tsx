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
import { KeywordTemplates, TemplateProps, TicketsProps } from "@/types/types";
import {
  cn,
  highlightKeyword,
  renderIcon,
  templateType,
} from "@/lib/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  template: TemplateProps;
  isFromModal: boolean;
  ticket?: TicketsProps;
  typeOperation?: string;
};

interface Keyword {
  id?: string;
  keyword: string;
  value: string;
  type: string;
}

const FieldsResendMessage = ({
  template,
  isFromModal,
  ticket,
  typeOperation,
}: Props) => {
  const { control, setValue, watch, getValues } = useFormContext();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  //const [defaultValue, setDefaultValue] = useState(any);

  const { fields, replace } = useFieldArray({
    control,
    name: "keywords",
  });

  const isValidDate = (date: string) => {
    return date && !isNaN(new Date(date).getTime());
  };

  const handleKeywordChange = (
    index: number,
    value: string,
    defaultValue = ""
  ) => {
    //console.log("defaultValue", defaultValue);
    value = value !== "" ? value : defaultValue;
    setValue(`keywords[${index}].value`, value, {
      shouldDirty: true,
    });

    // Usamos watch para obtener los valores actuales del formulario
    const keywordValues = watch("keywords") as Keyword[];

    // Creamos una copia con el nuevo valor actualizado manualmente
    const updatedKeywords = [...keywordValues];
    updatedKeywords[index] = {
      ...updatedKeywords[index],
      value,
    };

    const message = template?.content ?? "";
    const updatedMessage = highlightKeyword(
      message,
      updatedKeywords.map(({ keyword, value, type }) => {
        let formattedValue = value;

        if (type === "currency") {
          const numericValue = value?.replace("$", "");
          if (
            /^\d+(\.\d{1,2})?$/.test(numericValue) ||
            numericValue === "" ||
            Number(numericValue) >= 0
          ) {
            formattedValue = `$${numericValue}`;
          }
        }

        return {
          keyword,
          value: formattedValue,
        };
      })
    );

    setValue("content", updatedMessage, { shouldDirty: true });
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

      //setDefaultValue(newKeywords);
    }
  }, [template, replace, watch]);

  if (!template) {
    return false;
  }

  const lastMessageContent = Array.isArray(ticket?.messages)
    ? ticket?.messages.at(-1)?.content
    : undefined;

  const dataContent =
    isFromModal && template
      ? template.isTwoWay
        ? //? template?.content
          ticket?.lastSentMessage?.content
        : typeOperation !== "resend-reminder"
        ? lastMessageContent //Its resend message, no data edit
        : template?.content //Its resend reminder show the template data to fill out the information
      : template?.content; //show the default content to build the template in message/template/edit

  return (
    <div className="pb-2">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormField
          control={control}
          name="service_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Order</FormLabel>
              <FormControl>
                {isFromModal ? (
                  <div className="py-2 px-3 h-[40px] border rounded-md bg-muted text-muted-foreground">
                    {field.value}
                  </div>
                ) : (
                  <Input
                    placeholder={"Service Order"}
                    type="text"
                    {...field}
                    readOnly={isFromModal}
                  />
                )}
              </FormControl>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={"Client Name"}
                  type="text"
                  {...field}
                  //readOnly={isFromModal}
                />
              </FormControl>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="recipient_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone Number</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  +1
                  <CustomInputMask
                    mask="(999) 999-9999"
                    placeholder={"Telephone Number"}
                    type="text"
                    {...field}
                    upperCase={true}
                    value={field.value} // Asegurar que toma el valor actualizado
                    onChange={(e) => field.onChange(e.target.value)} // Actualizar estado
                    //readOnly={isFromModal}
                  />
                </div>
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
            {/*<pre>{JSON.stringify(template, null, 2)}</pre>*/}
            <div
              dangerouslySetInnerHTML={{
                __html: highlightKeyword(
                  watch("content") || dataContent,
                  /*(template?.isTwoWay
                      ? template?.content
                      : ticket?.messages?.at(-1)?.content),*/
                  /*
                  (isFromModal
                    ? template?.keywords
                        ?.filter((item) => item.keyword)
                        .map(({ keyword, value }) => ({
                          keyword,
                          value: keyword ?? "",
                        }))
                    : (getValues("keywords") as Keyword[]).map(
                        ({ keyword, value }) => ({
                          keyword,
                          value: value || "",
                        })
                      )) ?? [],
                      */

                  (getValues("keywords") as Keyword[])?.map(
                    ({ keyword, value }) => ({
                      keyword,
                      //value: isFromModal ? keyword : value,
                      value,
                    })
                  ) ?? [],

                  "red",
                  template?.responses
                    ?.filter((item) => item.response && item.reply) // Filter objects that have 'response'
                    .map((item) => ({
                      value: item.response, // Map only the 'response' property
                      color: "black",
                    })) ?? [],
                  true
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
                      <div className="flex gap-1 items-center">
                        {renderIcon((item as Keyword).type)}
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
                              >
                                {isValidDate(field.value) ? (
                                  format(new Date(field.value), "MM/dd/yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
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
                              className="w-full"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <CustomFormMessage className="w-full" />
                    </FormItem>
                  )}
                />
              ) : (
                <div>
                  {/* Input original */}
                  <div className="hidden">
                    <FormField
                      control={control}
                      name={`keywords[${index}].value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{(item as Keyword).keyword} </FormLabel>
                          <FormControl>
                            <div className="flex gap-1 items-center">
                              {renderIcon((item as Keyword).type)}
                              <Input
                                type="hidden"
                                placeholder={(item as Keyword).keyword}
                                {...field}
                                autoComplete="off"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleKeywordChange(
                                    index,
                                    e.target.value,
                                    (item as Keyword).keyword
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          <CustomFormMessage className="w-full" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Input copy from original */}
                  <FormField
                    control={control}
                    name={`keywords[${index}].value_copy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{(item as Keyword).keyword} </FormLabel>
                        <FormControl>
                          <div className="flex gap-1 items-center">
                            {renderIcon((item as Keyword).type)}
                            <Input
                              placeholder={(item as Keyword).keyword}
                              {...field}
                              autoComplete="off"
                              onChange={(e) => {
                                field.onChange(e);
                                handleKeywordChange(
                                  index,
                                  e.target.value,
                                  (item as Keyword).keyword
                                );
                              }}
                            />
                          </div>
                        </FormControl>
                        <CustomFormMessage className="w-full" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldsResendMessage;
