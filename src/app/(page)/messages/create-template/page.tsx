"use client";
import React from "react";
import FormCreateTemplate from "./FormCreateTemplate";
import withAdminProtection from "@/components/hoc/withAdminProtection";

const Page = () => {
  return (
    <div>
      <FormCreateTemplate />
    </div>
  );
};

export default withAdminProtection(Page);
