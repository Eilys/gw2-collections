import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { clearApiKey, loadApiKey, saveApiKey } from "./api/apiKey";
import { useCatalogItems, usePrices, useUnlockedSkins } from "./api/queries";
import { collectionNames, collectionNamesFr, exclusions } from "./data/collectionNames";
import { buildCollections } from "./logic/collections";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import CollectionsPage from "./pages/CollectionsPage";
import MarketSummary from "./components/MarketSummary";

const NO_SKINS = new Set<number>();

export default function App() {
    const [apiKey, setApiKey] = useState(loadApiKey());
    const [keyInput, setKeyInput] = useState("");

    const catalog = useCatalogItems();
    const items = catalog.data;
    const priceIds = useMemo(() => items?.map((i) => i.id) ?? [], [items]);
    const prices = usePrices(priceIds);
    const skins = useUnlockedSkins(apiKey);

    const collections = useMemo(() => {
        if (!items || !prices.data) return [];
        return buildCollections(
            collectionNames,
            items,
            prices.data,
            skins.data ?? NO_SKINS,
            exclusions,
            collectionNamesFr,
        );
    }, [items, prices.data, skins.data]);

    function submitKey() {
        const key = keyInput.trim();
        if (!key) return;
        saveApiKey(key);
        setApiKey(key);
        setKeyInput("");
    }

    function removeKey() {
        clearApiKey();
        setApiKey("");
    }

    if (catalog.isPending || prices.isPending) {
        return <p className="p-6 text-gray-500 dark:text-gray-400">Chargement…</p>;
    }

    const loadError = catalog.error ?? (prices.data ? null : prices.error);
    if (loadError) {
        return <p className="p-6 text-red-600 dark:text-red-400">Erreur : {loadError.message}</p>;
    }

    const updatedAt = new Date(prices.dataUpdatedAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
            <header className="flex flex-nowrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-red-600!">Collections GW2</h2>
                <div className="space-y-1">
                    {apiKey ? (
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                                Clé API enregistrée dans ce navigateur.
                            </span>
                            <button
                                onClick={removeKey}
                                className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                Supprimer
                            </button>
                        </div>
                    ) : (
                        <div className="flex w-full items-center gap-2 sm:w-auto">
                            <input
                                type="password"
                                placeholder="Clé API (permissions account et unlocks)"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm sm:w-80 sm:flex-none dark:border-gray-600 dark:bg-gray-900"
                            />
                            <button
                                onClick={submitKey}
                                className="shrink-0 cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Enregistrer
                            </button>
                        </div>
                    )}
                    {skins.isError && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Erreur avec la clé : {skins.error.message}
                        </p>
                    )}
                </div>
            </header>

            <MarketSummary />


            <Routes>
                <Route
                    path="/"
                    element={<CollectionsPage collections={collections} hasKey={!!skins.data} />}
                />
                <Route
                    path="/collections/:name"
                    element={<CollectionDetailPage collections={collections} hasKey={!!skins.data} />}
                />
            </Routes>

            <footer className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prix mis à jour à {updatedAt}
                    {prices.isFetching && " · actualisation…"}
                </p>
            </footer>
        </div>
    );
}