import { useQuery } from "@tanstack/react-query";
import { collectionNames } from "../data/collectionNames";
import { loadCatalog } from "./catalog";
import { createApi } from "./gw2";
import { fetchPrices } from "./prices";
import { fetchUnlockedSkins } from "./skins";

const api = createApi();
const FIVE_MINUTES = 5 * 60 * 1000;
const API_URL = "https://api.guildwars2.com/v2";
export const BOX_ID = 95482;
export const GEM_RATE_COINS = 1_000_000; // 100 po, en pièces de cuivre

export function useCatalogItems() {
    return useQuery({
        queryKey: ["catalog"],
        queryFn: async () => {
            const catalog = await loadCatalog();
            return catalog.items.filter((i) => collectionNames.some((n) => i.nameEn.includes(n)));
        },
        staleTime: Infinity,
    });
}

export function usePrices(ids: number[]) {
    return useQuery({
        queryKey: ["prices", ids.length],
        queryFn: () => fetchPrices(api, ids),
        enabled: ids.length > 0,
        staleTime: FIVE_MINUTES,
        refetchInterval: FIVE_MINUTES,
    });
}

export function useUnlockedSkins(apiKey: string) {
    return useQuery({
        queryKey: ["unlocked-skins", apiKey],
        queryFn: () => fetchUnlockedSkins(apiKey),
        enabled: apiKey !== "",
        staleTime: FIVE_MINUTES,
        retry: false,
    });
}

async function getJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json() as Promise<T>;
}

export function useGemRate() {
    return useQuery({
        queryKey: ["gem-rate"],
        queryFn: () =>
            getJson<{ coins_per_gem: number; quantity: number }>(
                `${API_URL}/commerce/exchange/coins?quantity=${GEM_RATE_COINS}`,
            ),
        staleTime: FIVE_MINUTES,
        refetchInterval: FIVE_MINUTES,
    });
}

export function useBoxItem() {
    return useQuery({
        queryKey: ["box-item", BOX_ID],
        queryFn: () => getJson<{ id: number; name: string; icon?: string }>(`${API_URL}/items/${BOX_ID}?lang=fr`),
        staleTime: Infinity,
    });
}

export function useBoxPrice() {
    return useQuery({
        queryKey: ["box-price", BOX_ID],
        queryFn: () => fetchPrices(api, [BOX_ID]),
        staleTime: FIVE_MINUTES,
        refetchInterval: FIVE_MINUTES,
    });
}