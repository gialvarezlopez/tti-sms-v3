"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/DataTable";
import { columns } from "./Columns";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { BranchProps, RefetchOptions } from "@/types/types";
import { dataBranches } from "../mock/dataBranch";
import { useGetBranches } from "@/hooks/useBranches";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams?.get("page");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State for ascending or descending order
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

  /*
  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      // Si ya está ordenado por el mismo campo, invertir el orden
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si es un nuevo campo de ordenamiento, establecerlo y por defecto ordenar asc
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  */
  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      // Si ya está ordenado por el mismo campo, invertir el orden

      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si es un nuevo campo de ordenamiento, establecerlo y por defecto ordenar asc
      setSortBy(field);
      setSortOrder("asc");
    }
    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", field);
    params.set("sortOrder", sortOrder === "asc" ? "ASC" : "DESC");
    params.set("page", (pagination.pageIndex + 1).toString());

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

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

  useEffect(() => {
    return () => {
      setBranchesSelected([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");
    const pageParam = searchParams.get("page");

    if (sortByParam) {
      setSortBy(sortByParam);
    }
    if (sortOrderParam) {
      setSortOrder(sortOrderParam.toUpperCase() === "ASC" ? "asc" : "desc");
    }
  }, []);

  // Update URL when page changes (without passing `handlePageChange` to `DataTable`)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", (pagination.pageIndex + 1).toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [pagination.pageIndex, router]);

  return (
    <div>
      <div className="mx-auto py-2">
        {isLoading ? (
          <TableSkeleton
            rows={5}
            cols={4}
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
      </div>
    </div>
  );
};

export default BranchesList;
