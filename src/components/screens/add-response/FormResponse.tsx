import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ResponseProps } from "@/types/types";
import FieldsResponse from "./FieldsResponse";
type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseOption: React.Dispatch<React.SetStateAction<ResponseProps>>;
};
const FormResponse = ({ setIsOpen, setResponseOption }: Props) => {
  const FormSchema = z
    .object({
      response: z.string().optional(),
      automaticReply: z.string().min(1, {
        message: "Please enter the automatic reply.",
      }),
      isInvalidReply: z.boolean().default(false).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.isInvalidReply === false && !data.response) {
        ctx.addIssue({
          path: ["response"],
          message: "Please enter the response name",
          code: z.ZodIssueCode.custom,
        });
      }
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      response: "",
      automaticReply: "",
      isInvalidReply: false,
    },
  });

  const { trigger, setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //console.log("data", data);
    setIsOpen(false);
    setResponseOption({
      response: data.response ?? "",
      automaticReply: data.automaticReply,
      isInvalidReply: data.isInvalidReply,
    });

    return false;
  }

  const handleInvalidReplyChange = async (checked: boolean) => {
    // Llamamos a trigger() para revalidar el formulario entero
    if (checked) {
      setValue("response", "");
    }
    await trigger(); // Revalida todo el formulario
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FieldsResponse handleInvalidReplyChange={handleInvalidReplyChange} />
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
