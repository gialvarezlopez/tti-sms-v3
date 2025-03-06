"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FieldsTemplate from "./FieldsTemplate";
import ModalKeyword from "@/components/screens/add-keyword/ModalKeyword";
import { KeywordProps, ResponseProps } from "@/types/types";
import { showToast } from "@/lib/toastUtil";
import ModalResponse from "@/components/screens/add-response/ModalResponse";
import { cleanOnlyWhiteSpace, generateSlug, templateType } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { dataTemplates } from "@/components/screens/templates/dataMock";
import { MESSAGE_EXCHANGE } from "@/lib/constants";
import {
  useCreateTemplate,
  useSingleTemplate,
  useUpdateTemplate,
} from "@/hooks/useTemplates";
import { useGetBranches } from "@/hooks/useBranches";
import { dataBranches } from "../../admin/settings/mock/dataBranch";
import CustomFormMessage from "@/components/ui/CustomFormMessage";

const FormCreateTemplate = () => {
  const router = useRouter();
  const params = useParams();
  const elementId = params?.id;

  const [clearMessage, setClearMessage] = useState(false);
  const [openKeyword, setOpenKeyword] = useState(false);
  const [keywordOption, setKeywordOption] = useState<KeywordProps>({
    keyword: "",
    value: "",
    type: "",
  });

  const [openResponse, setOpenResponse] = useState(false);
  const [responseOption, setResponseOption] = useState<ResponseProps>({
    response: "",
    automaticReply: "",
  });

  const {
    data: currentTemplate,
    isLoading,
    error,
  } = useSingleTemplate(elementId as string);

  const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
    useUpdateTemplate(elementId as string);

  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    useCreateTemplate();

  const {
    data: responseBranches,
    error: errorBranches,
    isLoading: isLoadingBranches,
    refetch,
  } = useGetBranches({
    page: 1,
    limit: 50,
    search: "",
  });

  const FormSchema = z
    .object({
      name: z.string().min(1, "Please provide a reason"),
      branches: z
        .array(z.string())
        .min(1, "Please select at least one branch")
        .optional(),
      description: z.string().min(1, "Enter the description"),
      content: z
        .string()
        .min(10, {
          message: "Message content must be at least 10 characters.",
        })
        .max(400, {
          message: "Message content must not be longer than 400 characters.",
        }),
      messageExchangeType: z.enum(
        [MESSAGE_EXCHANGE.ONE_WAY, MESSAGE_EXCHANGE.TWO_WAY],
        {
          required_error: "Select the message exchange",
        }
      ),
      isReminder: z.boolean().default(false).optional(),
      keywords: z
        .array(
          z.object({
            keyword: z.string().min(1, "Please enter the name"),
            type: z
              .union([
                z.string().min(1, "Enter the value"),
                z.number().refine((val) => !isNaN(val), {
                  message: "Enter a valid number",
                }),
                z.date().refine((date) => !isNaN(date.getTime()), {
                  message: "Enter a valid date",
                }),
              ])
              .refine(
                (val) => {
                  // If it is a date, it is validated that it is not empty
                  if (val instanceof Date) {
                    return !isNaN(val.getTime()); // We make sure the date is valid
                  }
                  // If it is text or number, it is validated that it is not empty
                  return String(val).trim().length > 0;
                },
                { message: "Enter the value" }
              ),
          })
        )
        .min(1, { message: "There must be at least one keyword" }),
      responses: z
        .array(
          z.object({
            response: z.string().min(1, "Please enter the value"),
            reply: z
              .string()
              .min(2, {
                message: "Message must be at least 2 characters.",
              })
              .max(400, {
                message: "Message must not be longer than 400 characters.",
              }),
          })
        )
        .optional(),
      invalidReply: z.string().optional(),
      timeToRespond: z.number().optional(),
    })
    .superRefine((data, ctx) => {
      const { content, keywords, responses } = data;

      // Search for patterns in the message with brackets
      const findPattern = (pattern: string) =>
        new RegExp(`\\[${pattern}\\]`).test(content);

      // Validate that each keyword.name is in message between brackets
      keywords.forEach((keyword, index) => {
        if (!findPattern(keyword.keyword)) {
          ctx.addIssue({
            path: ["keywords", index, "keyword"], // Here we use 'index' to specify the error in the name field of each keyword
            message: `The keyword '[${keyword.keyword}]' does not exist in the message.`,
            code: "custom",
          });
        }
      });

      // Validate that each response.value is in message between brackets
      if (responses) {
        responses.forEach((response, index) => {
          if (!findPattern(response.response)) {
            ctx.addIssue({
              path: ["responses", index, "response"],
              message: `The response value '[${response.response}]' does not exist in the message.`,
              code: "custom",
            });
          }
        });
      }

      if (data.messageExchangeType === MESSAGE_EXCHANGE.TWO_WAY) {
        if (!responses || responses.length === 0) {
          ctx.addIssue({
            path: ["responses"],
            message:
              "Responses are required for two-way message exchange add at least one response",
            code: "custom",
          });
        }

        if (!data.invalidReply || data.invalidReply.trim().length === 0) {
          ctx.addIssue({
            path: ["invalidReply"],
            message: "Invalid reply is required for two-way message exchange",
            code: "custom",
          });
        }

        if (data.timeToRespond === undefined || isNaN(data.timeToRespond)) {
          ctx.addIssue({
            path: ["timeToRespond"],
            message:
              "Maximum time to respond is required for two-way message exchange",
            code: "custom",
          });
        }
      }
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      branches: ["all"],
      description: "",
      content: "",
      keywords: [],
      responses: [],
      isReminder: false,
      messageExchangeType: undefined,
      invalidReply: "",
      timeToRespond: 35,
    },
  });

  const {
    reset,
    formState: { errors },
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { messageExchangeType, invalidReply, timeToRespond, ...restData } =
      data;

    const formData = {
      ...restData,
      content: cleanOnlyWhiteSpace(data.content),
      type: "reminder",
    };

    if (elementId) {
      delete formData.branches;
    }

    console.log("formData", formData);
    //return false;

    if (elementId) {
      updateTemplate(formData);
    } else {
      createTemplate(formData, {
        onSuccess() {
          reset({
            messageExchangeType: undefined,
            responses: [],
            keywords: [],
            invalidReply: "",
            content: "",
            description: "",
          });
          setResponseOption({
            response: "",
            automaticReply: "",
          });
          setClearMessage(true);
        },
      });
    }
  }

  useEffect(() => {
    if (elementId && currentTemplate) {
      const {
        id,
        name,
        description,
        branch_id,
        content,
        keywords,
        responses,
        isTwoWay,
        invalidReply,
      } = currentTemplate.data;

      const slugType = generateSlug(templateType(isTwoWay ?? false));
      const messageExchangeType: "one-way" | "two-way" | undefined =
        slugType === MESSAGE_EXCHANGE.ONE_WAY ||
        slugType === MESSAGE_EXCHANGE.TWO_WAY
          ? slugType
          : undefined;

      const data = {
        name,
        description,
        content,
        keywords,
        responses,
        messageExchangeType,
        invalidReply,
      };
      reset(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId, currentTemplate]);

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <div>
      <div>
        <div className="flex justify-between gap-3 flex-col md:flex-row">
          <h2 className="font-bold text-xl md:text-2xl mb-6 md:order-first ">
            {" "}
            {elementId ? "Edit Template" : "Create Template"}
          </h2>
          {elementId && (
            <Link
              href="/messages/templates"
              className="flex gap-3 items-center text-customRed-v3 font-semibold order-first md:order-last"
            >
              <ArrowLeft /> Go back to templates
            </Link>
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="h-full flex flex-col">
            <div>
              <FieldsTemplate
                setOpenKeyword={setOpenKeyword} //Is open keyword modal
                keywordOption={keywordOption}
                setOpenResponse={setOpenResponse} //Is open response modal
                responseOption={responseOption}
                setResponseOption={setResponseOption}
                errors={errors}
                clearMessage={clearMessage}
                setClearMessage={setClearMessage}
                dataBranches={responseBranches?.data || []}
                isLoadingBranches={isLoadingBranches}
                elementId={elementId as string}
              />

              {hasErrors && (
                <div className="mt-6">
                  <CustomFormMessage>The form is invalid. </CustomFormMessage>
                </div>
              )}
            </div>
          </div>
          <div className="pb-5">
            <Separator className="my-6" />
            <div className="flex flex-grow gap-3 justify-end">
              <Link
                href="/messages/new-message"
                className={`btn-white-normal semibold link px-6 ${
                  isUpdatingTemplate || isCreatingTemplate
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                Cancel
              </Link>

              <Button
                type="submit"
                className={`bg-customRed-v3 px-8`}
                variant={"destructive"}
                disabled={isUpdatingTemplate || isCreatingTemplate}
                isLoading={isUpdatingTemplate || isCreatingTemplate}
              >
                {isCreatingTemplate ? (
                  "Submitting"
                ) : isUpdatingTemplate ? (
                  "Updating"
                ) : (
                  <>{elementId ? "Update" : "Create"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <ModalKeyword
        openKeyword={openKeyword}
        setOpenKeyword={setOpenKeyword}
        setKeywordOption={setKeywordOption}
      />

      <ModalResponse
        openResponse={openResponse}
        setOpenResponse={setOpenResponse}
        setResponseOption={setResponseOption}
      />
    </div>
  );
};

export default FormCreateTemplate;
