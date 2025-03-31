import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/lib/toastUtil";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TicketsProps } from "@/types/types";
import FieldsResendMessage from "./FieldsSendRemainder";
import { templateType } from "@/lib/utils/utils";

type Props = {
  ticket: TicketsProps;
  onClose: () => void;
};
const FormBuildRemainder = ({ onClose, ticket }: Props) => {
  const FormSchema = z.object({
    phoneNumber: z.string().min(1, "Telephone Number is required"),
    modelNumber: z.string().min(1, "SV or Model Number is required"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phoneNumber: "",
      modelNumber: "",
    },
  });

  const { reset } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onClose();
    showToast("success", "Success!", "Message sent successfully.");
    return false;
  }

  useEffect(() => {
    if (ticket) {
      reset({
        phoneNumber: ticket.recipient_number,
        modelNumber: ticket.chat[0]?.keyword,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);

  return (
    <div>
      <div className="px-6">
        <div className=" flex gap-3 justify-between">
          <div>Estimate Template</div>

          <div>
            <span className="bg-[#CCCCCC] text-white rounded-full px-2 py-1 font-normal text-xs tracking-[2%]">
              {templateType(ticket?.template?.isTwoWay ?? false)}
            </span>
          </div>
        </div>

        <Separator className="my-3" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="h-full flex flex-col pb-5">
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              <FieldsResendMessage ticket={ticket} />
            </div>
          </div>
          <div className="pb-5">
            <Separator className="my-6" />
            <div className="flex flex-grow gap-3 justify-end  px-6">
              <Button
                type="button"
                className="btn-white-normal w-full md:w-[33%] semibold"
                variant={"outline"}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-full md:w-[33%]"
                variant={"destructive"}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormBuildRemainder;
