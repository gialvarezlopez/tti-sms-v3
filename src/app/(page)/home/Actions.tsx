"use client";
import { useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSearch } from "../../../assets/images";
import FormFilterHome from "../shared/modal-filter/FormFilterModal";
import ModalCloseTicket from "../../../components/screens/home/close-ticket/ModalCloseTicket";
import { TicketsProps } from "@/types/types";

type Props = {
  rowSelected: TicketsProps[];
  handleClearSelected: (value: boolean) => void;
};

const Actions = ({ rowSelected, handleClearSelected }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  const { setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams(searchParams || "");
    params.set("search", data.search ?? "");
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
    setValue("search", searchParams?.get("search") ?? "", {
      shouldDirty: true,
    });
  }, [searchParams, setValue]);

  return (
    <div className="w-full gap-3 md:gap-6 flex flex-col md:flex-row  items-center mt-4 relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 w-full">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <div className="flex gap-3 relative">
                    <span className="absolute left-4 top-4">
                      <Image src={IconSearch} alt="Search" />
                    </span>
                    <Input
                      placeholder="Search.."
                      {...field}
                      className="pl-8 w-full"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex gap-3 w-full md:w-auto">
        <FormFilterHome fromPage="home" />
        <ModalCloseTicket
          rowSelected={rowSelected}
          handleClearSelected={handleClearSelected}
        />
      </div>
    </div>
  );
};

export default Actions;
