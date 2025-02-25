"use client";
import React from "react";
import FilterTop from "./SearchTop";
import { Separator } from "@/components/ui/separator";
import TemplateSelection from "@/components/screens/templates/TemplateSelection";

const Message = () => {
  return (
    <div>
      <div className="flex justify-between gap-3 flex-col md:flex-row">
        <h2 className="font-bold text-2xl text-center md:text-left">
          New Message
        </h2>
        <FilterTop />
      </div>

      <p className="py-3">Select the template that works best.</p>
      <Separator className="my-3" />

      <TemplateSelection
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        isLink={true}
      />
    </div>
  );
};

export default Message;
