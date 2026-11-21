import { createApi } from "./gw2";

export async function fetchUnlockedSkins(token: string): Promise<Set<number>> {
    const api = createApi(token);
    const ids = (await api.account.getSkins()) as number[];
    return new Set(ids);
}