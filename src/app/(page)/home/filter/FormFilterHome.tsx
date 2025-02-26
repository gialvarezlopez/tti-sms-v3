import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { IconFilter } from "../../../../assets/images";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FieldsFilterHome from "./FieldsFilterHome";

const FormFilterHome = () => {
  const [isOpen, setIsOpen] = useState(false);

  const bodyRef = useRef(document.body);

  // State to store button positions
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  // State to store the width of the window
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  // Button reference
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    if (isOpen && window.innerWidth <= 768) {
      bodyRef.current.classList.add("no-scroll");
    } else {
      bodyRef.current.classList.remove("no-scroll");
    }
    // Esta parte solo se ejecutará en el cliente
    if (windowWidth === undefined) {
      setWindowWidth(window.innerWidth); // Inicializa el ancho de la ventana solo cuando se montó el componente
    }

    // Si el modal está abierto, actualiza la posición del botón
    if (isOpen && windowWidth !== undefined) {
      updateButtonPosition();
    }

    // Agregar un listener para manejar el redimensionamiento de la ventana
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updateButtonPosition();
    };

    window.addEventListener("resize", handleResize);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, windowWidth]);

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
            //top: windowWidth > 768 ? buttonPosition.top + 5 : undefined,
            top: windowWidth > 768 ? 40 : undefined,
            //left: windowWidth > 768 ? buttonPosition.left - 550 : undefined,
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
                  <FieldsFilterHome />
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

export default FormFilterHome;
