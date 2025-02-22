//Inputs
import CustomInputMask from "@/components/ui/customInputMask";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import React from "react";
import { useFormContext } from "react-hook-form";

const InputsHomePhone = () => {
  const { control, watch } = useFormContext();
  const optionType = watch("typeOption");
  return (
    <div className="w-full">
      {optionType === "phone" && (
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex-1">
                <CustomInputMask
                  mask="(999) 999-9999"
                  placeholder={"Type phone number"}
                  type="text"
                  {...field}
                  upperCase={true}
                  className="w-full"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {optionType === "code" && (
        <FormField
          control={control}
          name="accessCode"
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex-1">
                <CustomInputMask
                  mask="999999"
                  placeholder={"Type your access code"}
                  type="text"
                  {...field}
                  upperCase={true}
                  className="w-full"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="typeOption"
        render={({ field }) => (
          <FormItem>
            <FormControl className="flex-1">
              <Input type="hidden" {...field} readOnly />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InputsHomePhone;
