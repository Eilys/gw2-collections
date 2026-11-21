import { readFile } from "node:fs/promises";
import { collectionNames } from "./names.mjs";

const catalog = JSON.parse(await readFile("public/catalog.json", "utf8"));
console.log("Items :", catalog.items.length);
console.log("Sans skinIds :", catalog.items.filter((i) => i.skinIds.length === 0).length);
console.log("Exemple :", catalog.items[0]);

for (const name of collectionNames) {
    const n = catalog.items.filter((i) => i.nameEn.includes(name)).length;
    if (n === 0) console.log("Aucun item pour :", name);
}