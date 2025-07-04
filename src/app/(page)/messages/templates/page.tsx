"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ListTemplate from "./ListTemplate";
import { useGetTemplates } from "@/hooks/useTemplates";
import { TemplateProps } from "@/types/types";
import ErrorFetching from "@/components/ui/errorFetching";

// Dynamic loading of FilterTop to avoid SSR (static rendering)
const FilterTop = dynamic(() => import("./FiltersTop"), { ssr: false });

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams?.get("page");
  const selectedSearch = searchParams?.get("q")?.toLowerCase() || "";

  const [data, setData] = useState<TemplateProps[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: selectedPage ? +selectedPage - 1 : 0,
    pageSize: 10,
  });

  const {
    data: response,
    error,
    isLoading,
  } = useGetTemplates({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    query: selectedSearch,
  });

  useEffect(() => {
    if (response) {
      setData(response?.data);
      setTotalPages(response?.meta?.pagination?.totalPages);
      setIsDataLoaded(true);
    }
  }, [response]);

  const fetchData = (page: number, pageSize: number, search: string) => {
    setPagination({ pageIndex: page - 1, pageSize });
    setSearch(search);
  };

  const handlePageChange = (newPageIndex: number) => {
    const params = new URLSearchParams(window.location.search);
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
    params.set("page", (+newPageIndex + 1).toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
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
        <div className="mt-4">
          <ErrorFetching message="There was an error to load the templates" />
        </div>
      )}

      <Suspense fallback={<div>Loading Templates...</div>}>
        <ListTemplate
          dataTemplates={data ?? []}
          isLoading={isLoading}
          isDataLoaded={isDataLoaded}
          pagination={{
            currentPage: pagination.pageIndex, // Current page (0-based)
            totalPages: totalPages,
          }}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </div>
  );
};

export default Page;
