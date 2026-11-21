import { mkdir, writeFile } from "node:fs/promises";

const API = "https://api.guildwars2.com/v2";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, retries = 4) {
    for (let i = 0; i <= retries; i++) {
        const res = await fetch(url);
        if (res.ok) return res.json();
        if (res.status === 429 || res.status >= 500) {
            await sleep(2000 * (i + 1));
            continue;
        }
        throw new Error(`${res.status} ${url}`);
    }
    throw new Error(`Échec après plusieurs essais : ${url}`);
}

function chunk(array, size) {
    const parts = [];
    for (let i = 0; i < array.length; i += size) parts.push(array.slice(i, i + size));
    return parts;
}

async function fetchItems(ids, lang) {
    const items = [];
    for (const part of chunk(ids, 200)) {
        items.push(...(await getJson(`${API}/items?ids=${part.join(",")}&lang=${lang}`)));
    }
    return items;
}

// 1. Tous les items vendables au Comptoir
const tradableIds = await getJson(`${API}/commerce/prices`);
console.log(`${tradableIds.length} items au Comptoir`);

// 2. Détails en anglais, puis on ne garde que les Transmutation
const itemsEn = await fetchItems(tradableIds, "en");
const transmutations = itemsEn.filter(
    (i) => i.type === "Consumable" && i.details?.type === "Transmutation",
);
console.log(`${transmutations.length} items de type Transmutation`);

if (transmutations.length === 0) {
    throw new Error("Aucune Transmutation trouvée : la structure de l'API a peut-être changé.");
}

// 3. Noms français pour ces items seulement
const itemsFr = await fetchItems(transmutations.map((i) => i.id), "fr");
const frById = new Map(itemsFr.map((i) => [i.id, i.name]));

const catalog = {
    generatedAt: new Date().toISOString(),
    items: transmutations.map((i) => ({
        id: i.id,
        nameEn: i.name,
        nameFr: frById.get(i.id) ?? i.name,
        icon: i.icon ?? "",
        skinIds: i.details.skins ?? [],
    })),
};

await mkdir("public", { recursive: true });
await writeFile("public/catalog.json", JSON.stringify(catalog));
console.log("public/catalog.json écrit");