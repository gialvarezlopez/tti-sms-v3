"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//import { useRouter } from "next/navigation";
//import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
//import { Button } from "@/components/ui/button";
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
  const FormSchema = z.object({
    username: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /*
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    */
  }

  return (
    <div className="flex justify-between items-center gap-6 flex-1">
      <div className="flex flex-1 justify-end gap-3">
        <div className="w-full md:w-full md:max-w-[336px] ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full gap-6 flex items-center"
            >
              <FormField
                control={form.control}
                name="username"
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
