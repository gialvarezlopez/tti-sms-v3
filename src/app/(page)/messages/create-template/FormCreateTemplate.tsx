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
import { cleanOnlyWhiteSpace, generateSlug } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { dataTemplates } from "@/components/screens/templates/dataMock";
import { MESSAGE_EXCHANGE } from "@/lib/constants";

const FormCreateTemplate = () => {
  const router = useRouter();
  const params = useParams();
  const elementId = params?.id;

  const [clearMessage, setClearMessage] = useState(false);
  const [openKeyword, setOpenKeyword] = useState(false);
  const [keywordOption, setKeywordOption] = useState<KeywordProps>({
    name: "",
    value: "",
    type: "",
  });

  const [openResponse, setOpenResponse] = useState(false);
  const [responseOption, setResponseOption] = useState<ResponseProps>({
    responseName: "",
    automaticReply: "",
  });

  const FormSchema = z
    .object({
      name: z.string().min(1, "Please provide a reason"),
      branches: z
        .array(z.string())
        .min(1, "Please select at least one branch")
        .optional(),
      description: z.string().min(1, "Enter the description"),
      message: z
        .string()
        .min(10, {
          message: "Message must be at least 10 characters.",
        })
        .max(400, {
          message: "Message must not be longer than 400 characters.",
        }),
      messageExchangeType: z.enum(
        [MESSAGE_EXCHANGE.ONE_WAY, MESSAGE_EXCHANGE.TWO_WAY],
        {
          required_error: "Select the message exchange",
        }
      ),
      keywords: z
        .array(
          z.object({
            name: z.string().min(1, "Please enter the name"),
            value: z
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
            value: z.string().min(1, "Please enter the value"),
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
      const { message, keywords, responses } = data;

      // Search for patterns in the message with brackets
      const findPattern = (pattern: string) =>
        new RegExp(`\\[${pattern}\\]`).test(message);

      // Validate that each keyword.name is in message between brackets
      keywords.forEach((keyword, index) => {
        if (!findPattern(keyword.name)) {
          ctx.addIssue({
            path: ["keywords", index, "name"], // Here we use 'index' to specify the error in the name field of each keyword
            message: `The keyword '[${keyword.name}]' does not exist in the message.`,
            code: "custom",
          });
        }
      });

      // Validate that each response.value is in message between brackets
      if (responses) {
        responses.forEach((response, index) => {
          if (!findPattern(response.value)) {
            ctx.addIssue({
              path: ["responses", index, "value"],
              message: `The response value '[${response.value}]' does not exist in the message.`,
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
      message: "",
      keywords: [],
      responses: [],
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
    const formData = {
      ...data,
      message: cleanOnlyWhiteSpace(data.message),
    };
    console.log(formData);
    reset({
      messageExchangeType: undefined,
      responses: [],
      keywords: [],
      invalidReply: "",
      message: "",
      description: "",
    });
    setResponseOption({
      responseName: "",
      //value: "",
      automaticReply: "",
    });
    setClearMessage(true);

    showToast(
      "success",
      "Success!",
      `Template ${elementId ? "updated" : "created"} successfully.`
    );
    if (elementId) {
      router.push("/messages/templates");
    }

    return false;
  }

  useEffect(() => {
    if (elementId) {
      const result =
        dataTemplates &&
        dataTemplates.filter((item) => (item.id as string) === elementId);

      // Genera el slug
      const slugType = generateSlug(result[0].type ?? "");

      // Make sure the value is strictly "one-way" or "two-way"
      const messageExchangeType: "one-way" | "two-way" | undefined =
        slugType === MESSAGE_EXCHANGE.ONE_WAY ||
        slugType === MESSAGE_EXCHANGE.TWO_WAY
          ? slugType
          : undefined;

      if (result) {
        const data = {
          name: result[0].title,
          branches: result[0].branches,
          description: result[0].description,
          message: result[0].message,
          messageExchangeType: messageExchangeType,
          keywords: result[0].keywords || [],
          responses: result[0].responses || [],
          invalidReply: result[0].invalidReply,
          timeToRespond: result[0].timeToRespond,
        };

        reset(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId, dataTemplates]);

  return (
    <div>
      <div>
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-xl md:text-2xl mb-6">
            {" "}
            {elementId ? "Edit Template" : "Create Template"}
          </h2>
          {elementId && (
            <Link
              href="/messages/templates"
              className="flex gap-3 items-center text-customRed-v3 font-semibold"
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
              />
            </div>
          </div>
          <div className="pb-5">
            <Separator className="my-6" />
            <div className="flex flex-grow gap-3 justify-end">
              <Link
                href="/messages/new-message"
                className="btn-white-normal semibold link px-6"
              >
                Cancel
              </Link>

              <Button
                type="submit"
                className={`bg-customRed-v3 px-8`}
                variant={"destructive"}
              >
                Submit
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
