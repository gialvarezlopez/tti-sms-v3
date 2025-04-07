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
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  handleInvalidReplyChange: (checked: boolean) => Promise<void>;
};

const FieldsResponse = ({ handleInvalidReplyChange }: Props) => {
  const { control, watch } = useFormContext();
  const fieldIsReply = watch("isInvalidReply");
  return (
    <div className="md:px-6 grid grid-cols-1 gap-3">
      <FormField
        control={control}
        name="isInvalidReply"
        render={({ field }) => (
          <FormItem className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked: boolean) => {
                  const isChecked = checked === true;
                  field.onChange(isChecked);
                  handleInvalidReplyChange(isChecked);
                }}
                className="mt-1"
              />
            </FormControl>
            <FormLabel className=""> Is Invalid Replay</FormLabel>
          </FormItem>
        )}
      />

      {!fieldIsReply && (
        <FormField
          control={control}
          name="response"
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
      )}

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
