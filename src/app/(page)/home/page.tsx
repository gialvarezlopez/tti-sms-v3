"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import useResizeObserver from "use-resize-observer";
import DataTable from "@/components/ui/DataTable";
import useColumns from "./Columns";
import Actions from "./Actions";
import { RefetchOptions, TicketsProps } from "@/types/types";
import CardProcessSkeleton from "../../../components/skeletons/CardProcessSkeleton";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { useGetStats } from "@/hooks/useTrackProcess";
import ErrorFetching from "@/components/ui/errorFetching";
import Items from "./card/Items";
import { useGetTickets } from "@/hooks/useTickets";
import { convertDateYYYYMMDD } from "@/lib/utils/dateUtils";
import { TICKETS_STATUS, USER_ROLE } from "@/lib/constants";
import { removeAllParamsFromUrl } from "../../../lib/utils/urlUtils";
import { capitalizeFirstLetterOfEveryWord } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
//import InactivityRefresh from "@/components/commons/InactivityRefresh";
import InactivityRefreshWithWarning from "@/components/commons/InactivityRefreshWithWarning";
//import { DashboardControlsRefresh } from "@/components/commons/DashboardControlsRefresh";

type IsColumnSelectedFn<T> = (column: ColumnDef<T>, action?: string) => void;

const paramsToIgnore = ["sortOrder", "page"];
const limitByDefault = 10;

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const holderRef = React.useRef<HTMLDivElement | null>(null);
  const [holderHeight, setHolderHeight] = useState<number>(0);

  const selectedPage = searchParams?.get("page");

  const selectedLimit = searchParams?.get("limit");

  const hasParams = searchParams
    ? Array.from(searchParams.entries()).filter(
        ([key, value]) =>
          !paramsToIgnore.includes(key) && !(key === "page" && value === "1")
      ).length > 0
    : false;

  const columns = useColumns();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State for ascending or descending order
  const [data, setData] = useState<TicketsProps[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<TicketsProps[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: selectedPage ? +selectedPage - 1 : 0,
    pageSize: selectedLimit ? +selectedLimit : limitByDefault,
  });

  const { ref: refMainDiv, width: widthMainDiv = 0 } =
    useResizeObserver<HTMLDivElement>();

  const searchParam = searchParams?.get("search") ?? "";
  const branchesParam = searchParams?.get("branches");
  const statusTicketParams = searchParams?.get("status");
  const lastSentFromParams = searchParams?.get("lastSentFrom");
  const lastSentToParams = searchParams?.get("lastSentTo");
  const lastReceivedFromParams = searchParams?.get("lastReceivedFrom");
  const lastReceivedToParams = searchParams?.get("lastReceivedTo");
  const typeOfMessageParams = searchParams?.get("typeOfMessage");

  const branches =
    session?.user?.primaryRole === USER_ROLE.USER
      ? [session?.user?.branch.id]
      : branchesParam && branchesParam !== "all"
      ? branchesParam.split(",")
      : [];

  const statusArray = Object.values(TICKETS_STATUS).filter(
    (status) => status !== TICKETS_STATUS.CLOSED
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

  const {
    data: dataStats,
    error: errorStats,
    isLoading: isLoadingStats,
  } = useGetStats({
    branches,
    status: statusTickets,
    last_sent,
    last_received,
    types: typeTicket,
    //search,
  });

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
    data: dataTickets,
    error: errorTickets,
    isLoading: isLoadingTickets,
    refetch,
  } = useGetTickets({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    query: searchParam,
    branches,
    status: statusTickets,
    last_sent,
    last_received,
    types: typeTicket,
  });

  // Cálculo de los registros mostrados y el rango
  const currentPage = pagination.pageIndex + 1; // la página actual (1-indexed)
  const perPage = pagination.pageSize; // elementos por página
  const total = dataTickets?.meta.pagination.total || 0; // total de registros

  // Calculamos el rango de registros que se están mostrando
  const startRecord = (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, total);

  // Mostrar el rango y el total de elementos
  const displayText = `Showing ${startRecord}-${endRecord} of ${total} items`;

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

  useEffect(() => {
    const updateHeight = () => {
      if (holderRef.current) {
        setHolderHeight(holderRef.current.offsetHeight);
      }
    };

    updateHeight(); // when mounting

    // also when resizing
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  /*
  const maxHeightScrollTable = () => {
    return widthMainDiv <= 768 ? `max-h-[450px]` : `max-h-[calc(100vh-540px)]`;
  };
  */
  const maxHeightScrollTable = () => {
    return widthMainDiv <= 768 ? `max-h-[450px]` : `max-h-[700px]`;
  };

  /*
  const maxHeightScrollTable = () => {
    if (widthMainDiv > 768 && holderHeight < 450) {
      return "max-h-[700px]";
    }
    return widthMainDiv <= 768 ? "max-h-[450px]" : "max-h-[calc(100vh-540px)]";
  };
  */

  return (
    <div ref={refMainDiv}>
      <div className="flex gap-6 justify-between">
        <h1 className="font-bold text-2xl md:text-4xl">
          Welcome {capitalizeFirstLetterOfEveryWord(session?.user.name)}
        </h1>
      </div>
      <p className="py-2">
        Follow up on your messages and track their progress.
      </p>

      <InactivityRefreshWithWarning />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {isLoadingStats ? (
          Array(widthMainDiv <= 768 ? 2 : 5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="h-full">
                <CardProcessSkeleton />
              </div>
            ))
        ) : errorStats ? (
          <div className="md:col-span-3">
            <ErrorFetching
              message={
                errorStats.message ?? "There was an error to get the stats"
              }
            />
          </div>
        ) : (
          <Items dataStats={dataStats} />
        )}
      </div>

      <div
        className="rounded-lg bg-white my-6 p-4"
        id="holder_table"
        ref={holderRef}
      >
        <div className="flex gap-3 justify-between">
          <h3 className="text-xl font-semibold">Tickets</h3>
          <div>
            <Button
              variant={"destructive"}
              onClick={() => window.location.reload()}
            >
              Refresh Dashboard
            </Button>
            {/*
            <DashboardControlsRefresh />
            */}
          </div>
        </div>
        <Actions
          rowSelected={rowSelected}
          handleClearSelected={handleClearSelected}
        />

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
              displayText={displayText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
