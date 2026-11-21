import type { Price } from "../types";
import type { createApi } from "./gw2";

type Api = ReturnType<typeof createApi>;

export async function fetchPrices(api: Api, ids: number[]): Promise<Map<number, Price>> {
    const prices = new Map<number, Price>();
    for (let i = 0; i < ids.length; i += 200) {
        const part = ids.slice(i, i + 200);
        const result = (await api.commerce.getPrices(part)) as Price[];
        for (const p of result) prices.set(p.id, p);
    }
    return prices;
}