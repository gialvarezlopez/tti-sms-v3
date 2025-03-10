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
import { dataBranches } from "../mock/dataBranch";
import { useGetBranches } from "@/hooks/useBranches";
import ErrorFetching from "@/components/ui/errorFetching";

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
  const selectedPage = searchParams?.get("page");
  const selectedSortOrder = searchParams ? searchParams.get("sortOrder") : null;
  const selectedSortBy = searchParams ? searchParams.get("sortBy") : null;

  const { ref, width = 0 } = useResizeObserver<HTMLDivElement>();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(selectedSortBy ?? ""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>( // Permite null
    selectedSortOrder === "asc" || selectedSortOrder === "desc"
      ? (selectedSortOrder.toLowerCase() as "asc" | "desc")
      : null
  );
  const [data, setData] = useState<BranchProps[]>(dataBranches);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<number[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: selectedPage ? +selectedPage - 1 : 0,
    pageSize: 10,
  });

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetBranches({
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

  // Trigger refetch when pagination or search changes
  useEffect(() => {
    // We ensure that useGetUsers is executed only when pagination is updated
    if (pagination.pageIndex >= 0) {
      const refetchOptions: RefetchOptions = {
        pagination: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
        search,
      };

      refetch(refetchOptions as object);
    }
  }, [pagination, search, refetch]);

  const selected: IsColumnSelectedFn<BranchProps> = (
    column: ColumnDef<BranchProps>
  ) => {
    const ids = [];
    for (const [clave, valor] of Object.entries(column)) {
      ids.push(valor);
    }
    console.log("ids", ids);
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
        search,
        sortBy,
        sortOrder,
      };

      refetch(refetchOptions as object);
    }
  }, [pagination, search, sortBy, sortOrder, refetch]);

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

  return (
    <div ref={ref}>
      <div className="mx-auto py-2">
        {error ? (
          <div className="mt-4">
            <ErrorFetching message={error.message} />
          </div>
        ) : (
          <>
            {isLoading ? (
              <TableSkeleton
                rows={5}
                cols={width <= 768 ? 2 : 4}
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
                search={search}
                fetchData={fetchData}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange} // Pass the sort change function
                isColumnSelected={selected}
                clearSelected={clearSelected} //clear the checkboxes
                onClearSelected={() => setClearSelected(false)} //change the status
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BranchesList;
