import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import CustomFormMessage from "@/components/ui/CustomFormMessage";

const FieldsReset = () => {
  const { control } = useFormContext();
  return (
    <div>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FieldsReset;
