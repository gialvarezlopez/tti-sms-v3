"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { IconSearch } from "../../../assets/images";
import FormFilterHome from "../shared/modal-filter/FormFilterModal";

const Actions = () => {
  const [limit, setLimit] = useState("10");
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

    const limitParam = searchParams?.get("limit");
    if (limitParam) {
      setLimit(limitParam);
    }
  }, [searchParams, setValue]);

  return (
    <div className="w-full gap-3 md:gap-6 flex flex-col md:flex-row items-center mt-4 relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 w-full">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
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
        <FormFilterHome fromPage="history" />
        <Select
          value={limit}
          onValueChange={(value) => {
            setLimit(value);
            const params = new URLSearchParams(searchParams || "");
            params.set("limit", value);
            params.delete("page"); // Reinicia paginación si es necesario
            router.push(`?${params.toString()}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Entries per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Entry</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Actions;
