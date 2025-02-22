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

const Fields = () => {
  const { control } = useFormContext();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="">
              <FormLabel className="text-base font-semibold pb-2 block">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
            </div>
            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confirm_password"
        render={({ field }) => (
          <FormItem>
            <div className="">
              <FormLabel className="text-base font-semibold pb-2 block">
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
            </div>
            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />
    </>
  );
};

export default Fields;
