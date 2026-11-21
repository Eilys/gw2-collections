import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { clearApiKey, loadApiKey, saveApiKey } from "./api/apiKey";
import { loadCatalog } from "./api/catalog";
import { createApi } from "./api/gw2";
import { fetchPrices } from "./api/prices";
import { fetchUnlockedSkins } from "./api/skins";
import { collectionNames } from "./data/collectionNames";
import { buildCollections } from "./logic/collections";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import CollectionsPage from "./pages/CollectionsPage";
import type { CatalogItem, Price } from "./types";

const api = createApi();

export default function App() {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [prices, setPrices] = useState<Map<number, Price>>(new Map());
    const [apiKey, setApiKey] = useState(loadApiKey());
    const [keyInput, setKeyInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [skinsResult, setSkinsResult] = useState<{
        key: string;
        skins: Set<number>;
        error: string | null;
    } | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const catalog = await loadCatalog();
                const relevant = catalog.items.filter((i) =>
                    collectionNames.some((n) => i.nameEn.includes(n)),
                );
                setItems(relevant);
                setPrices(await fetchPrices(api, relevant.map((i) => i.id)));
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!apiKey) return;
        let cancelled = false;

        fetchUnlockedSkins(apiKey)
            .then((skins) => {
                if (!cancelled) setSkinsResult({ key: apiKey, skins, error: null });
            })
            .catch((e) => {
                if (!cancelled) {
                    setSkinsResult({
                        key: apiKey,
                        skins: new Set(),
                        error: e instanceof Error ? e.message : String(e),
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [apiKey]);

    const current = skinsResult?.key === apiKey ? skinsResult : null;
    const unlocked = useMemo(() => current?.skins ?? new Set<number>(), [current]);
    const keyError = current?.error ?? null;

    const collections = useMemo(
        () => buildCollections(collectionNames, items, prices, unlocked),
        [items, prices, unlocked],
    );

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

    if (loading) return <p>Chargement…</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <>
            <section>
                {apiKey ? (
                    <p>
                        Clé API enregistrée dans ce navigateur.{" "}
                        <button onClick={removeKey}>Supprimer</button>
                    </p>
                ) : (
                    <p>
                        <input
                            type="password"
                            placeholder="Clé API (permissions account et unlocks)"
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            style={{ width: "28rem" }}
                        />{" "}
                        <button onClick={submitKey}>Enregistrer</button>
                    </p>
                )}
                {keyError && <p>Erreur avec la clé : {keyError}</p>}
            </section>

            <Routes>
                <Route path="/" element={<CollectionsPage collections={collections} hasKey={!!apiKey} />} />
                <Route
                    path="/collections/:name"
                    element={<CollectionDetailPage collections={collections} hasKey={!!apiKey} />}
                />
            </Routes>
        </>
    );
}