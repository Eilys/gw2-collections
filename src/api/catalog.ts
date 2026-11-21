import type { CatalogItem } from "../types";

export async function loadCatalog(): Promise<{ generatedAt: string; items: CatalogItem[] }> {
    const res = await fetch(`${import.meta.env.BASE_URL}catalog.json`);
    if (!res.ok) throw new Error(`Catalogue introuvable (${res.status})`);
    return res.json();
}