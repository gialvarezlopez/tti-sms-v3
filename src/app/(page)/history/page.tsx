"use client";
import React, { useEffect, useState } from "react";
//import { RefetchOptions } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/DataTable";
import { columns } from "./Columns";
//import Actions from "./Actions";
import { TicketsProps } from "@/types/types";
import { dataHistory } from "./mock/dataHistory";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import dynamic from "next/dynamic";

const Actions = dynamic(() => import("./Actions"), {
  ssr: false,
});

type IsColumnSelectedFn<T> = (column: ColumnDef<T>, action?: string) => void;

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State for ascending or descending order
  const [data, setData] = useState<TicketsProps[]>(dataHistory);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<TicketsProps[]>([]);

  //const { mutate } = useClientDeleteMultiple();
  //const { mutate: mutateDeactivate } = useClientDeactivateMultiple();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  /*
  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useGetClients({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });
  */

  /*
  useEffect(() => {
    if (response) {
      setData(response.data.docs);
      setTotalPages(response.data.totalPages);
    }
  }, [response]);
  */
  const fetchData = (page: number, pageSize: number, search: string) => {
    setPagination({ pageIndex: page - 1, pageSize });
    setSearch(search);
  };

  // Trigger refetch when pagination or search changes
  /*
  useEffect(() => {
    const refetchOptions: RefetchOptions = {
      pagination: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
      search,
    };

    refetch(refetchOptions as {});
  }, [pagination, search, refetch]);
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
  };

  const selected: IsColumnSelectedFn<TicketsProps> = (
    column: ColumnDef<TicketsProps>
  ) => {
    const ids = [];
    for (const [, valor] of Object.entries(column)) {
      ids.push(valor);
    }
    console.log("ids", ids);
    setRowSelected(ids);
  };

  /*
  const handleClearSelected = (value: boolean) => {
    setClearSelected(value);
  };
  */

  // Simulamos un retraso en la carga de los datos
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Después de 3 segundos, los datos estarán cargados
    }, 2000);
  }, []);

  return (
    <div>
      <div className="flex gap-6 justify-between">
        <h1 className="font-bold text-4xl">History</h1>
      </div>
      <p className="py-2">All your closed tickets are here for consultation.</p>

      <div className="rounded-lg bg-white my-6 p-4">
        <h3 className="text-xl font-semibold">Tickets</h3>
        <Actions
        //rowSelected={rowSelected}
        //handleClearSelected={handleClearSelected}
        />

        <div className="mx-auto py-5">
          {loading ? (
            <TableSkeleton
              rows={5}
              cols={7}
              checkbox={false}
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
    </div>
  );
};

export default Home;
