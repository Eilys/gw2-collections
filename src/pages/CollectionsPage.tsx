import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import OwnershipBadge from "../components/OwnershipBadge";
import { formatGold } from "../logic/format";
import type { CollectionSummary } from "../types";
import SearchInput from "../components/SearchInput";
import { matchesSearch } from "../logic/search";
import { BOX_ID, useBoxPrice } from "../api/queries";
import { ticketTone, toneClasses, toneLegend, toneSwatch } from "../logic/tickets";

interface Props {
    collections: CollectionSummary[];
    hasKey: boolean;
}

export default function CollectionsPage({ collections, hasKey }: Props) {
    const [search, setSearch] = useState("");
    const boxPrice = useBoxPrice().data?.get(BOX_ID);
    const box = boxPrice
    ? { achat: boxPrice.sells.unit_price, demande: boxPrice.buys.unit_price }
    : null;

    const filtered = useMemo(
        () => collections.filter((c) => matchesSearch(search, c.label, c.name)),
        [collections, search],
    );
    const columns = useMemo<ColumnDef<CollectionSummary>[]>(
        () => [
            {
                id: "icon",
                header: "",
                enableSorting: false,
                accessorFn: (c) => c.rows[0]?.item.icon ?? "",
                cell: ({ row }) => {
                    const icon = row.original.rows[0]?.item.icon;
                    return icon ? (
                        <img src={icon} alt="" loading="lazy" className="size-8 min-w-8 max-w-none rounded object-contain" />
                    ) : null;
                },
            },
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
                id: "ticketAchat",
                header: "Ticket (achat)",
                accessorFn: (c) => c.ticketAchat,
                cell: (info) => <span className="tabular-nums">{formatGold(info.getValue<number>())}</span>,
            },
            {
                id: "demande",
                header: "Demande",
                accessorFn: (c) => c.demande,
                cell: (info) => <span className="tabular-nums">{formatGold(info.getValue<number>())}</span>,
            },
            {
                id: "ticketDemande",
                header: "Ticket (demande)",
                accessorFn: (c) => c.ticketDemande,
                cell: (info) => <span className="tabular-nums">{formatGold(info.getValue<number>())}</span>,
            },
            {
                id: "ownership",
                header: "Possédé",
                accessorFn: (c) => (c.rows.length ? c.ownedCount / c.rows.length : 0),
                enableSorting: hasKey,
                cell: ({ row }) =>
                    hasKey ? (
                        <OwnershipBadge ownership={row.original.ownership}>
                            {row.original.ownedCount}/{row.original.rows.length}
                        </OwnershipBadge>
                    ) : (
                        "—"
                    ),
            },
        ],
        [hasKey],
    );

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une collection…" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filtered.length} / {collections.length} collections
                </p>
            </div>

            <DataTable
                data={filtered}
                columns={columns}
                initialSorting={[{ id: "achat", desc: false }]}
                getRowId={(c) => c.name}
                getRowClassName={(c) =>
                    box ? toneClasses[ticketTone(c, box)] : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
            />

            {box && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {toneLegend.map(({ tone, label }) => (
                        <li key={tone} className="flex items-center gap-1.5">
                            <span className={`size-2.5 rounded-full ${toneSwatch[tone]}`} />
                            {label}
                        </li>
                    ))}
                </ul>
            )}

            {filtered.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucune collection ne correspond à « {search} ».
                </p>
            )}
        </div>
    );
}