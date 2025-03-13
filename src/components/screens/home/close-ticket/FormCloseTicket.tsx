import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/lib/toastUtil";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FieldsCloseTickets from "./FieldsCloseTickets";
import { TicketsProps } from "@/types/types";
import { capitalizeFirstLetterOfEveryWord } from "@/lib/utils/utils";
import { useCloseMultiplesTickets } from "@/hooks/useTickets";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClearSelected: (value: boolean) => void;
  tickets: TicketsProps[];
};
const FormCloseTicket = ({
  setIsOpen,
  handleClearSelected,
  tickets,
}: Props) => {
  const {
    mutate: mutateCloseMultipleTickets,
    isPending: isClosingMultipleTickets,
  } = useCloseMultiplesTickets();

  const FormSchema = z.object({
    reason: z.string().min(1, "Please provide a reason"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reason: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const ids = tickets
      .map((item) => String(item.id)) // Convierte a string, incluso si son números
      .filter((id) => id !== undefined); // Filtra undefined, si fuera el caso

    const addData = {
      status: "closed",
      closed_by: "system",
      reason: data.reason,
    };

    mutateCloseMultipleTickets(
      { ids, operation: "update", data: addData },
      {
        onSuccess(data) {
          setIsOpen(false);
          handleClearSelected(true);
        },
      }
    );

    return false;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className=" px-6 font-medium mb-2 text-sm">
            {tickets &&
              tickets?.map((ticket, index) => (
                <p key={index}>
                  {capitalizeFirstLetterOfEveryWord(ticket.client)} -{" "}
                  {ticket.recipient_number} -{" "}
                  {ticket.branch && typeof ticket.branch !== "string"
                    ? ticket.branch.name
                    : null}
                </p>
              ))}
          </div>
          <FieldsCloseTickets />
          <div>
            <Separator className="my-6" />
            <div className="flex flex-grow gap-3 justify-end  px-6">
              <Button
                type="button"
                className="btn-white-normal w-full md:w-[33%] semibold"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
                disabled={isClosingMultipleTickets}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customRed-v3 w-full md:w-[33%]"
                variant={"destructive"}
                disabled={isClosingMultipleTickets}
                isLoading={isClosingMultipleTickets}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCloseTicket;
