import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import CalendarField from "@/components/ui/CalendarField";
import { USER_ROLE } from "@/lib/constants";
import CustomMultiSelect from "@/components/ui/CustomMultiSelect";
import { BranchProps, TypeComboBoxProps } from "@/types/types";
import { useGetBranches } from "@/hooks/useBranches";

//const role = "admin"; // o role = "user" según el contexto o estado

const dataTypeOfMessage = [
  {
    id: "1",
    value: "One way",
  },
  {
    id: "2",
    value: "Two way",
  },
];

const dataStatus = [
  {
    id: "1",
    value: "Error",
  },
  {
    id: "2",
    value: "In Progress",
  },
];

const FieldsFilterHome = () => {
  const { data: session } = useSession();
  const role = session?.user?.primaryRole;
  const { control, reset, getValues, watch } = useFormContext();

  const {
    data: dataBranches,
    error,
    isLoading,
    refetch,
  } = useGetBranches({
    page: 1,
    limit: 50,
    search: "",
  });

  const inputLastSentFrom = watch("lastSentFrom");
  const inputLastReceivedFrom = watch("lastReceivedFrom");

  const simplifiedTypeOfMessage: TypeComboBoxProps[] = useMemo(
    () =>
      dataTypeOfMessage &&
      dataTypeOfMessage.map((item) => ({
        id: `${item.id}`!, // El operador ! indica que sabemos que no es undefined
        value: `${item?.value}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTypeOfMessage]
  );

  const simplifiedStatus: TypeComboBoxProps[] = useMemo(
    () =>
      dataStatus &&
      dataStatus.map((item) => ({
        id: `${item.id}`!, // El operador ! indica que sabemos que no es undefined
        value: `${item?.value}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataStatus]
  );

  const simplifiedBranches: TypeComboBoxProps[] = useMemo(
    () =>
      dataBranches &&
      dataBranches.data &&
      (dataBranches.data as BranchProps[]).map((item) => ({
        id: `${item.id}`,
        value: `${item.name}`,
      })),
    [dataBranches]
  );

  //const simplifiedBranches = [];
  //console.log("dataBranches", dataBranches);

  const resetSection = (fields: string[]) => {
    if (fields.length > 0) {
      // Get the current values ​​of the form
      const currentValues = getValues();

      // Create an object for the fields we want to reset, keeping the current values ​​for the others
      const resetFields = fields.reduce((acc, field) => {
        acc[field] = ""; // Restablecemos solo los campos especificados
        return acc;
      }, {} as { [key: string]: string });

      Object.keys(currentValues).forEach((key) => {
        if (!fields.includes(key)) {
          resetFields[key] = currentValues[key]; // Keep the current value for unspecified fields
        }
      });

      reset(resetFields);
    }
  };

  return (
    <>
      <div>
        <Separator />
        <div className="px-4 py-2">
          <div className="flex gap-3 justify-between">
            <div className="text-sm font-semibold">Last Sent</div>
            <span
              className="text-customRed-v1 cursor-pointer text-sm"
              onClick={() => resetSection(["lastSentFrom", "lastSentTo"])}
            >
              Reset
            </span>
          </div>
          <div className="flex gap-3 justify-between text-left">
            <div className="w-full">
              <FormField
                control={control}
                name="lastSentFrom"
                render={({ field }) => (
                  <>
                    <CalendarField
                      control={control}
                      field={field}
                      labelTitle={"From"}
                      labelButton={"Date"}
                    />
                  </>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={control}
                name="lastSentTo"
                render={({ field }) => (
                  <>
                    <CalendarField
                      control={control}
                      field={field}
                      labelTitle={"To"}
                      labelButton={"Date"}
                      minDate={inputLastSentFrom}
                      disabled={!inputLastSentFrom}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Separator />
        <div className="px-4 py-2">
          <div className="flex gap-3 justify-between">
            <div className="text-sm font-semibold">Last Received</div>
            <span
              className="text-customRed-v1 cursor-pointer text-sm"
              onClick={() =>
                resetSection(["lastReceivedFrom", "lastReceivedTo"])
              }
            >
              Reset
            </span>
          </div>
          <div className="flex gap-3 justify-between">
            <div className="w-full">
              <FormField
                control={control}
                name="lastReceivedFrom"
                render={({ field }) => (
                  <>
                    <CalendarField
                      control={control}
                      field={field}
                      labelTitle={"From"}
                      labelButton={"Date"}
                    />
                  </>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={control}
                name="lastReceivedTo"
                render={({ field }) => (
                  <>
                    <CalendarField
                      control={control}
                      field={field}
                      labelTitle={"To"}
                      labelButton={"Date"}
                      minDate={inputLastReceivedFrom}
                      disabled={!inputLastReceivedFrom}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Separator />
        <div className="px-4 py-2">
          <div className="flex gap-3 justify-between  mb-2">
            <div className="text-sm font-semibold">Type of message</div>
            <span
              className="text-customRed-v1 cursor-pointer text-sm"
              onClick={() => resetSection(["typeOfMessage"])}
            >
              Reset
            </span>
          </div>
          <div className="mt-2">
            <Controller
              name="typeOfMessage"
              control={control}
              render={({}) => (
                <CustomMultiSelect
                  name="typeOfMessage"
                  label=""
                  control={control}
                  data={simplifiedTypeOfMessage}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div>
        <Separator />
        <div className="px-4 py-2">
          <div className="flex gap-3 justify-between mb-2">
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
                  data={simplifiedStatus}
                />
              )}
            />
          </div>
        </div>
      </div>
      {(role === USER_ROLE.ADMIN || role === USER_ROLE.CUSTOMER_EXPERIENCE) && (
        <div>
          <Separator />
          <div className="px-4 py-2">
            <div className="flex gap-3 justify-between  mb-2">
              <div className="text-sm font-semibold">Branch</div>
              <span
                className="text-customRed-v1 cursor-pointer text-sm"
                onClick={() => resetSection(["branch"])}
              >
                Reset
              </span>
            </div>

            <div className="mt-2">
              {isLoading ? (
                "Loading branches"
              ) : (
                <Controller
                  name="branch"
                  control={control}
                  render={({}) => (
                    <CustomMultiSelect
                      name="branch"
                      label=""
                      control={control}
                      data={simplifiedBranches}
                    />
                  )}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FieldsFilterHome;
