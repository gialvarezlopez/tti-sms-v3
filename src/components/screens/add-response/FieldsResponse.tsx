import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FieldsResponse = () => {
  const { control } = useFormContext();
  return (
    <div className="md:px-6 grid grid-cols-1 gap-3">
      <FormField
        control={control}
        name="responseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Response Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Name" {...field} autoComplete="off" />
            </FormControl>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="automaticReply"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Automatic Reply</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Automatic reply"
                className="resize-none"
                {...field}
              />
            </FormControl>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FieldsResponse;
