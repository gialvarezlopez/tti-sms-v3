import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/lib/toastUtil";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TicketsProps } from "@/types/types";
import FieldsResendMessage from "./FieldsBuildMessage";

import Link from "next/link";
import MessageReviewConfirm from "@/app/(page)/messages/new-message/confirm-message/MessageReviewConfirm";

type Props = {
  ticket: TicketsProps;
  onClose?: () => void;
  isFromModal: boolean;
};
const FormBuildMessage = ({ onClose, ticket, isFromModal = true }: Props) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const FormSchema = z.object({
    clientName: z.string().min(2, "Enter the client name"),
    phoneNumber: z
      .string()
      .regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
        message: "Phone number must be in the format (999) 999-9999",
      })
      .min(1, { message: "Phone number is required" }),
    modelNumber: z.string().min(1, "SV or Model Number is required"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientName: "",
      phoneNumber: "",
      modelNumber: "",
    },
  });

  const { reset } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (onClose && isFromModal) {
      onClose();
    }
    if (isFromModal) {
      showToast("success", "Success!", "Message sent successfully.");
    } else {
      setOpenConfirm(true);
    }
    console.log(data);
    return false;
  }

  useEffect(() => {
    if (ticket && isFromModal) {
      reset({
        phoneNumber: ticket?.phoneNumber,
        clientName: ticket?.client,
        modelNumber: ticket?.chat[0]?.keyword,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket, isFromModal]);

  return (
    <div>
      <div className={`${isFromModal ? "px-6" : ""}`}>
        <div className=" flex gap-3 justify-between">
          <div>Estimate Template</div>

          <div>
            <span className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%]">
              {ticket?.typeOfMessage}
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
              <FieldsResendMessage ticket={ticket} isFromModal={isFromModal} />
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
                >
                  Cancel
                </Button>
              ) : (
                <Link
                  href="/messages/new-message"
                  className="btn-white-normal semibold link px-6"
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
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {!isFromModal && openConfirm && (
        <MessageReviewConfirm
          ticket={ticket}
          modalOpen={true}
          setOpenConfirm={setOpenConfirm}
        />
      )}
    </div>
  );
};

export default FormBuildMessage;
