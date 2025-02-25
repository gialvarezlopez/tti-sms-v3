import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FieldsFilterBranch from "./FieldsFilterBranch";
import { IconFilterList } from "@/assets/images";
const FormFilterBranch = () => {
  const [isOpen, setIsOpen] = useState(false);

  // State to store button positions
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  // State to store the width of the window
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Button reference
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const FormSchema = z
    .object({
      provinces: z.array(z.string()).optional(),
      status: z.array(z.string()).optional(),
      roles: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      const { provinces, status, roles } = data;

      // If provinces is present, make sure it is an array
      if (provinces && !Array.isArray(provinces)) {
        ctx.addIssue({
          path: ["provinces"],
          message: "Provinces should be an array of strings.",
          code: "custom",
        });
      }

      // If status is present, make sure it is an array
      if (status && !Array.isArray(status)) {
        ctx.addIssue({
          path: ["status"],
          message: "Status should be an array of strings.",
          code: "custom",
        });
      }

      // If roles is present, make sure it is an array
      if (roles && !Array.isArray(roles)) {
        ctx.addIssue({
          path: ["roles"],
          message: "Roles should be an array of strings.",
          code: "custom",
        });
      }
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      provinces: [],
      status: [],
      roles: [],
    },
  });

  const {
    reset,
    //formState: { errors },
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsOpen(false);
    console.log("data", data);
    reset({
      provinces: [],
      status: [],
      roles: [],
    });
  }

  const resetAll = () => {
    reset({});
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

  useEffect(() => {
    if (isOpen) {
      updateButtonPosition();
    }

    // We add a listener to resize the window
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updateButtonPosition();
    };

    window.addEventListener("resize", handleResize);

    // We clean the listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <div className="flex-1 md:flex-none">
      <Button
        type="button"
        variant={"outline"}
        className={`flex gap-3 items-center w-full md:w-auto  ${
          isOpen ? "border-[2px] border-red-500" : "btn-white-normal"
        }`}
        onClick={openModal}
        ref={buttonRef}
      >
        <Image src={IconFilterList} alt="Filter" />
      </Button>

      {/* Backdrop */}
      {isOpen && windowWidth <= 768 && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={closeModal}
        />
      )}

      {/* Floating Modal (div) */}
      {isOpen && (
        <div
          className={`absolute bg-white  rounded-lg w-[386px] shadow-md z-50 border border-gray-300 ${
            windowWidth <= 768
              ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              : ""
          }`}
          style={{
            //top: windowWidth > 768 ? buttonPosition.top + 5 : undefined,
            top: windowWidth > 768 ? 40 : undefined,
            left: windowWidth > 768 ? buttonPosition.left - 600 : undefined,
          }}
        >
          <div className="flex justify-between items-center px-4 py-2">
            <h3 className="text-sm font-semibold">Filters</h3>
            <button onClick={closeModal} className="text-xl font-bold">
              X
            </button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex-1 overflow-y-auto max-h-[300px]">
                <FieldsFilterBranch />
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
      )}
    </div>
  );
};

export default FormFilterBranch;
