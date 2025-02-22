import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Fields = () => {
  const { control } = useFormContext();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const toggleCurrentPasswordVisibility = () =>
    setShowCurrentPassword(!showCurrentPassword);

  return (
    <>
      <div className="space-y-1">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your email" {...field} />
              </FormControl>

              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-1 ">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Password
              </FormLabel>
              <div className="relative w-full">
                <FormControl>
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={toggleCurrentPasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>

              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-3 justify-between pt-3 items-center">
        <div className="text-sm flex gap-2">
          <FormField
            control={control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember for 30 days</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="text-customRed-v1 font-semibold">Forgot password</div>
      </div>
    </>
  );
};

export default Fields;
