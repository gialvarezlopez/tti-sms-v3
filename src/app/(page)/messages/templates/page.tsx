//message/template/page.tsx
"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ListTemplate from "./ListTemplate";
import { dataTemplates } from "@/components/screens/templates/dataMock";
import { useGetTemplates } from "@/hooks/useTemplates";
import { TemplateProps } from "@/types/types";
import CustomFormMessage from "@/components/ui/CustomFormMessage";
//import FilterTop from "./FiltersTop";

// Dynamic loading of FilterTop to avoid SSR (static rendering)
const FilterTop = dynamic(() => import("./FiltersTop"), { ssr: false });

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams?.get("page");
  const selectedType = searchParams?.get("type");

  const [data, setData] = useState<TemplateProps[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: response,
    error,
    isLoading,
  } = useGetTemplates({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  useEffect(() => {
    if (response) {
      setData(response.data);
      setTotalPages(response.meta.pagination.totalPages);
    }
  }, [response]);

  const fetchData = (page: number, pageSize: number, search: string) => {
    setPagination({ pageIndex: page - 1, pageSize });
    setSearch(search);
  };

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

      {error && (
        <CustomFormMessage>
          There was an error to load the templates
        </CustomFormMessage>
      )}

      <Suspense fallback={<div>Loading Templates...</div>}>
        <ListTemplate dataTemplates={data ?? []} />
      </Suspense>
    </div>
  );
};

export default Page;
