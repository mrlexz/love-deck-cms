import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReusableTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  title?: string;
  description?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchColumn?: string;
  showColumnVisibility?: boolean;
  showPagination?: boolean;
  showRowSelection?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  defaultPageSize?: number;
}

export function CustomTable<TData>({
  data,
  columns,
  showSearch = true,
  searchPlaceholder = "Filter emails...",
  searchColumn = "email",
  showColumnVisibility = false,
  showPagination = true,
  showRowSelection = true,
  isLoading = false,
  loadingText = "Loading...",
  defaultPageSize = 50,
}: ReusableTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Generate page options for select
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="w-full p-6 mx-auto">
      <div className="flex items-center py-4">
        {showSearch && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="rounded-md border relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {loadingText}
              </span>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`loading-cell-${colIndex}`}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-normal">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {(showPagination || showRowSelection) && (
        <div className="flex items-center justify-between py-4">
          {showRowSelection && (
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}

          {showPagination && (
            <div className="flex items-center space-x-6">
              {/* Page size selector */}
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page info */}
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>

              {/* Page navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page selector */}
                <Select
                  value={`${currentPage}`}
                  onValueChange={(value) => {
                    table.setPageIndex(Number(value) - 1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top" className="max-h-[200px]">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <SelectItem key={page} value={`${page}`}>
                          {page}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
