import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FieldsFilterBranch from "@/app/(page)/admin/settings/shared/filter/FieldsFilterBranch";
import { IconFilter } from "../../../../assets/images";
import FieldsFilterHistory from "./FieldsFilterHistory";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FormFilterHistory = () => {
  const [isOpen, setIsOpen] = useState(false);

  const bodyRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // State to store button positions
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  // State to store the width of the window
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const FormSchema = z
    .object({
      branch: z.array(z.string()).optional(),
      typeOfMessage: z.array(z.string()).optional(),
      template: z.array(z.string()).optional(),
      closeDateFrom: z.union([z.string(), z.date()]).optional(),
      closeDateTo: z.union([z.string(), z.date()]).optional(),
    })
    .refine(
      (data) => {
        // Si lastSentFrom tiene un valor, entonces lastSentTo debe ser requerido
        if (data.closeDateFrom && !data.closeDateTo) {
          return false;
        }
        return true;
      },
      {
        message: "This is required when Close Date From is selected",
        path: ["closeDateTo"], // Indica que el error se debe mostrar en lastSentTo
      }
    );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      branch: [],
      typeOfMessage: [],
      template: [],
      closeDateFrom: "",
      closeDateTo: "",
    },
  });

  const {
    reset,
    //formState: { errors },
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsOpen(false);
    console.log("data", data);
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

    if (isOpen && window.innerWidth <= 768) {
      bodyRef.current?.classList.add("no-scroll");
    } else {
      bodyRef.current?.classList.remove("no-scroll");
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
    <div className="flex-1 relative">
      <Button
        type="button"
        variant={"outline"}
        className={`flex gap-3 items-center w-full md:w-auto  ${
          isOpen ? "border-[2px] border-red-500" : "btn-white-normal"
        }`}
        onClick={openModal}
        ref={buttonRef}
      >
        <Image src={IconFilter} alt="Filter" /> Filters
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
                  <FieldsFilterHistory />
                </div>
                <ButtonGroup resetAll={resetAll} />
              </form>
            </Form>
          </div>
        </div>
      )}
      <>
        {/*
          <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-md md:max-w-[650px] p-0 max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3 font-bold text-2xl">
                  Filters
                </DialogTitle>
                <Separator className="my-2" />
              </DialogHeader>
              <div className="h-full flex flex-col">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                  >
                    <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[300px]">
                      <FieldsFilterHistory />
                    </div>
                    <ButtonGroup resetAll={resetAll} />
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
          */}
      </>
    </div>
  );
};

interface ButtonGroupProps {
  resetAll: () => void; // resetAll debe ser una función
}

export const ButtonGroup = ({ resetAll }: ButtonGroupProps) => {
  return (
    <div className="pb-3">
      <Separator className="my-2" />
      <div className="flex gap-3 justify-between px-4 py-2">
        <Button
          type="reset"
          className="btn-white-normal w-full md:auto"
          variant={"outline"}
          onClick={resetAll}
        >
          Reset All
        </Button>
        <Button
          type="submit"
          className="bg-customRed-v3 w-full md:auto"
          variant={"destructive"}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default FormFilterHistory;
