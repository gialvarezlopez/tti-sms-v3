import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import CustomMultiSelect from "@/components/ui/CustomMultiSelect";
import { RoleProps, TypeComboBoxProps } from "@/types/types";
import { dataProvinces } from "../../dataStatic/provinces";
import { SETTINGS_PARAMETER_URL, USER_ROLE } from "@/lib/constants";

const dataStatus = [
  {
    id: "inactive",
    value: "Inactive",
  },
  {
    id: "active",
    value: "Active",
  },
];
type Props = {
  dataRoles: RoleProps[];
  errorRoles: unknown;
  isLoadingRoles: boolean;
};
const FieldsFilterBranch = ({
  dataRoles,
  errorRoles,
  isLoadingRoles,
}: Props) => {
  const searchParams = useSearchParams();
  const { control, reset, getValues } = useFormContext();
  const simplifiedProvinces: TypeComboBoxProps[] = useMemo(
    () =>
      dataProvinces &&
      dataProvinces.map((item) => ({
        id: `${item.id}`!, // The operator! indicates that we know it is not undefined
        value: `${item?.name}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataProvinces]
  );

  const simplifiedTStatus: TypeComboBoxProps[] = useMemo(
    () =>
      dataStatus &&
      dataStatus.map((item) => ({
        id: `${item.id}`!,
        value: `${item?.value}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataStatus]
  );

  const simplifiedUserRoles: TypeComboBoxProps[] = useMemo(
    () =>
      dataRoles &&
      dataRoles.map((item) => ({
        id: `${item.name}`!,
        value: `${item?.description}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataRoles]
  );

  const resetSection = (fields: string[]) => {
    if (fields.length > 0) {
      // Get the current values ​​of the form
      const currentValues = getValues();
      // Function to determine the default value for each field
      const getDefaultValue = (field: string) => {
        const fieldValue = currentValues[field];
        // If the current value is an array, we return an empty array
        if (Array.isArray(fieldValue)) {
          return [];
        }
        // Otherwise, we return an empty string
        return "";
      };

      // Create an object for the fields we want to reset, keeping the current values ​​for the others
      const resetFields = fields.reduce((acc, field) => {
        acc[field] = getDefaultValue(field); // We set the default value according to the type
        return acc;
      }, {} as { [key: string]: string | unknown[] });

      // Keep the values ​​of unspecified fields
      Object.keys(currentValues).forEach((key) => {
        if (!fields.includes(key)) {
          resetFields[key] = currentValues[key];
        }
      });

      reset(resetFields);
    }
  };

  const type = searchParams?.get("type") || SETTINGS_PARAMETER_URL.USERS;

  useEffect(() => {
    if (type && type === SETTINGS_PARAMETER_URL.USERS) {
      resetSection(["provinces", "status"]);
    }

    if (type && type === SETTINGS_PARAMETER_URL.BRANCH) {
      resetSection(["roles"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <>
      {type === SETTINGS_PARAMETER_URL.BRANCH && (
        <>
          <div>
            <Separator />
            <div className="px-4 py-2">
              <div className="flex gap-3 justify-between  mb-2">
                <div className="text-sm font-semibold">Province</div>
                <span
                  className="text-customRed-v1 cursor-pointer text-sm"
                  onClick={() => resetSection(["provinces"])}
                >
                  Reset
                </span>
              </div>
              <div className="mt-2">
                <Controller
                  name="provinces"
                  control={control}
                  render={({}) => (
                    <CustomMultiSelect
                      name="provinces"
                      label=""
                      control={control}
                      data={simplifiedProvinces}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <Separator />
            <div className="px-4 py-2">
              <div className="flex gap-3 justify-between  mb-2">
                <div className="text-sm font-semibold">Status</div>
                <span
                  className="text-customRed-v1 cursor-pointer text-sm"
                  onClick={() => resetSection(["status"])}
                >
                  Reset
                </span>
              </div>
              <div className="mt-2">
                <Controller
                  name="status"
                  control={control}
                  render={({}) => (
                    <CustomMultiSelect
                      name="status"
                      label=""
                      control={control}
                      data={simplifiedTStatus}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {type === SETTINGS_PARAMETER_URL.USERS && (
        <div>
          <Separator />
          <div className="px-4 py-2">
            <div className="flex gap-3 justify-between  mb-2">
              <div className="text-sm font-semibold">Roles</div>
              <span
                className="text-customRed-v1 cursor-pointer text-sm"
                onClick={() => resetSection(["roles"])}
              >
                Reset
              </span>
            </div>
            <div className="mt-2">
              <Controller
                name="roles"
                control={control}
                render={({}) => (
                  <CustomMultiSelect
                    name="roles"
                    label=""
                    control={control}
                    data={simplifiedUserRoles}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FieldsFilterBranch;
