import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataCountry } from "../mock/dataCountry";
import { dataPhoneNumber } from "../mock/dataAvailablePhoneNumbers";

const StepTwoFieldsBranch = () => {
  const { control, setValue, watch } = useFormContext();

  const countryValue = watch("country");

  useEffect(() => {
    console.log("dataCountry:", dataCountry);
    console.log("current country value:", countryValue);
    if (dataCountry.length === 1 && !countryValue) {
      setValue("country", String(dataCountry[0].id), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCountry, countryValue, setValue]);

  return (
    <>
      <div className="text-base text-[#1D2433]/80 mb-4">
        Find the best available number that isn’t in use by any other branch.
      </div>
      <div className="grid grid-cols-1 gap-3">
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Available number</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Phone Number" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataPhoneNumber.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {data.phoneNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default StepTwoFieldsBranch;
