import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FormReviewMessageProps,
  TemplateProps,
  TicketsProps,
} from "@/types/types";
import FieldsResendMessage from "./FieldsBuildMessage";

import Link from "next/link";
import MessageReviewConfirm from "@/app/(page)/messages/new-message/confirm-message/MessageReviewConfirm";
import {
  addFormatPhoneNumberMask,
  formatPhoneNumberWithoutAreCode,
  removeBrackets,
  removeHtmlTags,
  templateType,
} from "@/lib/utils/utils";
import { useResendReminderThread } from "@/hooks/useTickets";
import { useResendMessage } from "@/hooks/useMessages";

type Props = {
  template: TemplateProps;
  onClose?: () => void;
  isFromModal: boolean;
  ticket?: TicketsProps;
  typeOperation?: string;
};

const KeywordSchema = z
  .object({
    keyword: z.string().min(1, "Keyword is required"),
    value: z.string().min(1, "Value is required"),
    type: z.string().min(1, "Type is required"),
  })
  .superRefine((keyword, ctx) => {
    switch (keyword.type) {
      case "string":
      case "text":
        break;

      case "currency":
        if (!/^\d+(\.\d{1,2})?$/.test(keyword.value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Currency must be a number (integer or float)",
            path: ["value"],
          });
        }
        break;

      case "number":
        if (!/^\d+$/.test(keyword.value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Number must be an integer",
            path: ["value"],
          });
        }
        break;

      case "date":
        if (
          !/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(
            keyword.value
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date must be in the format MM/DD/YYYY",
            path: ["value"],
          });
        }
        break;

      default:
        // Unrecognized type
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid type",
          path: ["type"],
        });
        break;
    }
  });

const ResponseSchema = z.object({
  response: z.string().optional(),
  reply: z.string().optional(),
});

//Note: here we use template and tickets, for send reminder and resend message its send both properties, meanwhile template is used only to send new message
const FormBuildMessage = ({
  onClose,
  template,
  isFromModal = true,
  ticket,
  typeOperation,
}: Props) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  //For two way
  const { mutate: resendReminder, isPending: isSendingReminder } =
    useResendReminderThread((ticket?.id as string) ?? "");

  //For one way
  const { mutate: resendMessage, isPending: isSendingMessage } =
    useResendMessage(
      (ticket?.messages?.at(-1)?.id ?? ticket?.firstMessage?.id) as string
    );

  const [formState, setFormState] = useState<FormReviewMessageProps>({
    client: "",
    service_order: "",
    recipient_number: "",
    keywords: [],
    responses: [],
    content: "",
  });

  const FormSchema = z.object({
    client: z.string().optional(),
    service_order: z.string().min(1, "Enter the service order"),
    recipient_number: z
      .string()
      .regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
        message: "Phone number must be in the format (999) 999-9999",
      })
      .min(1, { message: "Phone number is required" }),
    content: z.string().optional(),
    keywords: z.array(KeywordSchema).superRefine((keywords, ctx) => {
      // If there is at least one keyword, all must be valid
      if (keywords.length > 0) {
        keywords.forEach((keyword, index) => {
          if (!keyword.keyword || !keyword.value) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "All keyword fields are required",
              path: ["keywords", index],
            });
          }
        });
      }
    }),
    responses: z.array(ResponseSchema).optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      client: "",
      service_order: "",
      recipient_number: "",
      content: "",
      keywords: [],
      responses: [],
    },
  });

  function stripHtmlKeepNewlines(input: string): string {
    return input
      .replace(/<[^>]+>/g, "") // Quita todas las etiquetas HTML
      .trim();
  }

  const { setValue, watch, trigger } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isFromModal) {
      //Its two way
      if (ticket?.type === "twoway") {
        //resend-reminder
        let formData = {
          client: "",
          service_order: "",
          recipient: "",
          content: "",
        };
        if (typeOperation === "resend-reminder") {
          //console.log(data);
          const plainText = stripHtmlKeepNewlines(data?.content ?? "");
          formData = {
            client: data.client ?? "",
            service_order: data.client ?? "",
            recipient: data.recipient_number ?? "",
            content: plainText,
          };

          resendReminder(formData, {
            onSuccess() {
              if (onClose) onClose();
            },
          });
        } else {
          //console.log(data);
          formData = {
            client: data.client ?? "",
            service_order: data.client ?? "",
            recipient: data.recipient_number ?? "",
            content: ticket?.lastSentMessage?.content ?? "",
          };

          resendMessage(formData, {
            onSuccess() {
              if (onClose) onClose();
            },
          });
        }
      } else {
        //Its one way
        const messageId = (ticket?.messages?.at(-1)?.id ??
          ticket?.firstMessage?.id) as string;

        const payload = {
          client: data.client ?? "",
          service_order: data.client ?? "",
          recipient: data.recipient_number ?? "",
          content: ticket?.messages?.at(-1)?.content ?? "",
        };

        resendMessage(payload, {
          onSuccess() {
            if (onClose) onClose();
          },
        });
      }
    } else {
      //Crea new message if it come template inste of ticket
      setOpenConfirm(true);
    }

    const dateValue = {
      ...data,
      responses:
        template?.responses?.map(({ response, reply }) => ({
          response,
          reply,
        })) ?? [],
    };

    setFormState(dateValue);
    return false;
  }

  useEffect(() => {
    if (template && isFromModal && ticket?.recipientNumber) {
      const formattedNumber = formatPhoneNumberWithoutAreCode(
        ticket.recipientNumber
      );
      setValue("recipient_number", addFormatPhoneNumberMask(formattedNumber), {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("service_order", ticket.service_order ?? "", {
        shouldDirty: true,
      });
      /*
      setValue("service_order", "410", {
        shouldDirty: true,
      });
      */
      setValue("client", ticket.client ?? "", {
        shouldDirty: true,
      });
      trigger("recipient_number");
    }
  }, [template, isFromModal, setValue, ticket, trigger]);

  return (
    <div className="w-full">
      <div className={`${isFromModal ? "px-6" : ""}`}>
        <div className=" flex gap-3 justify-between">
          <div>{template.name}</div>

          <div>
            <span className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%]">
              {templateType(template?.isTwoWay ?? false)}
            </span>
          </div>
        </div>

        <Separator className="my-3" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="h-full flex flex-col pb-5">
            <div
              className={`${
                isFromModal
                  ? "flex-1 overflow-y-auto max-h-[calc(100vh-400px)] px-6"
                  : ""
              }`}
            >
              <FieldsResendMessage
                template={template}
                isFromModal={isFromModal}
                ticket={ticket}
                typeOperation={typeOperation}
              />
            </div>
          </div>
          <div className="pb-5">
            <Separator className="my-6" />
            <div className="flex flex-grow gap-3 justify-end  px-6">
              {isFromModal ? (
                <Button
                  type="button"
                  className={`btn-white-normal semibold ${
                    isFromModal ? "w-full md:w-[33%]" : "px-8"
                  }`}
                  variant={"outline"}
                  onClick={onClose}
                  disabled={isSendingReminder || isSendingMessage}
                >
                  Cancel
                </Button>
              ) : (
                <Link
                  href="/messages/new-message"
                  className={`btn-white-normal semibold link px-6 ${
                    isSendingReminder || isSendingMessage ? "disabled" : ""
                  } `}
                >
                  Cancel
                </Link>
              )}

              <Button
                type="submit"
                className={`bg-customRed-v3 ${
                  isFromModal ? "w-full md:w-[33%]" : "px-8"
                }`}
                variant={"destructive"}
                disabled={isSendingMessage && template?.isTwoWay}
                isLoading={isSendingReminder || isSendingMessage}
              >
                {isSendingReminder || isSendingMessage
                  ? "Sending..."
                  : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      {!isFromModal && openConfirm && (
        <MessageReviewConfirm
          template={template}
          modalOpen={true}
          setOpenConfirm={setOpenConfirm}
          formState={formState}
        />
      )}
    </div>
  );
};

export default FormBuildMessage;
