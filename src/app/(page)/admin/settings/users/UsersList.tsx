"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useResizeObserver from "use-resize-observer";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/DataTable";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { RefetchOptions, UserProps } from "@/types/types";
import { useGetUsers } from "@/hooks/useUsers";
import useColumns from "./Columns";
import ErrorFetching from "@/components/ui/errorFetching";
import { removeAllParamsFromUrl } from "../../../../../lib/utils/urlUtils";

type IsColumnSelectedFn<T> = (column: ColumnDef<T>, action?: string) => void;
type Props = {
  setUsersSelected: React.Dispatch<React.SetStateAction<UserProps[]>>;
  clearRowsSelected: boolean;
  setClearRowsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};
const limitByDefault = 10;
const UsersList = ({
  setUsersSelected,
  clearRowsSelected,
  setClearRowsSelected,
}: Props) => {
  const columns = useColumns();
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasParams = searchParams
    ? Array.from(searchParams.entries()).length > 0
    : false;

  const selectedPage = searchParams?.get("page");
  const selectedLimit = searchParams?.get("limit");
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
  const [data, setData] = useState<UserProps[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<number[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: selectedPage ? +selectedPage - 1 : 0,
    pageSize: selectedLimit ? +selectedLimit : limitByDefault,
  });

  const searchParam = searchParams?.get("search") ?? "";
  const rolesParams = searchParams?.get("roles");
  const roleTypes =
    rolesParams && rolesParams !== "all" ? rolesParams.split(",") : [];

  useEffect(() => {
    const newPage = searchParams?.get("page")
      ? Number(searchParams.get("page")) - 1
      : 0;

    const newLimit = searchParams?.get("limit")
      ? Number(searchParams.get("limit"))
      : limitByDefault;

    setPagination({
      pageIndex: newPage,
      pageSize: newLimit,
    });
  }, [searchParams]);

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    query: searchParam,
    roles: roleTypes,
  });

  // Calculation of the displayed records and the range
  const currentPage = pagination.pageIndex + 1; // the current page (1-indexed)
  const perPage = pagination.pageSize; // elements per page
  const total = response?.meta.pagination.count || 0; // total records

  // We calculate the range of records being displayed
  const startRecord = (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, total);

  // Show the range and total of elements
  const displayText = `Showing ${startRecord}-${endRecord} of ${total} items`;

  useEffect(() => {
    if (response) {
      setData(response?.data);
      setTotalPages(response?.meta?.pagination?.totalPages);
      setIsDataLoaded(true);
    }
  }, [response]);

  const fetchData = (page: number, pageSize: number) => {
    setPagination({ pageIndex: page - 1, pageSize });
  };

  const selected: IsColumnSelectedFn<UserProps> = (
    column: ColumnDef<UserProps>
  ) => {
    const ids = [];
    for (const [clave, valor] of Object.entries(column)) {
      ids.push(valor);
    }

    setRowSelected(ids);
    setUsersSelected(ids);
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
        query: searchParam,
        sortBy,
        sortOrder,
      };

      refetch(refetchOptions as object);
    }
  }, [pagination, searchParam, sortBy, sortOrder, refetch]);

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
      setUsersSelected([]);
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
                cols={widthMainDiv <= 768 ? 2 : 5}
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
                search={searchParam}
                fetchData={fetchData}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange} // Pass the sort change function
                isColumnSelected={selected}
                clearSelected={clearSelected} //clear the checkboxes
                onClearSelected={() => setClearSelected(false)} //change the status
                paramsUrl={{ hasParams, removeAllParamsFromUrl }}
                messageNoRecord={
                  hasParams
                    ? "We have not found any results for your search."
                    : ""
                }
                scrollBody={maxHeightScrollTable()}
                displayText={displayText}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersList;
