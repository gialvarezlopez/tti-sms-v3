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
};

const BranchesList = ({
  clearRowsSelected,
  setClearRowsSelected,
  setBranchesSelected,
}: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasParams = searchParams
    ? Array.from(searchParams.entries()).length > 0
    : false;

  const selectedPage = searchParams?.get("page");
  const selectedSortOrder = searchParams ? searchParams.get("sortOrder") : null;
  const selectedSortBy = searchParams ? searchParams.get("sortBy") : null;

  const { ref: refMainDiv, width: widthMainDiv = 0 } =
    useResizeObserver<HTMLDivElement>();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(selectedSortBy ?? ""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(
    selectedSortOrder === "asc" || selectedSortOrder === "desc"
      ? (selectedSortOrder.toLowerCase() as "asc" | "desc")
      : null
  );
  const [data, setData] = useState<BranchProps[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<number[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: selectedPage ? +selectedPage - 1 : 0,
    pageSize: 10,
  });

  const queryParam = searchParams?.get("search") ?? "";
  const provincesParams = searchParams?.get("provinces");
  const statusParams = searchParams?.get("status");

  const provincesTypes =
    provincesParams && provincesParams !== "all"
      ? provincesParams.split(",")
      : [];
  const statusTypes =
    statusParams && statusParams !== "all" ? statusParams.split(",") : [];

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetBranches({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    query: queryParam,
    provinces: provincesTypes,
    status: statusTypes,
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
  };

  const selected: IsColumnSelectedFn<BranchProps> = (
    column: ColumnDef<BranchProps>
  ) => {
    const ids = [];
    for (const [clave, valor] of Object.entries(column)) {
      ids.push(valor);
    }

    setRowSelected(ids);
    setBranchesSelected(ids);
    setClearRowsSelected(false);
  };

  const handleClearSelected = (value: boolean) => {
    setClearSelected(value);
  };

  useEffect(() => {
    if (clearRowsSelected) {
      handleClearSelected(true);
    }
  }, [clearRowsSelected]);

  //=====================================
  //Start URL Parameters
  //=====================================
  //1. Update URL when sorting changes
  const handleSortChange = (field: string) => {
    let newSortOrder: "asc" | "desc" | null = "asc"; // By default, ascending order

    if (field === sortBy) {
      // If already sorted by the same field, reverse the order
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    // Update local states
    setSortBy(field);
    setSortOrder(newSortOrder);

    // Update URL
    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", field);
    params.set("sortOrder", newSortOrder === "asc" ? "ASC" : "DESC");
    params.set("page", (pagination.pageIndex + 1).toString());

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  //2. Synchronizing local states with the URL when loading the component
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    if (sortByParam) {
      setSortBy(sortByParam);
    }
    if (sortOrderParam) {
      setSortOrder(sortOrderParam.toUpperCase() === "ASC" ? "asc" : "desc");
    }
  }, []);

  //3. Refetch data when URL parameters change
  useEffect(() => {
    if (pagination.pageIndex >= 0) {
      const refetchOptions: RefetchOptions = {
        pagination: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
        query: queryParam,
        sortBy,
        sortOrder,
      };

      refetch(refetchOptions as object);
    }
  }, [pagination, queryParam, sortBy, sortOrder, refetch]);

  //4. Handling pagination
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", (pagination.pageIndex + 1).toString());
    if (sortBy) {
      params.set("sortBy", sortBy);
    }
    if (sortOrder) {
      params.set("sortOrder", sortOrder === "asc" ? "ASC" : "DESC");
    }
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [pagination.pageIndex, router, sortBy, sortOrder]);

  //5. Clearing states when unmounting the component
  useEffect(() => {
    return () => {
      setBranchesSelected([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      setIsDataLoaded(true);
    }
  }, [error]);

  const maxHeightScrollTable = () => {
    return widthMainDiv <= 768 ? `max-h-[450px]` : `max-h-[calc(100vh-310px)]`;
  };

  return (
    <div ref={refMainDiv}>
      <div className="mx-auto py-2">
        {error ? (
          <div className="mt-4">
            <ErrorFetching message={error.message} />
          </div>
        ) : (
          <>
            {isLoading || !isDataLoaded ? (
              <TableSkeleton
                rows={5}
                cols={widthMainDiv <= 768 ? 2 : 4}
                checkbox={true}
                dots={true}
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
                  hasParams
                    ? "We have not found any results for your search."
                    : ""
                }
                scrollBody={maxHeightScrollTable()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BranchesList;
