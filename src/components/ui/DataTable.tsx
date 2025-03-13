import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  PaginationState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { AlertCircle, Search } from "lucide-react";
import { SortDirection } from "@tanstack/react-table";
import { Button } from "./button";

// Defines a type for the isColumnSelected prop
type IsColumnSelectedFn<T> = (column: ColumnDef<T>, action?: string) => void;

// Define a generic type for the data
export type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalPages: number;
  search: string;
  fetchData: (page: number, pageSize: number, search: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc" | null;
  onSortChange: (field: keyof T) => void;
  isColumnSelected: IsColumnSelectedFn<T>;
  clearSelected?: boolean;
  onClearSelected?: () => void;
  messageNoRecord?: string;
  paramsUrl?: {
    hasParams: boolean;
    removeAllParamsFromUrl: (router: ReturnType<typeof useRouter>) => void;
  }; // Definir el tipo del objeto
};

// Use the generic type in the component definition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  pagination,
  setPagination,
  totalPages,
  search,
  fetchData,
  sortBy,
  sortOrder,
  onSortChange,
  isColumnSelected,
  clearSelected,
  onClearSelected,
  messageNoRecord,
  paramsUrl,
}: DataTableProps<T>) => {
  const router = useRouter();
  // Memorize sorted data
  const sortedData = React.useMemo(() => {
    if (!sortBy) return data; // If there is no column to sort, return the original data

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const sorted = [...data].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any = a;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any = b;

      // Dynamic access to nested fields
      const fields = sortBy.split(".");
      fields.forEach((field) => {
        aValue = aValue?.[field];
        bValue = bValue?.[field];
      });

      // Handling values ​​that can be objects
      if (aValue && typeof aValue === "object") {
        aValue = aValue.nombre;
      }
      if (bValue && typeof bValue === "object") {
        bValue = bValue.nombre;
      }

      // Comparison for numerical values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * sortDirection;
      }

      // Comparison for text values
      const aComparableValue =
        aValue != null ? String(aValue).toLowerCase() : "";
      const bComparableValue =
        bValue != null ? String(bValue).toLowerCase() : "";

      if (aComparableValue < bComparableValue) return -1 * sortDirection;
      if (aComparableValue > bComparableValue) return 1 * sortDirection;
      return 0;
    });

    return sorted;
  }, [data, sortBy, sortOrder]);

  const table = useReactTable({
    data: sortedData, // Use sorted data here
    columns,
    pageCount: totalPages,
    state: {
      pagination,
    },
    manualPagination: true,
    //onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
      fetchData(newPagination.pageIndex + 1, newPagination.pageSize, search); // Fetch data on pagination change
    },
  });

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
    fetchData(newPageIndex + 1, pagination.pageSize, search);
  };

  const renderPaginationItems = () => {
    const items = [];
    const currentPage = pagination.pageIndex;
    const totalPage = totalPages;
    const maxVisiblePages = 2; //Num pages

    if (totalPage <= maxVisiblePages + 4) {
      for (let i = 0; i < totalPage; i++) {
        items.push(
          <PaginationItem key={i} active={i === currentPage}>
            <PaginationLink
              onClick={() => (i !== currentPage ? handlePageChange(i) : "")}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const firstPage = 0;
      const lastPage = totalPage - 1;

      items.push(
        <PaginationItem key={firstPage} active={firstPage === currentPage}>
          <PaginationLink onClick={() => handlePageChange(firstPage)}>
            {firstPage + 1}
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i} active={i === currentPage}>
            <PaginationLink onClick={() => handlePageChange(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPage - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={lastPage} active={lastPage === currentPage}>
          <PaginationLink onClick={() => handlePageChange(lastPage)}>
            {lastPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  useEffect(() => {
    if (clearSelected) {
      table.setRowSelection({});
      if (onClearSelected) onClearSelected();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSelected, onClearSelected]);

  useEffect(() => {
    const ids = table.getSelectedRowModel().rows.map((row) => {
      return row.original;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isColumnSelected(ids as any);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getSelectedRowModel()]);

  const handleRemoveParams = () => {
    if (paramsUrl?.removeAllParamsFromUrl) {
      paramsUrl.removeAllParamsFromUrl(router); // Pasar el router aquí
    }
  };

  const message = messageNoRecord ? messageNoRecord : "No records found";
  return (
    <>
      {table.getRowModel().rows.length === 0 ? (
        <>
          <div className="flex flex-col gap-4 items-center justify-between px-4 py-8 mb-4 text-gray-700 bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-300 rounded-lg">
            <span className="bg-gray-300 rounded-full p-2">
              <Search />
            </span>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 animate-bounce" />
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Information
                </h3>
              </div>
            </div>
            <p className="text-sm">{message}</p>
            {paramsUrl?.hasParams && (
              <div className="text-center">
                <Button
                  variant={"destructive"}
                  className="px-8 tracking-wide font-normal"
                  onClick={handleRemoveParams}
                >
                  Clear Filter
                </Button>{" "}
                <p className="text-center">or</p>
                <p className="">Change the parameters in the filter</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="min-w-full">
            <Table className="table-auto divide-y divide-gray-200 dataTable">
              <TableHeader className="bg-[#E1E1E1] hover:text-accent-foreground ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSorted = sortBy === header.id;
                      const sortDirection = isSorted ? sortOrder : undefined;

                      return (
                        <TableHead
                          key={header.id}
                          onClick={() =>
                            header.column.columnDef.enableSorting !== false &&
                            onSortChange(header.id as string)
                          }
                          className={`${
                            header.column.columnDef.enableSorting === false
                              ? ""
                              : "cursor-pointer"
                          } text-nowrap font-semibold text-[#1D2433]`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <span className="pl-2">&uarr;</span>
                            ) : (
                              <span className="pl-2">&darr;</span>
                            )
                          ) : null}{" "}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end mt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="cursor-pointer border border-[#1D2433]/80"
                >
                  Previous
                </PaginationPrevious>

                <PaginationNext
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="cursor-pointer border border-[#1D2433]/80"
                >
                  Next
                </PaginationNext>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center md:justify-end ">
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="cursor-pointer border border-[#1D2433]/80"
                  />
                  {renderPaginationItems()}
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="cursor-pointer border border-[#1D2433]/80"
                  />
                </PaginationContent>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
