import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import OwnershipBadge from "../components/OwnershipBadge";
import { formatGold } from "../logic/format";
import type { CollectionSummary, ItemRow } from "../types";

interface Props {
    collections: CollectionSummary[];
    hasKey: boolean;
}

function priceCell(value: number) {
    return <span className="tabular-nums">{value ? formatGold(value) : "—"}</span>;
}

export default function CollectionDetailPage({ collections, hasKey }: Props) {
    const { name } = useParams();
    const collection = collections.find((c) => c.name === name);

    const columns = useMemo<ColumnDef<ItemRow>[]>(
        () => {

            return [
                {
                    id: "icon",
                    header: "",
                    enableSorting: false,
                    accessorFn: (r) => r.item.icon,
                    cell: ({ row }) =>
                        row.original.item.icon ? (
                            <img src={row.original.item.icon} alt="" loading="lazy" className="size-8 min-w-8 max-w-none rounded object-contain" />
                        ) : null,
                },
                {
                    id: "name",
                    header: "Nom",
                    accessorFn: (r) => r.item.nameFr,
                    sortingFn: (a, b) => a.original.item.nameFr.localeCompare(b.original.item.nameFr, "fr"),
                },
                {
                    id: "achat",
                    header: "Achat",
                    accessorFn: (r) => r.achat,
                    cell: (info) => priceCell(info.getValue<number>()),
                },
                {
                    id: "demande",
                    header: "Demande",
                    accessorFn: (r) => r.demande,
                    cell: (info) => priceCell(info.getValue<number>()),
                },
                {
                    id: "owned",
                    header: "Possédé",
                    accessorFn: (r) => r.owned,
                    enableSorting: hasKey,
                    sortingFn: (a, b) => Number(a.original.owned) - Number(b.original.owned),
                    cell: ({ row }) => (hasKey ? <OwnershipBadge ownership={row.original.owned ? "all" : "none"} /> : "—"),
                },
            ];
        },
        [hasKey]
    );

    if (!collection) {
        return (
            <div className="space-y-2">
                <p>Collection introuvable.</p>
                <Link className="text-blue-600 hover:underline dark:text-blue-400" to="/">
                    ← Retour
                </Link>
            </div>
        );
    }

    const ownedCount = collection.rows.filter((r) => r.owned).length;

    return (
        <div className="space-y-4 flex flex-nowrap flex-col">
            <Link className="text-sm text-blue-600 hover:underline dark:text-blue-400" to="/">
                ← Retour
            </Link>

            <div>
                <h2 className="text-lg font-semibold">{collection.label}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total : achat {formatGold(collection.achat)} · demande {formatGold(collection.demande)}
                    {hasKey && ` · ${ownedCount}/${collection.rows.length} possédés`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {collection.tickets} tickets · {formatGold(collection.ticketAchat)} par ticket à l'achat ·{" "}
                    {formatGold(collection.ticketDemande)} à la demande
                </p>
            </div>

            <DataTable
                data={collection.rows}
                columns={columns}
                initialSorting={[{ id: "achat", desc: false }]}
                getRowId={(r) => String(r.item.id)}
            />
        </div>
    );
}