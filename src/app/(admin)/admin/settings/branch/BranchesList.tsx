"use client";
import React, { useEffect, useState } from "react";
//import { RefetchOptions } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/DataTable";
import { columns } from "./Columns";
//import { TicketsProps, UserProps } from "@/types/types";

import TableSkeleton from "@/components/skeletons/TableSkeleton";
//import Filter from "./Filters";
import { BranchProps } from "@/types/types";
import { dataBranches } from "../mock/dataBranch";

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
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(""); // Status for the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State for ascending or descending order
  const [data, setData] = useState<BranchProps[]>(dataBranches);
  const [totalPages, setTotalPages] = useState(0);
  const [clearSelected, setClearSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState<number[]>([]);

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

  // Simulamos un retraso en la carga de los datos
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Después de 3 segundos, los datos estarán cargados
    }, 500);
  }, []);

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

  return (
    <div>
      <div className="mx-auto py-2">
        {loading ? (
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
