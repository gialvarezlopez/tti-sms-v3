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
import { useGetAvailableNumbersBranches } from "@/hooks/useAvailableNumbers";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorFetching from "@/components/ui/errorFetching";
import { TriangleAlert } from "lucide-react";

const StepTwoFieldsBranch = () => {
  const { control, setValue, watch } = useFormContext();

  const countryValue = watch("country");
  const provinceValue = watch("province");

  const {
    data: dataPhoneNumber,
    error,
    isLoading,
  } = useGetAvailableNumbersBranches({
    province: provinceValue,
  });

  useEffect(() => {
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

      {error ? (
        <div className="mt-4">
          <ErrorFetching message={error.message} />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div>
              <p>Retrieving data...</p>
              <Skeleton className="w-full h-[40px] bg-gray-300" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {dataPhoneNumber.length === 0 ? (
                <div className="flex gap-3 bg-red-100 p-2 text-sm">
                  <TriangleAlert className="w-4" />
                  <div>
                    <p>{`There are no phone numbers available for this province.`}</p>
                    <p className="font-semibold pt-2">{`Province selected ${provinceValue}`}</p>
                  </div>
                </div>
              ) : (
                <FormField
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Available number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Phone Number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dataPhoneNumber?.map(
                            (phone: string, index: number) => (
                              <SelectItem key={index} value={phone}>
                                {phone}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <CustomFormMessage className="w-full" />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StepTwoFieldsBranch;
