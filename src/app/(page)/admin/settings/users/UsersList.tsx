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
  limitByDefault: number;
};

//const limitByDefault = 25;

const UsersList = ({
  setUsersSelected,
  clearRowsSelected,
  setClearRowsSelected,
  limitByDefault,
}: Props) => {
  const columns = useColumns();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { ref: refMainDiv, width: widthMainDiv = 0 } =
    useResizeObserver<HTMLDivElement>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limitByDefault,
  });
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [data, setData] = useState<UserProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [clearSelected, setClearSelected] = useState(false);

  const searchParam = searchParams?.get("search") ?? "";
  const rolesParams = searchParams?.get("roles");
  const roleTypes =
    rolesParams && rolesParams !== "all" ? rolesParams.split(",") : [];

  // 1. Sync state from URL
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

  // 2. Fetch users
  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetUsers({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    query: searchParam,
    roles: roleTypes,
  });

  // 3. Load data into state
  useEffect(() => {
    if (response) {
      setData(response.data);
      setTotalPages(response.meta?.pagination?.totalPages || 0);
      setIsDataLoaded(true);
    }
  }, [response]);

  // 4. Show error if fetch failed
  useEffect(() => {
    if (error) {
      setIsDataLoaded(true);
    }
  }, [error]);

  // 5. Clear selected state if requested
  useEffect(() => {
    if (clearRowsSelected) {
      setClearSelected(true);
    }
  }, [clearRowsSelected]);

  // 6. Cleanup on unmount
  useEffect(() => {
    return () => {
      setUsersSelected([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 7. Column selection handler
  const selected: IsColumnSelectedFn<UserProps> = (column) => {
    const ids = Object.values(column);
    setUsersSelected(ids as UserProps[]);
    setClearRowsSelected(false);
  };

  // 8. Handle pagination change
  const fetchData = (page: number, pageSize: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    params.set("limit", pageSize.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder.toUpperCase());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // 9. Handle sorting
  const handleSortChange = (field: string) => {
    let newOrder: "asc" | "desc" = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", field);
    params.set("sortOrder", newOrder.toUpperCase());
    params.set("page", "1"); // reset to first page on sort change
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Pagination range text
  const currentPage = pagination.pageIndex + 1;
  const perPage = pagination.pageSize;
  const total = response?.meta.pagination.total || 0;
  const startRecord = (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, total);
  const displayText = `Showing ${startRecord}-${endRecord} of ${total} items`;

  const maxHeightScrollTable = () => {
    return widthMainDiv <= 768 ? `max-h-[450px]` : `max-h-[calc(100vh-310px)]`;
  };

  const hasParams = searchParams
    ? Array.from(searchParams.entries()).length > 0
    : false;

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
            onSortChange={handleSortChange}
            isColumnSelected={selected}
            clearSelected={clearSelected}
            onClearSelected={() => setClearSelected(false)}
            paramsUrl={{ hasParams, removeAllParamsFromUrl }}
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

export default UsersList;
