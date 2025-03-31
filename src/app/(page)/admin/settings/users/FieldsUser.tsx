import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BranchProps, UserProps, RoleProps } from "@/types/types";

type Props = {
  user?: UserProps;
  dataBranches: BranchProps[];
  errorBranches: unknown;
  isLoadingBranches: boolean;
  dataRoles: RoleProps[];
  errorRoles: unknown;
  isLoadingRoles: boolean;
};

const FieldsUser = ({
  user,
  dataBranches,
  errorBranches,
  isLoadingBranches,
  dataRoles,
  errorRoles,
  isLoadingRoles,
}: Props) => {
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
              <Input
                placeholder="User Name"
                {...field}
                disabled={user && user.id !== undefined}
              />
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
            <FormLabel>User Type</FormLabel>
            {errorRoles instanceof Error ? (
              errorRoles?.message
            ) : (
              <>
                {isLoadingRoles ? (
                  "Fetching data..."
                ) : (
                  <Select
                    value={
                      (field.value ||
                        (user?.primary_role &&
                          user?.primary_role.name?.toLocaleLowerCase())) ??
                      ""
                    }
                    onValueChange={field.onChange}
                    disabled={user && user.id !== undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataRoles &&
                        dataRoles?.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={String(role.name)}
                            bg="#FFF2F2"
                          >
                            {role.description}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}

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
                <Input
                  placeholder="Email"
                  {...field}
                  disabled={user && user.id !== undefined}
                />
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
              {errorBranches instanceof Error ? (
                errorBranches?.message
              ) : (
                <>
                  {isLoadingBranches ? (
                    "Fetching data..."
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value || String(user?.branch?.id ?? "")
                      }
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
                  )}
                </>
              )}

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
