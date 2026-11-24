import { useState } from "react";

export function usePersistedState<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? initial : (JSON.parse(raw) as T);
        } catch {
            return initial;
        }
    });

    function update(next: T) {
        setValue(next);
        try {
            localStorage.setItem(key, JSON.stringify(next));
        } catch {
            /* stockage indisponible (navigation privée, par exemple) : on ignore */
        }
    }

    return [value, update] as const;
}