import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatGold } from "../logic/format";
import { ownershipLabel } from "../logic/labels";
import { sortCollections } from "../logic/sort";
import type { SortDirection, SortKey } from "../logic/sort";
import type { CollectionSummary } from "../types";

interface Props {
    collections: CollectionSummary[];
    hasKey: boolean;
}

export default function CollectionsPage({ collections, hasKey }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>("achat");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const sorted = useMemo(
        () => sortCollections(collections, sortKey, sortDirection),
        [collections, sortKey, sortDirection],
    );

    function toggleSort(key: SortKey) {
        if (key === sortKey) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    function indicator(key: SortKey) {
        return key === sortKey ? (sortDirection === "asc" ? " ▲" : " ▼") : "";
    }

    return (
        <table>
            <thead>
                <tr>
                    <th><button onClick={() => toggleSort("name")}>Collection{indicator("name")}</button></th>
                    <th><button onClick={() => toggleSort("achat")}>Achat{indicator("achat")}</button></th>
                    <th><button onClick={() => toggleSort("demande")}>Demande{indicator("demande")}</button></th>
                    <th><button onClick={() => toggleSort("ownership")}>Possédé{indicator("ownership")}</button></th>
                    <th><button onClick={() => toggleSort("count")}>Items{indicator("count")}</button></th>
                </tr>
            </thead>
            <tbody>
                {sorted.map((c) => (
                    <tr key={c.name}>
                        <td><Link to={`/collections/${encodeURIComponent(c.name)}`}>{c.name}</Link></td>
                        <td>{formatGold(c.achat)}</td>
                        <td>{formatGold(c.demande)}</td>
                        <td>{hasKey ? ownershipLabel[c.ownership] : "—"}</td>
                        <td>{c.rows.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}