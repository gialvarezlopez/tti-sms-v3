import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/lib/toastUtil";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FieldsUser from "./FieldsUser";
import { UserProps } from "@/types/types";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { useGetBranches } from "@/hooks/useBranches";
//import { dataBranches } from "../mock/dataBranch";

type Props = {
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  user?: UserProps;
};

const CreateEditUser = ({ setIsOpen, user }: Props) => {
  const userId = user?.id ?? "";
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(
    userId as string
  );

  const {
    data: dataBranches,
    error,
    isLoading,
    refetch,
  } = useGetBranches({
    page: 1,
    limit: 100,
    search: "",
  });

  const FormSchema = z
    .object({
      name: z.string().min(3, { message: "Username is required" }),
      branch_id: z.string().min(1, { message: "Select one branch" }).optional(),
      email: z.string().email({ message: "Invalid email address" }),
      role: z.string().min(1, { message: "Select an option" }).optional(),
      password: user
        ? z.string().optional()
        : z.string().min(2, { message: "Enter password" }),
      confirm_password: user
        ? z.string().optional()
        : z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      confirm_password: undefined,
      password: undefined,
      branch_id: "",
      role: "",
    },
    //shouldUnregister: true,
  });

  const {
    reset,
    //formState: { errors },
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //console.log("data", data);
    const formattedData: Partial<typeof data> = {
      ...data,
      branch_id: data.branch_id,
    };

    if (user) {
      delete formattedData.email;
      delete formattedData.name;
      delete formattedData.role;
    }

    if (user) {
      updateUser(formattedData, {
        onSuccess() {
          setIsOpen(false);
        },
      });
    } else {
      createUser(formattedData, {
        onSuccess() {
          setIsOpen(false);
        },
      });
    }
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (user) {
      //console.log("user", user);
      const data = {
        name: user.name ?? "",
        role:
          (user.primary_role && user.primary_role.name?.toLocaleLowerCase()) ??
          "",
        email: user.email ?? "",
        branch_id: String(user.branch?.id ?? ""),
      };
      console.log("data", data);
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reset]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6 pb-2">
            <FieldsUser user={user} dataBranches={dataBranches?.data} />
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
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-1/2 md:w-[33%]"
                variant={"destructive"}
                disabled={isCreating || isUpdating}
                isLoading={isCreating || isUpdating}
              >
                {isCreating ? "Submitting " : <>{user ? "Update" : "Create"}</>}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateEditUser;
