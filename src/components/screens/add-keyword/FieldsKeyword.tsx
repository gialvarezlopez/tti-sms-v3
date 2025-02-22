import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
//import { Textarea } from "@/components/ui/textarea";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { keywordOptions } from "./keywordOptions";

const FieldsKeyword = () => {
  const { control } = useFormContext();
  return (
    <div className="px-6 grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="keywordName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keyword Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Name" {...field} autoComplete="off" />
            </FormControl>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="keywordType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keyword Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {keywordOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FieldsKeyword;
