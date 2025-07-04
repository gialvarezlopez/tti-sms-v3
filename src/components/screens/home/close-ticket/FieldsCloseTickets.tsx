import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CustomFormMessage from "../../../ui/CustomFormMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FieldsCloseTickets = () => {
  const { control } = useFormContext();
  return (
    <div className="px-6 w-full">
      <FormField
        control={control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reason</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Response Received" bg="custom">
                  Response Received
                </SelectItem>
                <SelectItem value="Customer Did Not Respond" bg="custom">
                  Customer Did Not Respond
                </SelectItem>
              </SelectContent>
            </Select>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FieldsCloseTickets;
