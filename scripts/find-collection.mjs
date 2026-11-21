import { readFile } from "node:fs/promises";
import { collectionNames } from "../src/data/collectionNames.ts";

const query = process.argv.slice(2).join(" ").trim();
if (!query) {
    console.log('Usage : node scripts/find-collection.mjs "Nom de la collection"');
    process.exit(1);
}

const catalog = JSON.parse(await readFile("public/catalog.json", "utf8"));
const matches = catalog.items.filter((i) => i.nameEn.includes(query));

console.log(`${matches.length} item(s) contiennent "${query}"`);
for (const i of matches.slice(0, 8)) console.log(`  ${i.nameEn}  |  ${i.nameFr}`);

if (collectionNames.includes(query)) console.log("Ce nom est déjà dans la liste.");

const contains = collectionNames.filter((n) => n !== query && query.includes(n));
const containedIn = collectionNames.filter((n) => n !== query && n.includes(query));
if (contains.length) {
    console.log(`Attention : "${query}" contient déjà ${contains.join(", ")}.`);
    console.log(`  → ajoute "${query}" aux exclusions de : ${contains.join(", ")}`);
}
if (containedIn.length) {
    console.log(`Attention : "${query}" est contenu dans ${containedIn.join(", ")}.`);
    console.log(`  → ajoute ${containedIn.join(", ")} aux exclusions de "${query}"`);
}