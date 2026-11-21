import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import OwnershipBadge from "../components/OwnershipBadge";
import { formatGold } from "../logic/format";
import type { CollectionSummary, Ownership } from "../types";

const ownershipOrder: Record<Ownership, number> = { none: 0, partial: 1, all: 2 };

interface Props {
    collections: CollectionSummary[];
    hasKey: boolean;
}

export default function CollectionsPage({ collections, hasKey }: Props) {
    const columns = useMemo<ColumnDef<CollectionSummary>[]>(
        () => [
            {
                id: "label",
                header: "Collection",
                accessorFn: (c) => c.label,
                sortingFn: (a, b) => a.original.label.localeCompare(b.original.label, "fr"),
                cell: ({ row }) => (
                    <Link
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                        to={`/collections/${encodeURIComponent(row.original.name)}`}
                    >
                        {row.original.label}
                    </Link>
                ),
            },
            {
                id: "achat",
                header: "Achat",
                accessorFn: (c) => c.achat,
                cell: (info) => <span className="tabular-nums">{formatGold(info.getValue<number>())}</span>,
            },
            {
                id: "demande",
                header: "Demande",
                accessorFn: (c) => c.demande,
                cell: (info) => <span className="tabular-nums">{formatGold(info.getValue<number>())}</span>,
            },
            {
                id: "ownership",
                header: "Possédé",
                accessorFn: (c) => c.ownership,
                enableSorting: hasKey,
                sortingFn: (a, b) => ownershipOrder[a.original.ownership] - ownershipOrder[b.original.ownership],
                cell: ({ row }) => (hasKey ? <OwnershipBadge ownership={row.original.ownership} /> : "—"),
            },
            {
                id: "count",
                header: "Items",
                accessorFn: (c) => c.rows.length,
            },
        ],
        [hasKey],
    );

    return (
        <DataTable
            data={collections}
            columns={columns}
            initialSorting={[{ id: "achat", desc: false }]}
            getRowId={(c) => c.name}
        />
    );
}