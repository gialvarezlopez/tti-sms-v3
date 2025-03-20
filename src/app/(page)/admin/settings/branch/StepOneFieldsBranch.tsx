import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataCountry } from "../dataStatic/dataCountry";
import { FormFields } from "./FormFieldType";
import CustomInputMask from "@/components/ui/customInputMask";
import { ProvincesProps } from "@/types/types";

type Props = {
  handleChange: (name: FormFields) => void;
  dataProvinces: ProvincesProps[];
  currentProvince: string;
};

const StepOneFieldsBranch = ({
  handleChange,
  dataProvinces,
  currentProvince,
}: Props) => {
  const { control, setValue, getValues } = useFormContext();

  // Watch the "country" field to track its value
  const countryValue = useWatch({ name: "country", control });

  // useEffect moved here, outside of the render method
  useEffect(() => {
    if (dataCountry.length === 1 && !getValues("country")) {
      setValue("country", String(dataCountry[0].id)); // Automatically set the country if there's only one
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCountry, getValues, setValue, countryValue]);

  return (
    <>
      <div className="text-base text-[#1D2433]/80 mb-4">
        Add a branch filling the information bellow.
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Branch Name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("name");
                  }}
                />
              </FormControl>

              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="distributionList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distribution List</FormLabel>
              <FormControl>
                <Input
                  placeholder="Distribution List"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("distributionList");
                  }}
                />
              </FormControl>

              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Address"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange("address");
                    }}
                  />
                </FormControl>

                <CustomFormMessage className="w-full" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="City"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("city");
                  }}
                />
              </FormControl>

              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleChange("province");
                }}
                defaultValue={field.value || currentProvince}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an province" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataProvinces.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={String(item.id)}
                      bg="custom"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="country"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChange("country");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dataCountry.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={String(country.id)}
                        bg="custom"
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CustomFormMessage className="w-full" />
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <CustomInputMask
                  mask="a9a 9a9"
                  placeholder={"Enter Postal Code"}
                  type="text"
                  {...field}
                  upperCase={true}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("postalCode");
                  }}
                />
              </FormControl>

              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default StepOneFieldsBranch;
