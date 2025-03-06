import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//import { showToast } from "@/lib/toastUtil"; // Make sure to import toastUtil

import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
//import FieldsCloseTickets from "./FieldsCloseTickets";
import { ResponseProps } from "@/types/types";
import FieldsResponse from "./FieldsResponse";
type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseOption: React.Dispatch<React.SetStateAction<ResponseProps>>;
};
const FormResponse = ({ setIsOpen, setResponseOption }: Props) => {
  const FormSchema = z.object({
    response: z.string().min(1, "Please enter the response name"),
    automaticReply: z.string().min(1, {
      message: "Please enter the automatic reply.", // El mensaje de error debe ir en 'message' en vez de 'required_error'
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      response: "",
      automaticReply: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsOpen(false);
    setResponseOption({
      response: data.response,
      automaticReply: data.automaticReply,
    });
    console.log(data);
    return false;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FieldsResponse />
          <div>
            <Separator className="my-6" />
            <div className="flex flex-grow gap-3 justify-end  px-6">
              <Button
                type="button"
                className="btn-white-normal w-full md:w-[33%] semibold"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-full md:w-[33%]"
                variant={"destructive"}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormResponse;
