"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { MilwaukeeLogoV2 } from "@/assets/images";
import Image from "next/image";
import Fields from "./Fields";
import { useSetResetPasswordUser } from "@/hooks/useUsers";

const FormResetPassword = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetToken = searchParams?.get("token");

  const { mutate: resetPasswordUser, isPending } = useSetResetPasswordUser(
    (resetToken ?? "") as string
  );

  const FormSchema = z
    .object({
      password: z.string().min(2, { message: "Enter password" }),
      confirm_password: z.string().min(6, {
        message: "Password must be at least 6 characters",
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const dataForm = {
      newPassword: data.password,
    };
    resetPasswordUser(dataForm, {
      onSuccess() {
        push("/login");
      },
    });
  }

  return (
    <Card className="md:min-w-[410px]">
      <Image src={MilwaukeeLogoV2} alt="Logo" className="mx-auto pt-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <CardHeader>
            <CardTitle className="text-center px-1">
              Reset your password
            </CardTitle>
            <CardDescription className="text-[#8F8F8F] py-3 text-base text-center">
              Enter a new password to update.
            </CardDescription>
            <CardContent className="space-y-3 px-1">
              <Fields />

              {error && (
                <Alert variant={"destructive"} className="text-center">
                  {error}
                </Alert>
              )}
            </CardContent>
            <CardFooter className="px-1">
              <Button
                type="submit"
                disabled={loading || !resetToken}
                className="w-full text-center bg-customRed-v1 font-semibold text-base mb-2"
                variant={"destructive"}
              >
                {loading ? (
                  <div className="flex gap-3 items-center">
                    Loading
                    <Loader2 className="mr-2 spin" size={"14px"} />
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardFooter>
          </CardHeader>
        </form>
      </Form>
    </Card>
  );
};

export default FormResetPassword;
