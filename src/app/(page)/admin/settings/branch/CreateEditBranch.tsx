import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import StepOneFieldsBranch from "./StepOneFieldsBranch";
import StepTwoFieldsBranch from "./StepTwoFieldsBranch";
import { FormFields } from "./FormFieldType";
import { BranchProps } from "@/types/types";
import { dataProvinces } from "../mock/provinces";
import { useCreateBranch, useUpdateBranch } from "@/hooks/useBranches";

type Props = {
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  branch?: BranchProps;
};

const CreateEditBranch = ({ setIsOpen, branch }: Props) => {
  const branchId = branch?.id ?? "";
  const { mutate: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch(
    branchId as string
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  const FormSchema = z
    .object({
      name: z.string().min(3, { message: "Name is required" }),
      distributionList: z
        .string()
        .email({ message: "Invalid email address" })
        .optional()
        .or(z.literal("")),
      address: z.string().min(3, { message: "Enter the address" }),
      city: z.string().min(1, { message: "Enter the city" }),
      province: z.string().min(1, { message: "Select an province" }),
      country: z.string().min(1, { message: "Select an country" }),
      postalCode: z.string().min(1, { message: "Postal code is required" }),
      phone_number: branch
        ? z.string().optional()
        : z.string().min(1, { message: "Please select one phone number" }),
    })
    .superRefine((data, ctx) => {
      const { country, postalCode } = data;

      // Validation for USA
      if (
        (country === "usa" || country === "2") &&
        !/^\d{5}$/.test(postalCode)
      ) {
        ctx.addIssue({
          path: ["postalCode"],
          message: "Postal code must be 5 digits for USA",
          code: z.ZodIssueCode.custom,
        });
      }

      // Validation for Canada
      if (
        (country === "canada" || country === "1") &&
        !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalCode)
      ) {
        ctx.addIssue({
          path: ["postalCode"],
          message: "Postal code must be in the format A9A 9A9 for Canada",
          code: z.ZodIssueCode.custom,
        });
      }
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      distributionList: "",
      address: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
      phone_number: "", // Additional field for step 2
    },
  });

  const {
    reset,
    formState: { errors },
    //handleSubmit,
    trigger,
    clearErrors,
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (branch) {
      updateBranch(data, {
        onSuccess(data) {
          setIsOpen(false);
        },
      });
    } else {
      createBranch(data, {
        onSuccess(data) {
          setIsOpen(false);
        },
      });
    }
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      // Validate only the fields from step 1
      isValid = await trigger([
        "name",
        "distributionList",
        "address",
        "city",
        "province",
        "country",
        "postalCode",
      ]);
    }

    if (isValid) {
      setCurrentStep(2); // We move on to the next step if it is valid
    }
  };

  const handlePrev = () => {
    setCurrentStep(1); // We go back to the previous step
  };

  const handleChange = (field: FormFields) => {
    clearErrors(field); // Clear the field error when the value changes
  };

  useEffect(() => {
    if (dataProvinces.length > 0) {
      setLoadingProvinces(false); // Las provincias ya están cargadas
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProvinces]);

  useEffect(() => {
    if (branch && !loadingProvinces) {
      const data = {
        name: branch.name,
        address: branch.address,
        province:
          typeof branch.province === "string"
            ? branch?.province
            : (branch?.province?.id as string),
        phone_number: branch.phone_number,
        status: branch.status,
        distributionList: branch.distributionList,
        city: branch.city,
        country: branch.country,
        postalCode: branch.postalCode,
      };
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, reset, dataProvinces, loadingProvinces]);

  if (loadingProvinces) {
    return false;
  }

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6 pb-2">
            {currentStep === 1 && (
              <StepOneFieldsBranch
                handleChange={handleChange}
                dataProvinces={dataProvinces}
                currentProvince={
                  typeof branch?.province === "string"
                    ? branch.province
                    : branch?.province?.id ?? ""
                }
              />
            )}
            {currentStep === 2 && <StepTwoFieldsBranch />}
          </div>

          <div className="pb-3 pt-2">
            <Separator className="my-2" />
            <div className="flex gap-3 justify-end px-6 pt-2">
              <Button
                type={currentStep === 2 ? "button" : "reset"}
                className="btn-white-normal w-1/2 md:w-[33%]"
                variant={"outline"}
                onClick={currentStep === 2 ? handlePrev : handleClose}
                disabled={isCreating || isUpdating}
              >
                {currentStep === 2 ? "Back" : "Cancel"}
              </Button>

              {branch ? (
                <Button
                  type="button"
                  className="bg-customRed-v3 w-1/2 md:w-[33%]"
                  variant={"destructive"}
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isCreating || isUpdating}
                  isLoading={isCreating || isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-customRed-v3 w-1/2 md:w-[33%]"
                  variant={"destructive"}
                  onClick={
                    currentStep === 2 ? form.handleSubmit(onSubmit) : handleNext
                  }
                  disabled={isCreating || isUpdating}
                  isLoading={isCreating || isUpdating}
                >
                  {currentStep === 2 ? (
                    <>{isCreating ? "Creating..." : "Create"}</>
                  ) : (
                    "Next"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateEditBranch;
