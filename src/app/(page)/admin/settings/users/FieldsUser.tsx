import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLE } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";
import { BranchProps, UserProps } from "@/types/types";

type Props = {
  user?: UserProps;
  dataBranches: BranchProps[];
};

const FieldsUser = ({ user, dataBranches }: Props) => {
  const { control } = useFormContext();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User Name</FormLabel>
            <FormControl>
              <Input placeholder="User Name" {...field} />
            </FormControl>

            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User type</FormLabel>
            <Select
              value={
                (field.value ||
                  (user?.primaryRole &&
                    user?.primaryRole.name?.toLocaleLowerCase())) ??
                ""
              }
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(USER_ROLE).map(([key, value]) => (
                  <SelectItem key={key} value={value} bg="#FFF2F2">
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CustomFormMessage className="w-full" />
          </FormItem>
        )}
      />

      <div className="col-span-2">
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

      <div className="col-span-2">
        <FormField
          control={control}
          name="branch_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || String(user?.branch?.id ?? "")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataBranches &&
                    dataBranches?.map((branch) => (
                      <SelectItem
                        key={branch.id}
                        value={String(branch.id)}
                        bg="#FFF2F2"
                      >
                        {branch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <CustomFormMessage className="w-full" />
            </FormItem>
          )}
        />
      </div>
      {!user && (
        <>
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="">
                  <FormLabel className="pb-2 block pt-2">Password</FormLabel>
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
                  <FormLabel className="pb-2 block pt-2">
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
      )}
    </div>
  );
};

export default FieldsUser;
