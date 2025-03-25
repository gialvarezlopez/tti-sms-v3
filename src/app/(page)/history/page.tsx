"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/DataTable";
import { columns } from "./Columns";
import { RefetchOptions, TicketsProps } from "@/types/types";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import ErrorFetching from "@/components/ui/errorFetching";
import { useGetTickets } from "@/hooks/useTickets";
import { convertDateYYYYMMDD } from "@/lib/utils/dateUtils";
import { TICKETS_STATUS, USER_ROLE } from "@/lib/constants";
import dynamic from "next/dynamic";
import { removeAllParamsFromUrl } from "../../../lib/utils/urlUtils";
import useResizeObserver from "use-resize-observer";

const Actions = dynamic(() => import("./Actions"), {
  ssr: false,
});

type IsColumnSelectedFn<T> = (column: ColumnDef<T>, action?: string) => void;

const paramsToIgnore = ["sortOrder", "page"];

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Acceder al router
  const searchParams = useSearchParams();
  const selectedPage = searchParams?.get("page");
  const hasParams = searchParams
    ? Array.from(searchParams.entries()).filter(
        ([key, value]) =>
          !paramsToIgnore.includes(key) && !(key === "page" && value === "1")
      ).length > 0
    : false;

  const [sortBy, setSortBy] = useState<string>(""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State for ascending or descending order
  const [data, setData] = useState<TicketsProps[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<TicketsProps[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: selectedPage ? +selectedPage - 1 : 0,
    pageSize: 10,
  });

  const { ref: refMainDiv, width: widthMainDiv = 0 } =
    useResizeObserver<HTMLDivElement>();

  const searchParam = searchParams?.get("search") ?? "";
  const branchesParam = searchParams?.get("branches");
  const templatesParam = searchParams?.get("templates");
  const statusTicketParams = searchParams?.get("status");
  const lastSentFromParams = searchParams?.get("lastSentFrom");
  const lastSentToParams = searchParams?.get("lastSentTo");
  const lastReceivedFromParams = searchParams?.get("lastReceivedFrom");
  const lastReceivedToParams = searchParams?.get("lastReceivedTo");
  const typeOfMessageParams = searchParams?.get("typeOfMessage");

  const branches =
    branchesParam &&
    branchesParam !== "all" &&
    session?.user?.primaryRole !== USER_ROLE.USER // user
      ? branchesParam.split(",")
      : [];

  const templates =
    templatesParam && templatesParam !== "all" ? templatesParam.split(",") : [];

  const statusArray = Object.values(TICKETS_STATUS).filter(
    (status) => status === TICKETS_STATUS.CLOSED
  );
  const statusTickets =
    statusTicketParams && statusTicketParams !== "all"
      ? statusTicketParams.split(",")
      : statusArray;

  const last_sent =
    lastSentFromParams && lastSentToParams
      ? [
          convertDateYYYYMMDD(lastSentFromParams),
          convertDateYYYYMMDD(lastSentToParams),
        ]
      : [];

  const last_received =
    lastReceivedFromParams && lastReceivedToParams
      ? [
          convertDateYYYYMMDD(lastReceivedFromParams),
          convertDateYYYYMMDD(lastReceivedToParams),
        ]
      : [];

  const typeTicket =
    typeOfMessageParams && typeOfMessageParams !== "all"
      ? typeOfMessageParams.split(",")
      : [];
  /*
  useEffect(() => {
    // If there is no `page` parameter in the URL, reset to page 1
    if (!searchParams?.get("page")) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchParams]);
  */
  useEffect(() => {
    const newPage = searchParams?.get("page")
      ? Number(searchParams.get("page")) - 1
      : 0;

    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  }, [searchParams]);

  const {
    data: dataTickets,
    error: errorTickets,
    isLoading: isLoadingTickets,
    refetch,
  } = useGetTickets({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    query: searchParam,
    status: statusTickets,
    branches,
    templates,
    last_sent,
    last_received,
    types: typeTicket,
  });

  useEffect(() => {
    if (dataTickets) {
      setData(dataTickets.data);
      setTotalPages(dataTickets.meta.pagination.totalPages);
      setIsDataLoaded(true);
    }
  }, [dataTickets]);

  const fetchData = (page: number, pageSize: number) => {
    setPagination({ pageIndex: page - 1, pageSize });
  };

  const selected: IsColumnSelectedFn<TicketsProps> = (
    column: ColumnDef<TicketsProps>
  ) => {
    const ids = [];
    for (const [clave, valor] of Object.entries(column)) {
      ids.push(valor);
    }
    setRowSelected(ids);
    setClearSelected(false);
  };

  const handleClearSelected = (value: boolean) => {
    setClearSelected(value);
  };

  useEffect(() => {
    if (clearSelected) {
      handleClearSelected(true);
    }
  }, [clearSelected]);

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

  useEffect(() => {
    if (errorTickets) {
      setIsDataLoaded(true);
    }
  }, [errorTickets]);

  const maxHeightScrollTable = () => {
    return widthMainDiv <= 768 ? `max-h-[450px]` : `max-h-[calc(100vh-400px)]`;
  };

  return (
    <div ref={refMainDiv}>
      <div>
        <div className="flex gap-6 justify-between">
          <h1 className="font-bold text-2xl md:text-4xl">History</h1>
        </div>
        <p className="py-2">
          All your closed tickets are here for consultation.
        </p>
      </div>
      <div className="rounded-lg bg-white my-6 p-4">
        <div>
          <h3 className="text-xl font-semibold">Tickets</h3>
          <Actions />
        </div>
        <div className="mx-auto py-5">
          {isLoadingTickets || !isDataLoaded ? (
            <TableSkeleton
              rows={5}
              cols={widthMainDiv <= 768 ? 3 : 7}
              checkbox={true}
              dots={true}
              width="w-full md:w-1/2"
            />
          ) : errorTickets ? (
            <ErrorFetching
              message={
                errorTickets.message ?? "There was an error to get the tickets"
              }
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
