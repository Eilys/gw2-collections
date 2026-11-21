const KEY = "gw2-api-key";

export function loadApiKey(): string {
    try {
        return localStorage.getItem(KEY) ?? "";
    } catch {
        return "";
    }
}

export function saveApiKey(key: string) {
    try {
        localStorage.setItem(KEY, key);
    } catch {
        /* stockage indisponible : on ignore */
    }
}

export function clearApiKey() {
    try {
        localStorage.removeItem(KEY);
    } catch {
        /* idem */
    }
}