export interface CatalogItem {
    id: number;
    nameEn: string;
    nameFr: string;
    icon: string;
    skinIds: number[];
}

export interface Price {
    id: number;
    buys: { unit_price: number };
    sells: { unit_price: number };
}

export interface ItemRow {
    item: CatalogItem;
    achat: number;     // sells.unit_price (BestAsk)
    demande: number;   // buys.unit_price (BestBid)
    owned: boolean;
}

export interface CollectionSummary {
    name: string;
    label: string;
    rows: ItemRow[];
    achat: number;
    demande: number;
    ownedCount: number;
    tickets: number;
    ticketAchat: number;
    ticketDemande: number;
}