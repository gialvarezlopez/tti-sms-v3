"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import useResizeObserver from "use-resize-observer";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/DataTable";
import { columns } from "./Columns";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { BranchProps, RefetchOptions } from "@/types/types";
import { useGetBranches } from "@/hooks/useBranches";
import ErrorFetching from "@/components/ui/errorFetching";
import { removeParamsExcept } from "../../../../../lib/utils/urlUtils";

type IsColumnSelectedFn<T> = (column: ColumnDef<T>, action?: string) => void;

type Props = {
  clearRowsSelected: boolean;
  setClearRowsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setBranchesSelected: React.Dispatch<React.SetStateAction<BranchProps[]>>;
  limitByDefault: number;
};

const BranchesList = ({
  clearRowsSelected,
  setClearRowsSelected,
  setBranchesSelected,
  limitByDefault,
}: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasParams = searchParams
    ? Array.from(searchParams.entries()).length > 0
    : false;

  const { ref: refMainDiv, width: widthMainDiv = 0 } =
    useResizeObserver<HTMLDivElement>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limitByDefault,
  });
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [data, setData] = useState<BranchProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [clearSelected, setClearSelected] = useState(false);

  const queryParam = searchParams?.get("search") ?? "";
  const provincesParams = searchParams?.get("provinces");
  const statusParams = searchParams?.get("status");

  const provincesTypes =
    provincesParams && provincesParams !== "all"
      ? provincesParams.split(",")
      : [];
  const statusTypes =
    statusParams && statusParams !== "all" ? statusParams.split(",") : [];

  // 1. Sync state from URL (page, limit, sort)
  useEffect(() => {
    const page = Number(searchParams?.get("page") ?? "1") - 1;
    const limit = Number(searchParams?.get("limit") ?? limitByDefault);
    const sortByParam = searchParams?.get("sortBy") ?? "";
    const sortOrderParam =
      searchParams?.get("sortOrder")?.toLowerCase() ?? null;

    setPagination({ pageIndex: page, pageSize: limit });
    setSortBy(sortByParam);
    setSortOrder(
      sortOrderParam === "asc" || sortOrderParam === "desc"
        ? (sortOrderParam as "asc" | "desc")
        : null
    );
  }, [searchParams, limitByDefault]);

  // 2. Fetch branches
  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetBranches({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    query: queryParam,
    provinces: provincesTypes,
    status: statusTypes,
  });

  // 3. Load response into state
  useEffect(() => {
    if (response) {
      setData(response.data);
      setTotalPages(response.meta?.pagination?.totalPages || 0);
      setIsDataLoaded(true);
    }
  }, [response]);

  // 4. Handle fetch error
  useEffect(() => {
    if (error) {
      setIsDataLoaded(true);
    }
  }, [error]);

  // 5. Clear selected rows when requested
  useEffect(() => {
    if (clearRowsSelected) setClearSelected(true);
  }, [clearRowsSelected]);

  // 6. Cleanup on unmount
  useEffect(() => {
    return () => {
      setBranchesSelected([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 7. Column selection handler
  const selected: IsColumnSelectedFn<BranchProps> = (column) => {
    const ids = Object.values(column) as BranchProps[];
    setBranchesSelected(ids);
    setClearRowsSelected(false);
  };

  // 8. Handle pagination change → update URL
  const fetchData = (page: number, pageSize: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    params.set("limit", pageSize.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder.toUpperCase());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // 9. Handle sort change → update URL
  const handleSortChange = (field: string) => {
    let newOrder: "asc" | "desc" = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", field);
    params.set("sortOrder", newOrder.toUpperCase());
    params.set("page", "1"); // reset to first page
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Calculate display text
  const currentPage = pagination.pageIndex + 1;
  const perPage = pagination.pageSize;
  const total = response?.meta.pagination.total || 0;
  const startRecord = (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, total);
  const displayText = `Showing ${startRecord}-${endRecord} of ${total} items`;

  const maxHeightScrollTable = () =>
    widthMainDiv <= 768 ? `max-h-[450px]` : `max-h-[calc(100vh-310px)]`;

  return (
    <div ref={refMainDiv}>
      <div className="mx-auto py-2">
        {error ? (
          <div className="mt-4">
            <ErrorFetching message={error.message} />
          </div>
        ) : isLoading || !isDataLoaded ? (
          <TableSkeleton
            rows={5}
            cols={widthMainDiv <= 768 ? 2 : 4}
            checkbox
            dots
            width="w-full md:w-1/2"
          />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            pagination={pagination}
            setPagination={setPagination}
            totalPages={totalPages}
            search={queryParam}
            fetchData={fetchData}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            isColumnSelected={selected}
            clearSelected={clearSelected}
            onClearSelected={() => setClearSelected(false)}
            paramsUrl={{
              hasParams,
              paramsToKeep: ["type"],
              removeParamsExcept,
            }}
            messageNoRecord={
              hasParams ? "We have not found any results for your search." : ""
            }
            scrollBody={maxHeightScrollTable()}
            displayText={displayText}
          />
        )}
      </div>
    </div>
  );
};

export default BranchesList;
