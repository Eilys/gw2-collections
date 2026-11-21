import type { Ownership } from "../types";

export const ownershipLabel: Record<Ownership, string> = {
    all: "Oui",
    partial: "Partiellement",
    none: "Non",
};

export const ownershipStyle: Record<Ownership, string> = {
    all: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    none: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};