// FilterTop.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSearch } from "../../../../assets/images";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, ArrowRightToLine } from "lucide-react";

// Max width for responsive design
const setMaxWidth = 520;

const Filter = () => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState<number>(300);

  const router = useRouter();
  const searchParams = useSearchParams(); // Using the searchParams hook here.

  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // Remove "q" if it is empty
    }

    // Always keep "type" in the URL
    if (!params.has("type")) {
      params.set("type", selectedType ?? "");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const selectedType = searchParams?.get("type");

  useEffect(() => {
    const checkPanelWidth = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const currentWidth = entry.contentRect.width;
        setPanelWidth(Math.round(currentWidth));
      }
    };

    const resizeObserver = new ResizeObserver(checkPanelWidth);

    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full" ref={panelRef}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            updateQueryParams("q", data.search ?? "")
          )}
          className={`w-full gap-6 flex items-center justify-between flex-col ${
            panelWidth <= setMaxWidth ? "flex-col" : "md:flex-row"
          } `}
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormControl>
                    <div className="flex gap-3 relative">
                      <span className="absolute left-4 top-4">
                        <Image src={IconSearch} alt="Search" />
                      </span>
                      <Input
                        placeholder="Search.."
                        {...field}
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className={`flex gap-3 ${
              panelWidth <= setMaxWidth ? "w-full" : ""
            }`}
          >
            <Button
              className={`${panelWidth <= setMaxWidth ? "w-full" : "px-6"} ${
                selectedType === "all"
                  ? "bg-customRed-v3 hover:bg-customRed-v2"
                  : "btn-white-normal link"
              }`}
              type="button"
              onClick={() => updateQueryParams("type", "all")}
            >
              All
            </Button>
            <Button
              className={`${panelWidth <= setMaxWidth ? "w-full" : "px-6"} ${
                selectedType === "One Way"
                  ? "bg-customRed-v3 hover:bg-customRed-v2"
                  : "btn-white-normal link"
              }`}
              type="button"
              onClick={() => updateQueryParams("type", "One Way")}
            >
              <ArrowRightToLine
                color={selectedType === "One Way" ? "white" : "black"}
              />
              One Way
            </Button>
            <Button
              className={`${panelWidth <= setMaxWidth ? "w-full" : "px-6"} ${
                selectedType === "Two Way"
                  ? "bg-customRed-v3 hover:bg-customRed-v2"
                  : "btn-white-normal link"
              }`}
              type="button"
              onClick={() => updateQueryParams("type", "Two Way")}
            >
              <ArrowRightLeft
                color={selectedType === "Two Way" ? "white" : "black"}
              />
              Two Way
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// We now wrap Filter component inside Suspense
const FilterTop = () => {
  return (
    <Suspense fallback={<div>Loading Filter...</div>}>
      <Filter />
    </Suspense>
  );
};

export default FilterTop;
/*
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSearch } from "../../../../assets/images";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowRightLeft, ArrowRightToLine } from "lucide-react";

const setMaxWidth = 520;

const Filter = () => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState<number>(300);

  const router = useRouter();
  const searchParams = useSearchParams();

  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateQueryParams("q", data.search ?? "");
  }

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // Remove "q" if it is empty
    }

    /// Always keep "type" in the URL
    if (!params.has("type")) {
      params.set("type", selectedType ?? "");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const selectedType = searchParams?.get("type");

  useEffect(() => {
    const checkPanelWidth = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const currentWidth = entry.contentRect.width;

        setPanelWidth(Math.round(currentWidth));
      }
    };

    const resizeObserver = new ResizeObserver(checkPanelWidth);

    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="w-full" ref={panelRef}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`w-full gap-6 flex items-center justify-between flex-col ${
              panelWidth <= setMaxWidth ? "flex-col" : "md:flex-row"
            } `}
          >
            <div className="w-full">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormControl>
                      <div className="flex gap-3 relative">
                        <span className="absolute left-4 top-4">
                          <Image src={IconSearch} alt="Search" />
                        </span>
                        <Input
                          placeholder="Search.."
                          {...field}
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={`flex gap-3 ${
                panelWidth <= setMaxWidth ? "w-full" : ""
              }`}
            >
              <Button
                className={`${panelWidth <= setMaxWidth ? "w-full" : "px-6"} ${
                  selectedType === "all"
                    ? "bg-customRed-v3 hover:bg-customRed-v2"
                    : "btn-white-normal link"
                }`}
                type="button"
                onClick={() => updateQueryParams("type", "all")}
              >
                All
              </Button>
              <Button
                className={`${panelWidth <= setMaxWidth ? "w-full" : "px-6"} ${
                  selectedType === "One Way"
                    ? "bg-customRed-v3 hover:bg-customRed-v2"
                    : "btn-white-normal link"
                }`}
                type="button"
                onClick={() => updateQueryParams("type", "One Way")}
              >
                <ArrowRightToLine
                  color={selectedType === "One Way" ? "white" : "black"}
                />
                One Way
              </Button>
              <Button
                className={` ${panelWidth <= setMaxWidth ? "w-full" : "px-6"} ${
                  selectedType === "Two Way"
                    ? "bg-customRed-v3 hover:bg-customRed-v2"
                    : "btn-white-normal link"
                }`}
                type="button"
                onClick={() => updateQueryParams("type", "Two Way")}
              >
                <ArrowRightLeft
                  color={selectedType === "Two Way" ? "white" : "black"}
                />
                Two Way
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

const FilterTop = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Filter />
    </Suspense>
  );
};

export default FilterTop;
*/
