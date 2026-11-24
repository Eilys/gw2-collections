import type { CollectionSummary } from "../types";

export type TicketTone = "green" | "orange" | "yellow" | "red";

export interface BoxPrices {
    achat: number;
    demande: number;
}

export function ticketTone(
    c: Pick<CollectionSummary, "ticketAchat" | "ticketDemande">,
    box: BoxPrices,
): TicketTone {
    const belowAchat = c.ticketAchat < box.achat;
    const belowDemande = c.ticketDemande < box.demande;
    if (belowAchat && belowDemande) return "green";
    if (belowAchat) return "orange";
    if (belowDemande) return "yellow";
    return "red";
}

// Les classes sont écrites en entier : Tailwind ne détecte pas celles qu'on assemble dynamiquement
export const toneClasses: Record<TicketTone, string> = {
    green: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50",
    orange: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50",
    yellow: "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50",
    red: "bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50",
};

export const toneSwatch: Record<TicketTone, string> = {
    green: "bg-emerald-400",
    orange: "bg-orange-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
};

export const toneLegend: { tone: TicketTone; label: string }[] = [
    { tone: "green", label: "Ticket moins cher que la boîte (achat et demande)" },
    { tone: "yellow", label: "Moins cher à la demande seulement" },
    { tone: "orange", label: "Moins cher à l'achat seulement" },
    { tone: "red", label: "Plus cher dans les deux cas" },
];