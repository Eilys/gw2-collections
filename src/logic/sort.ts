import type { CollectionSummary } from "../types";

export type SortKey = "name" | "achat" | "demande" | "ownership" | "count";
export type SortDirection = "asc" | "desc";

const ownershipOrder = { none: 0, partial: 1, all: 2 } as const;

function compare(a: CollectionSummary, b: CollectionSummary, key: SortKey): number {
    switch (key) {
        case "name":
            return a.name.localeCompare(b.name);
        case "achat":
            return a.achat - b.achat;
        case "demande":
            return a.demande - b.demande;
        case "ownership":
            return ownershipOrder[a.ownership] - ownershipOrder[b.ownership];
        case "count":
            return a.rows.length - b.rows.length;
    }
}

export function sortCollections(
    list: CollectionSummary[],
    key: SortKey,
    direction: SortDirection,
): CollectionSummary[] {
    const sign = direction === "asc" ? 1 : -1;
    return [...list].sort((a, b) => sign * compare(a, b, key));
}