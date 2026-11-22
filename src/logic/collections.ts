import type { CatalogItem, CollectionSummary, Price } from "../types";

const DEFAULT_TICKETS = 7;

export function buildCollections(
    names: string[],
    items: CatalogItem[],
    prices: Map<number, Price>,
    unlockedSkins: Set<number>,
    exclusions: Record<string, string[]> = {},
    labels: Record<string, string> = {},
    ticketOverrides: Record<string, number> = {},
): CollectionSummary[] {
    const result: CollectionSummary[] = [];

    for (const name of names) {
        const excluded = exclusions[name] ?? [];
        const members = items.filter(
            (i) => i.nameEn.includes(name) && !excluded.some((e) => i.nameEn.includes(e)),
        );
        if (members.length === 0) continue;

        const rows = members.map((item) => {
            const price = prices.get(item.id);
            return {
                item,
                achat: price?.sells.unit_price ?? 0,
                demande: price?.buys.unit_price ?? 0,
                owned: item.skinIds.some((id) => unlockedSkins.has(id)),
            };
        });

        const ownedCount = rows.filter((r) => r.owned).length;
        const achat = rows.reduce((sum, r) => sum + r.achat, 0);
        const demande = rows.reduce((sum, r) => sum + r.demande, 0);
        const tickets = ticketOverrides[name] ?? DEFAULT_TICKETS;

        result.push({
            name,
            label: labels[name] || name,
            rows,
            achat,
            demande,
            ownership: ownedCount === rows.length ? "all" : ownedCount > 0 ? "partial" : "none",
            ownedCount,
            tickets,
            ticketAchat: Math.round(achat / tickets),
            ticketDemande: Math.round(demande / tickets),
        });
    }
    return result;
}