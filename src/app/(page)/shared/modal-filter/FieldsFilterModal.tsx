import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import CalendarField from "@/components/ui/CalendarField";
import { TICKETS_STATUS, USER_ROLE } from "@/lib/constants";
import CustomMultiSelect from "@/components/ui/CustomMultiSelect";
import { BranchProps, TypeComboBoxProps } from "@/types/types";
import { useGetBranches } from "@/hooks/useBranches";
import { useGetTemplates } from "@/hooks/useTemplates";

//const role = "admin"; // o role = "user" según el contexto o estado

const dataTypeOfMessage = [
  {
    id: "oneway",
    value: "One-Way",
  },
  {
    id: "twoway",
    value: "Two-Way",
  },
];

type FormValues = {
  branch?: string[];
  status?: string[];
  typeOfMessage?: string[];
  lastSentFrom?: string | Date;
  lastSentTo?: string | Date;
  lastReceivedFrom?: string | Date;
  lastReceivedTo?: string | Date;
  [key: string]: any; // Index signature to allow access with any string
};

type Props = {
  fromPage: string;
};

const FieldsFilterModal = ({ fromPage }: Props) => {
  const { data: session } = useSession();
  const role = session?.user?.primaryRole;
  const { control, reset, getValues, watch } = useFormContext();

  const {
    data: dataBranches,
    error,
    isLoading,
  } = useGetBranches({
    page: 1,
    limit: 50,
    query: "",
  });

  const {
    data: dataTemplates,
    error: errorTemplates,
    isLoading: isLoadingTemplates,
  } = useGetTemplates({
    page: 1,
    limit: 50,
    query: "",
  });

  const inputLastSentFrom = watch("lastSentFrom");
  const inputLastReceivedFrom = watch("lastReceivedFrom");
  const inputCloseDateFrom = watch("closeDateFrom");

  const simplifiedTypeOfMessage: TypeComboBoxProps[] = useMemo(
    () =>
      dataTypeOfMessage &&
      dataTypeOfMessage.map((item) => ({
        id: `${item.id}`!,
        value: `${item?.value}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTypeOfMessage]
  );

  const statusArray = Object.values(TICKETS_STATUS).filter(
    (status) => status !== "closed"
  );
  // Usar statusArray en lugar de dataStatus dentro de useMemo
  const simplifiedStatus: TypeComboBoxProps[] = useMemo(() => {
    if (!statusArray || !Array.isArray(statusArray)) {
      return [];
    }

    return statusArray.map((status) => ({
      id: status,
      value: status,
    }));
  }, [statusArray]);

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

  const simplifiedTemplates: TypeComboBoxProps[] = useMemo(
    () =>
      dataTemplates &&
      dataTemplates.data &&
      (dataTemplates.data as BranchProps[]).map((item) => ({
        id: `${item.id}`,
        value: `${item.name}`,
      })),
    [dataTemplates]
  );

  const resetSection = (fields: string[]) => {
    if (fields.length > 0) {
      // Get the current values ​​of the form (all fields)
      const currentValues = getValues();
      const resetFields = fields.reduce((acc, field) => {
        if (
          field === "typeOfMessage" ||
          field === "status" ||
          field === "branch" ||
          field === "template"
        ) {
          acc[field] = [];
        } else {
          acc[field] = "";
        }
        return acc;
      }, {} as FormValues);

      // Keep current values ​​for fields not in 'fields'
      Object.keys(currentValues).forEach((key) => {
        if (!fields.includes(key)) {
          resetFields[key as keyof FormValues] = currentValues[key];
        }
      });

      reset(resetFields);
    }
  };

  return (
    <>
      {fromPage === "home" && (
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
        </>
      )}

      <div>
        <Separator />
        <div className="px-4 py-2">
          <div className="flex gap-3 justify-between  mb-2">
            <div className="text-sm font-semibold">Type of Message</div>
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

      {fromPage === "home" && (
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
      )}

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

      {fromPage === "history" && (
        <div>
          <Separator />
          <div className="px-4 py-2">
            <div className="flex gap-3 justify-between  mb-2">
              <div className="text-sm font-semibold">Template</div>
              <span
                className="text-customRed-v1 cursor-pointer text-sm"
                onClick={() => resetSection(["template"])}
              >
                Reset
              </span>
            </div>

            <div className="mt-2">
              {isLoadingTemplates ? (
                "Loading templates"
              ) : (
                <Controller
                  name="template"
                  control={control}
                  render={({}) => (
                    <CustomMultiSelect
                      name="template"
                      label=""
                      control={control}
                      data={simplifiedTemplates}
                    />
                  )}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {fromPage === "history" && (
        <div>
          <Separator />
          <div className="px-4 py-2">
            <div className="flex gap-3 justify-between">
              <div className="text-sm font-semibold">Close Date</div>
              <span
                className="text-customRed-v1 cursor-pointer text-sm"
                onClick={() => resetSection(["closeDateFrom", "closeDateTo"])}
              >
                Reset
              </span>
            </div>
            <div className="flex gap-3 justify-between">
              <div className="w-full">
                <FormField
                  control={control}
                  name="closeDateFrom"
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
                  name="closeDateTo"
                  render={({ field }) => (
                    <>
                      <CalendarField
                        control={control}
                        field={field}
                        labelTitle={"To"}
                        labelButton={"Date"}
                        minDate={inputCloseDateFrom}
                        disabled={!inputCloseDateFrom}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FieldsFilterModal;
