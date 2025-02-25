import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/lib/toastUtil"; // Make sure to import toastUtil
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FieldsUser from "./FieldsUser";
import { UserProps } from "@/types/types";

type Props = {
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  user?: UserProps;
};

const CreateEditUser = ({ setIsOpen, user }: Props) => {
  const FormSchema = z
    .object({
      username: z.string().min(3, { message: "Username is required" }), // Ahora solo es un string
      branch: z.string().min(1, { message: "Select one branch" }).optional(),
      email: z.string().email({ message: "Invalid email address" }),
      userType: z.string().min(1, { message: "Select an option" }).optional(),
      password: user
        ? z.string().optional()
        : z.string().min(2, { message: "Enter password" }), // Condicional
      confirm_password: user
        ? z.string().optional()
        : z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
      //password: z.string().min(2, { message: "Enter password" }),
      //password: z.string().min(2, { message: "Enter password" }).optional(),
      /*
      confirm_password: z
        .string()
        .min(6, {
          message: "Password must be at least 6 characters",
        })
        .optional(),
        */
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"], // Indica el campo que debe mostrar el error
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      confirm_password: undefined,
      password: undefined,
      branch: "",
      userType: "",
    },
    //shouldUnregister: true,
  });

  const {
    reset,
    //formState: { errors },
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //setIsOpen(false);
    console.log("data", data);
    const message = user
      ? "User updated successfully"
      : "User created successfully";
    showToast("success", "Success!", message);
    setIsOpen(false);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (user) {
      console.log("user", user);
      const data = {
        username: user.first_name ?? "",
        userType: (user.roles && user.roles[0]?.toLocaleLowerCase()) ?? "",
        email: user.email ?? "",
        branch: String(user.branch?.id ?? ""),
      };
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reset]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6 pb-2">
            <FieldsUser user={user} />
          </div>
          <div className="pb-3 pt-2">
            <Separator className="my-2" />
            {/*JSON.stringify(errors)*/}
            <div className="flex gap-3 justify-end px-6 pt-2">
              <Button
                type="reset"
                className="btn-white-normal w-1/2 md:w-[33%]"
                variant={"outline"}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-1/2 md:w-[33%]"
                variant={"destructive"}
              >
                {user ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateEditUser;
