import React, { useEffect, useMemo, useState } from "react";
import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import { Input } from "@/components/ui/input";
import CustomMultiSelect from "@/components/ui/CustomMultiSelect";
import { KeywordProps, ResponseProps, TypeComboBoxProps } from "@/types/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { dataBranches } from "@/app/(admin)/admin/settings/mock/dataBranch";
import Keyword from "./Keyword";
import Response from "./Response";
import { MESSAGE_EXCHANGE } from "@/lib/constants";

type Props = {
  setOpenKeyword: React.Dispatch<React.SetStateAction<boolean>>;
  keywordOption: KeywordProps;
  setOpenResponse: React.Dispatch<React.SetStateAction<boolean>>;
  responseOption: ResponseProps;
  setResponseOption: React.Dispatch<React.SetStateAction<ResponseProps>>;
  errors: FieldErrors<{
    keywords: {
      name: string;
      value: string | number | Date;
    }[];
    responses: {
      value: string;
      replay: string;
    }[];
  }>;
  clearMessage: boolean;
  setClearMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

const FieldsTemplate = ({
  setOpenKeyword,
  keywordOption,
  setOpenResponse,
  responseOption,
  setResponseOption,
  errors,
  clearMessage,
  setClearMessage,
}: Props) => {
  const { control, watch, setValue, clearErrors } = useFormContext();

  const messageExchangeType = watch("messageExchangeType");

  const simplifiedBranches: TypeComboBoxProps[] = useMemo(
    () =>
      dataBranches &&
      dataBranches.map((item) => ({
        id: `${item.id}`!, // The ! operator indicates that we know that it is not undefined
        value: `${item?.name}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataBranches]
  );
  const [message, setMessage] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Function to handle clicking on the text to start editing
  const handleStartEditing = () => {
    setIsEditing(true);
  };

  // Function to handle the output of the textarea and return to the display state
  const handleStopEditing = () => {
    setIsEditing(false);
    clearErrors(["keywords", "responses"]);
  };

  // Function to capture the cursor position when clicked
  const handleCursorPositionClick = (
    e: React.MouseEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.target as HTMLTextAreaElement;
    setCursorPosition(textarea.selectionStart); // Captura la posición cuando se hace clic
  };

  // Function to capture the cursor position while typing
  const handleCursorPositionInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.target as HTMLTextAreaElement;
    setCursorPosition(textarea.selectionStart);
  };

  const addKeyword = (phrase: string) => {
    const currentMessage = watch("message");
    let newMessage = currentMessage;

    if (cursorPosition !== null) {
      newMessage =
        currentMessage.slice(0, cursorPosition) +
        ` [${phrase}] ` + // Insert the keyword with the brackets
        currentMessage.slice(cursorPosition);
    } else {
      newMessage = currentMessage + ` [${phrase}] `; // Add it to the end if no position was detected
    }

    setValue("message", newMessage);
    setCursorPosition(null);
  };

  const renderMessageWithHTML = (text: string) => {
    // We use a regular expression to search for any word between brackets
    const regex = /\[(.*?)\]/g; // This will search for anything between brackets, capturing the content within them

    const processedText = text.replace(
      regex,
      (match) => `<span style='color:red;'>${match}</span>`
    );

    return processedText;
  };

  useEffect(() => {
    if (keywordOption.name) {
      addKeyword(keywordOption.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordOption]);

  useEffect(() => {
    if (responseOption.responseName) {
      addKeyword(responseOption.responseName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseOption]);

  useEffect(() => {
    if (clearMessage) {
      setValue("message", "");
      setMessage("");
      setValue("messageExchangeType", "");
      setClearMessage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearMessage, setClearMessage]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Template name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Estimate" {...field} autoComplete="off" />
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="flex gap-3 justify-between">
            <FormLabel className="text-base font-semibold">Branch</FormLabel>
          </div>

          <Controller
            name="branches"
            control={control}
            render={({}) => (
              <CustomMultiSelect
                name="branches"
                label=""
                control={control}
                data={simplifiedBranches}
                showLimit={3}
                //onChange={handleBranchChange}
              />
            )}
          />
        </div>

        <div className="col-span-2">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Template description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Notice of non-warranty repair with contact for estimate approval."
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2">
          <FormField
            control={control}
            name="messageExchangeType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold">
                  Message exchange
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    //defaultValue={field.value}
                    value={field.value}
                    className="flex flex-row space-y-1 gap-4"
                  >
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={MESSAGE_EXCHANGE.ONE_WAY} />
                      </FormControl>
                      <FormLabel className="font-normal">One-way</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={MESSAGE_EXCHANGE.TWO_WAY} />
                      </FormControl>
                      <FormLabel className="font-normal">Two-way</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2">
          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Message
                </FormLabel>
                <FormControl>
                  <div>
                    {!isEditing ? (
                      <div>
                        <div
                          onClick={handleStartEditing}
                          className="min-h-[103px] rounded-md border border-[#ccc] whitespace-pre-wrap px-3 py-2 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: renderMessageWithHTML(
                              field.value
                              //keywordOption.name
                            ),
                          }}
                        />
                        <div className="text-sm h-[20px] font-bold  flex gap-1 items-center">
                          Double click on the message content to edit
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Textarea
                          spellCheck="false"
                          placeholder="Enter the message"
                          className="resize-none min-h-[103px] "
                          {...field}
                          onClick={handleCursorPositionClick}
                          onInput={handleCursorPositionInput}
                          onBlur={handleStopEditing}
                          onMouseLeave={handleStopEditing}
                        />
                        <div className="text-sm h-[20px]"></div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {messageExchangeType === MESSAGE_EXCHANGE.TWO_WAY && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2">
          <FormField
            control={control}
            name="timeToRespond"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Maximum time to respond
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Estimate"
                    {...field}
                    autoComplete="off"
                    type="number"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? "" : value);
                    }}
                  />
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>
      )}

      <Keyword
        setOpenKeyword={setOpenKeyword}
        keywordOption={keywordOption}
        setMessage={setMessage}
        message={message}
      />
      {errors && errors.keywords?.message && (
        <div className="mt-3 font-medium bg-customRed-v4 text-[#1D2433] formMessageError rounded relative text-xs inline-block showIconError w-full">
          {errors.keywords?.message}
        </div>
      )}

      {messageExchangeType === MESSAGE_EXCHANGE.TWO_WAY && (
        <>
          <Response
            setOpenResponse={setOpenResponse}
            responseOption={responseOption}
            errors={errors}
            setResponseOption={setResponseOption}
            setMessage={setMessage}
            message={message}
          />

          <FormField
            control={control}
            name="invalidReply"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex gap-3 justify-between items-center">
                  Invalid Reply
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default FieldsTemplate;
