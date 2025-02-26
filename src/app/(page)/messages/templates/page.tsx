//message/template/page.tsx
"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import ListTemplate from "./ListTemplate";
import { dataTemplates } from "@/components/screens/templates/dataMock";
//import FilterTop from "./FiltersTop";

// Dynamic loading of FilterTop to avoid SSR (static rendering)
const FilterTop = dynamic(() => import("./FiltersTop"), { ssr: false });

const Page = () => {
  return (
    <div>
      <div>
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-xl md:text-2xl mb-6">Templates</h2>
        </div>
      </div>

      <Suspense fallback={<div>Loading Filter...</div>}>
        <FilterTop />
      </Suspense>

      <Suspense fallback={<div>Loading Templates...</div>}>
        <ListTemplate dataTemplates={dataTemplates ?? []} />
      </Suspense>
    </div>
  );
};

export default Page;
