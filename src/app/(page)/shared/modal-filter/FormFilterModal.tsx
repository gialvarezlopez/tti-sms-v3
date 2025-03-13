import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { IconFilter } from "../../../../assets/images";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FieldsFilterModal from "./FieldsFilterModal";
import { formatDate } from "@/lib/utils/dateUtils";

type FormField =
  | "branch"
  | "status"
  | "typeOfMessage"
  | "lastSentFrom"
  | "lastSentTo"
  | "lastReceivedFrom"
  | "lastReceivedTo"
  | "template";

type Props = {
  fromPage: string;
};

const FormFilterModal = ({ fromPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const bodyRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // State to store button positions
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  // State to store the width of the window
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const FormSchema = z
    .object({
      lastSentFrom: z.union([z.string(), z.date()]).optional(),
      lastSentTo: z.union([z.string(), z.date()]).optional(),
      lastReceivedFrom: z.union([z.string(), z.date()]).optional(),
      lastReceivedTo: z.union([z.string(), z.date()]).optional(),
      typeOfMessage: z.array(z.string()).optional(),
      status: z.array(z.string()).optional(),
      branch: z.array(z.string()).optional(),
      template: z.array(z.string()).optional(),
      closeDateFrom: z.union([z.string(), z.date()]).optional(),
      closeDateTo: z.union([z.string(), z.date()]).optional(),
    })
    .refine(
      (data) => {
        // Si lastSentFrom tiene un valor, entonces lastSentTo debe ser requerido
        if (data.lastSentFrom && !data.lastSentTo) {
          return false;
        }
        return true;
      },
      {
        message: "This is required when Last Sent From is selected",
        path: ["lastSentTo"], // Indica que el error se debe mostrar en lastSentTo
      }
    )
    .refine(
      (data) => {
        // Si lastReceivedFrom tiene un valor, entonces lastReceivedTo debe ser requerido
        if (data.lastReceivedFrom && !data.lastReceivedTo) {
          return false;
        }
        return true;
      },
      {
        message: "This is required when Last Received From is selected",
        path: ["lastReceivedTo"], // Indica que el error se debe mostrar en lastReceivedTo
      }
    )
    .refine(
      (data) => {
        // Si lastReceivedFrom tiene un valor, entonces lastReceivedTo debe ser requerido
        if (data.closeDateFrom && !data.closeDateTo) {
          return false;
        }
        return true;
      },
      {
        message: "This is required when Close Date From is selected",
        path: ["closeDateTo"], // Indica que el error se debe mostrar en lastReceivedTo
      }
    );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lastSentFrom: "",
      lastSentTo: "",
      lastReceivedFrom: "",
      lastReceivedTo: "",
      typeOfMessage: [],
      status: [],
      template: [],
      closeDateFrom: "",
      closeDateTo: "",
    },
  });

  const { reset, setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsOpen(false);

    const params = new URLSearchParams(searchParams || "");

    const setParamIfValid = (
      key: string,
      value: string | string[] | undefined
    ) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (value && typeof value !== "object") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    setParamIfValid("templates", data?.template);
    setParamIfValid("branches", data?.branch);
    setParamIfValid("status", data?.status);
    setParamIfValid("typeOfMessage", data?.typeOfMessage);

    const dateFields: (keyof typeof data)[] = [
      "lastSentFrom",
      "lastSentTo",
      "lastReceivedFrom",
      "lastReceivedTo",
      "closeDateFrom",
      "closeDateTo",
    ];

    dateFields.forEach((field) => {
      const fieldValue = data?.[field];
      // Check if it is a valid date or if it needs to be formatted
      if (fieldValue instanceof Date || typeof fieldValue === "string") {
        const formattedDate = formatDate(fieldValue);
        if (formattedDate) {
          params.set(field, formattedDate);
        } else {
          params.delete(field);
        }
      } else {
        params.delete(field);
      }
    });

    router.push(`?${params.toString()}`);
  }

  const resetAll = () => {
    // Just the route without parameters
    const newUrl = window.location.pathname;
    router.push(newUrl);
    reset({});
  };

  const hasParamsInURL = () => {
    return (
      searchParams?.get("templates") ||
      searchParams?.get("branches") ||
      searchParams?.get("status") ||
      searchParams?.get("typeOfMessage") ||
      searchParams?.get("lastSentFrom") ||
      searchParams?.get("lastSentTo") ||
      searchParams?.get("closeDateTo")
    );
  };

  // Function to update the button position
  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY, // Just below the button
        left: rect.left + window.scrollX, // Aligned with the left edge of the button
      });
    }
  };

  const updateFormField = (
    param: string | null,
    field: FormField,
    isArray: boolean = false
  ) => {
    if (param) {
      const value = isArray ? decodeURIComponent(param).split(",") : param;
      setValue(field, value, { shouldDirty: true });
    } else {
      setValue(field, isArray ? [] : "", { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      bodyRef.current?.classList.add("no-scroll");
    } else {
      bodyRef.current?.classList.remove("no-scroll");
    }

    // This part will only be executed on the client
    if (windowWidth === undefined) {
      setWindowWidth(window.innerWidth);
    }

    // If the modal is open, update the button position
    if (isOpen && windowWidth !== undefined) {
      updateButtonPosition();
    }

    // Add a listener to handle window resizing
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updateButtonPosition();
    };

    window.addEventListener("resize", handleResize);

    // Clear the listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, windowWidth]);

  useEffect(() => {
    const params = [
      {
        param: searchParams?.get("templates") ?? null,
        field: "template",
        isArray: true,
      },
      {
        param: searchParams?.get("branches") ?? null,
        field: "branch",
        isArray: true,
      },
      {
        param: searchParams?.get("status") ?? null,
        field: "status",
        isArray: true,
      },
      {
        param: searchParams?.get("typeOfMessage") ?? null,
        field: "typeOfMessage",
        isArray: true,
      },
      {
        param: searchParams?.get("lastSentFrom") ?? null,
        field: "lastSentFrom",
        isArray: false,
      },
      {
        param: searchParams?.get("lastSentTo") ?? null,
        field: "lastSentTo",
        isArray: false,
      },
      {
        param: searchParams?.get("lastReceivedFrom") ?? null,
        field: "lastReceivedFrom",
        isArray: false,
      },
      {
        param: searchParams?.get("lastReceivedTo") ?? null,
        field: "lastReceivedTo",
        isArray: false,
      },

      {
        param: searchParams?.get("closeDateFrom") ?? null,
        field: "closeDateFrom",
        isArray: false,
      },
      {
        param: searchParams?.get("closeDateTo") ?? null,
        field: "closeDateTo",
        isArray: false,
      },
    ];

    params.forEach(({ param, field, isArray }) => {
      if (param !== null) {
        // Ensures that 'field' is one of the values ​​of type 'FormField'
        updateFormField(param, field as FormField, isArray);
      } else {
        // If null, the default value is used
        setValue(field as FormField, isArray ? [] : "", { shouldDirty: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, searchParams]);

  return (
    <div className="flex-1 relative">
      <Button
        type="button"
        variant={"outline"}
        className={`flex gap-3 items-center w-full md:w-auto  ${
          isOpen || hasParamsInURL()
            ? "border-[2px] border-red-500"
            : "btn-white-normal"
        }`}
        onClick={openModal}
        ref={buttonRef}
      >
        <Image src={IconFilter} alt="Filter" /> Filters
      </Button>

      {/* Backdrop */}
      {isOpen && windowWidth !== undefined && windowWidth <= 768 && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={closeModal}
        />
      )}

      {/* Floating Modal (div) */}
      {isOpen && windowWidth !== undefined && (
        <div
          className={`fixed md:absolute  w-full md:w-[386px] md:rounded-lg md:shadow-md md:border md:bg-white md:border-gray-300  z-50 ${
            windowWidth <= 768
              ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              : ""
          }`}
          style={{
            top: windowWidth > 768 ? 40 : undefined,
            left: windowWidth > 768 ? -286 : undefined,
          }}
        >
          <div className=" mx-4 md:mx-0 bg-white md:bg-transparent">
            <div className="flex justify-between items-center px-4 py-2">
              <h3 className="text-sm font-semibold">Filters</h3>
              <button onClick={closeModal} className="text-xl font-bold">
                X
              </button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)] md:max-h-[300px]">
                  <FieldsFilterModal fromPage={fromPage} />
                </div>
                <div className="pb-3">
                  <Separator className="my-2" />
                  <div className="flex gap-3 justify-between px-4 py-2">
                    <Button
                      type="reset"
                      className="btn-white-normal"
                      variant={"outline"}
                      onClick={resetAll}
                    >
                      Reset All
                    </Button>
                    <Button
                      type="submit"
                      className="bg-customRed-v3"
                      variant={"destructive"}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormFilterModal;
