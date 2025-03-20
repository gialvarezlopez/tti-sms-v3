"use client";

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

import { IconSearch } from "../../../../assets/images";
import Image from "next/image";

const FilterTop = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Using the searchParams hook here.
  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // Remove "q" if it is empty
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex justify-between items-center gap-6 flex-1">
      <div className="flex flex-1 justify-end gap-3">
        <div className="w-full md:w-full md:max-w-[336px] ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                updateQueryParams("q", data.search ?? "")
              )}
              className="w-full gap-6 flex items-center"
            >
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
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FilterTop;
