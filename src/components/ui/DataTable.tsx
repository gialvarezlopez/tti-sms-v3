import React, { useEffect } from "react";
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

import { AlertCircle } from "lucide-react";

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
  sortOrder: "asc" | "desc";
  onSortChange: (field: keyof T) => void;
  isColumnSelected: IsColumnSelectedFn<T>;
  clearSelected?: boolean;
  onClearSelected?: () => void;
  messageNoRecord?: string;
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
}: DataTableProps<T>) => {
  // Memorize sorted data
  //const { data: session } = useSession();
  const sortedData = React.useMemo(() => {
    if (!sortBy) return data; // Si no hay columna para ordenar, retorna los datos originales

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
    fetchData(newPageIndex + 1, pagination.pageSize, search); // Fetch data on page change
  };

  const renderPaginationItems = () => {
    const items = [];
    const currentPage = pagination.pageIndex;
    const totalPage = totalPages;
    const maxVisiblePages = 5;

    if (totalPage <= maxVisiblePages) {
      for (let i = 0; i < totalPage; i++) {
        items.push(
          <PaginationItem key={i} active={i === currentPage}>
            <PaginationLink onClick={() => handlePageChange(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const firstPage = 0;
      const lastPage = totalPage - 1;
      const pagesToShow = new Set<number>();

      // Always show the first page
      pagesToShow.add(firstPage);

      // Show pages before current page (if any)
      if (currentPage > 3) {
        pagesToShow.add(firstPage + 1);
        pagesToShow.add(-1); // Ellipsis
      }

      // Show pages around current page
      for (
        let i = Math.max(firstPage + 1, currentPage - 2);
        i <= Math.min(lastPage - 1, currentPage + 2);
        i++
      ) {
        pagesToShow.add(i);
      }

      // Show pages after current page (if any)
      if (currentPage < totalPage - 4) {
        pagesToShow.add(-2); // Ellipsis
        pagesToShow.add(lastPage - 1);
      }

      // Always show the last page
      pagesToShow.add(lastPage);

      // Render pagination items
      let lastItem: number | "ellipsis" | null = null;
      pagesToShow.forEach((page) => {
        if (page === -1 || page === -2) {
          if (lastItem !== "ellipsis") {
            items.push(
              <PaginationItem key={`ellipsis-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
            lastItem = "ellipsis";
          }
        } else {
          items.push(
            <PaginationItem key={page} active={page === currentPage}>
              <PaginationLink onClick={() => handlePageChange(page)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          );
          lastItem = page;
        }
      });
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

  const message = messageNoRecord ? messageNoRecord : "No records found";
  return (
    <>
      {table.getRowModel().rows.length === 0 ? (
        <>
          <div className="flex items-center justify-between p-4 mb-4 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 border border-gray-300 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 animate-bounce" />
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Information
                </h3>
                <p className="text-sm">{message}</p>
              </div>
            </div>
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
                          ) : null}
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
                  className="cursor-pointer border-[#1D2433]/80"
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
