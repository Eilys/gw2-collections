import { useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

interface Props<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    initialSorting?: SortingState;
    getRowId?: (row: TData) => string;
}

export default function DataTable<TData>({ data, columns, initialSorting = [], getRowId }: Props<TData>) {
    const [sorting, setSorting] = useState<SortingState>(initialSorting);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowId,
        sortDescFirst: false, // premier clic : croissant, comme dans ton appli C#
        enableSortingRemoval: false, // on alterne croissant/décroissant, sans état « non trié »
    });

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            {headerGroup.headers.map((header) => {
                                const sorted = header.column.getIsSorted();
                                const content = flexRender(header.column.columnDef.header, header.getContext());
                                return (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3"
                                        aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
                                    >
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <button
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="cursor-pointer font-medium hover:text-gray-900 dark:hover:text-white"
                                            >
                                                {content}
                                                {sorted === "asc" ? " ▲" : sorted === "desc" ? " ▼" : ""}
                                            </button>
                                        ) : (
                                            content
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3 text-sm whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}