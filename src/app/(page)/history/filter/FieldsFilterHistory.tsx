import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import CalendarField from "@/components/ui/CalendarField";
import CustomMultiSelect from "@/components/ui/CustomMultiSelect";
import { TypeComboBoxProps } from "@/types/types";
import { dataBranches } from "@/app/(page)/admin/settings/mock/dataBranch";

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

const dataTemplates = [
  {
    id: "1",
    value: "Template One",
  },
  {
    id: "2",
    value: "Template Two",
  },
  {
    id: "3",
    value: "Template Three",
  },
  {
    id: "4",
    value: "Template Four",
  },
  {
    id: "5",
    value: "Template Five",
  },
];

const FieldsFilterHistory = () => {
  const { control, reset, getValues, watch } = useFormContext();

  const inputCloseDateFrom = watch("closeDateFrom");

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

  const simplifiedTemplates: TypeComboBoxProps[] = useMemo(
    () =>
      dataTemplates &&
      dataTemplates.map((item) => ({
        id: `${item.id}`!, // El operador ! indica que sabemos que no es undefined
        value: `${item?.value}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTemplates]
  );

  const simplifiedBranches: TypeComboBoxProps[] = useMemo(
    () =>
      dataBranches &&
      dataBranches.map((item) => ({
        id: `${item.id}`!, // El operador ! indica que sabemos que no es undefined
        value: `${item?.name}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataBranches]
  );

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
          </div>
        </div>
      </div>
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
    </>
  );
};

export default FieldsFilterHistory;
