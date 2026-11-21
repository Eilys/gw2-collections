import { useQuery } from "@tanstack/react-query";
import { collectionNames } from "../data/collectionNames";
import { loadCatalog } from "./catalog";
import { createApi } from "./gw2";
import { fetchPrices } from "./prices";
import { fetchUnlockedSkins } from "./skins";

const api = createApi();
const FIVE_MINUTES = 5 * 60 * 1000;

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