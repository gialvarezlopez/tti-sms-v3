"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
//import { useRouter } from "next/navigation";
//import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSearch } from "../../../assets/images";
import Image from "next/image";
//import AlertDeleteTickets from "./AlertDeleteTickets";
//import { TicketsProps } from "@/types/types";
import FormFilterHistory from "./filter/FormFilterHistory";

/*
type Props = {
  rowSelected: TicketsProps[];
  handleClearSelected: (value: boolean) => void;
};
*/
const Actions = (/*{ rowSelected, handleClearSelected }: Props*/) => {
  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
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
        <FormFilterHistory />

        {/* No option to delete for the moment */}
        {/*    
        <AlertDeleteTickets
          rowSelected={rowSelected}
          handleClearSelected={handleClearSelected}
        />
        */}
      </div>
    </div>
  );
};

export default Actions;
