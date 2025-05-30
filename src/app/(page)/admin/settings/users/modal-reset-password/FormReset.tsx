import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserProps } from "@/types/types";
import FieldsReset from "./FieldsReset";
import { useForgotPasswordUser } from "@/hooks/useUsers";

type Props = {
  user?: UserProps;
  onClose: () => void;
};

const FormReset = ({ user, onClose }: Props) => {
  const { mutate: forgotPasswordUser, isPending } = useForgotPasswordUser();

  const FormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { reset } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    forgotPasswordUser(data, {
      onSuccess() {
        onClose();
      },
    });
  }

  useEffect(() => {
    if (user) {
      reset({ email: user?.email });
    }
  }, [user, reset]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6 pb-2">
            <FieldsReset />
          </div>
          <div className="pb-3 pt-2">
            <Separator className="my-2" />

            <div className="flex gap-3 justify-end px-6 pt-2">
              <Button
                type="reset"
                className="btn-white-normal w-1/2 md:w-[33%]"
                variant={"outline"}
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-1/2 md:w-[33%]"
                variant={"destructive"}
                disabled={isPending}
                isLoading={isPending}
              >
                Send Email
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormReset;
