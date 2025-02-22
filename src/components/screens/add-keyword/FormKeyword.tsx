import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//import { showToast } from "@/lib/toastUtil"; // Make sure to import toastUtil

import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
//import FieldsCloseTickets from "./FieldsCloseTickets";
import { KeywordProps } from "@/types/types";
import FieldsKeyword from "./FieldsKeyword";
type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeywordOption: React.Dispatch<React.SetStateAction<KeywordProps>>;
};
const FormKeyword = ({ setIsOpen, setKeywordOption }: Props) => {
  const FormSchema = z.object({
    keywordName: z.string().min(1, "Please enter the name."),
    keywordType: z.string().min(1, {
      message: "Please select a type.", // El mensaje de error debe ir en 'message' en vez de 'required_error'
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keywordName: "",
      keywordType: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsOpen(false);
    setKeywordOption({ name: data.keywordName, type: data.keywordType });
    console.log(data);
    return false;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FieldsKeyword />
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

export default FormKeyword;
