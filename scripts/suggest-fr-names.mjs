import { readFile, writeFile } from "node:fs/promises";
import { collectionNames } from "./names.mjs";

const catalog = JSON.parse(await readFile("public/catalog.json", "utf8"));
const stop = new Set(["de", "du", "des", "la", "le", "les", "et", "apparence", "pour", "en", "au", "aux", "à"]);

function grams(name) {
    const tokens = name.split(/\s+/);
    const found = new Map();
    for (let n = 1; n <= 4; n++) {
        for (let i = 0; i + n <= tokens.length; i++) {
            const part = tokens.slice(i, i + n);
            if (stop.has(part[0].toLowerCase()) || stop.has(part[n - 1].toLowerCase())) continue;
            found.set(part.join(" ").toLowerCase(), { text: part.join(" "), size: n });
        }
    }
    return found;
}

// Retire "de", "du", "des", "à" et "d'" en début ou fin, puis met la première lettre en majuscule
function clean(text) {
    let t = text.trim();
    let previous;
    do {
        previous = t;
        t = t
            .replace(/^(de|du|des|à)\s+/i, "")
            .replace(/^d['’]/i, "")
            .replace(/\s+(de|du|des|à)$/i, "");
    } while (t !== previous);
    return t.charAt(0).toUpperCase() + t.slice(1);
}

const lines = [];
for (const name of collectionNames) {
    // Exclut les items d'un nom de collection plus long (ex. Shadow / Shadow Chevalier)
    const longer = collectionNames.filter((o) => o !== name && o.includes(name));
    const members = catalog.items.filter(
        (i) => i.nameEn.includes(name) && !longer.some((o) => i.nameEn.includes(o)),
    );
    if (members.length === 0) continue;

    const counts = new Map();
    for (const item of members) {
        for (const [key, g] of grams(item.nameFr)) {
            const entry = counts.get(key) ?? { ...g, count: 0 };
            entry.count++;
            counts.set(key, entry);
        }
    }

    const candidates = [...counts.values()]
        .filter((g) => g.count / members.length >= 0.6)
        .sort((a, b) => b.size - a.size || b.count - a.count);

    const best = candidates[0];
    const value = best ? clean(best.text) : "";
    const flag = best && best.count < members.length ? " ⚠ à vérifier" : "";
    const others = candidates
        .slice(1, 3)
        .map((g) => `${g.text} (${g.count}/${members.length})`)
        .join(" | ");

    lines.push(
        `  ${JSON.stringify(name)}: ${JSON.stringify(value)}, // ${best ? `${best.count}/${members.length}` : "aucune suggestion"}${flag}${others ? " | autres : " + others : ""}`,
    );
}

const content = `export const collectionNamesFr: Record<string, string> = {\n${lines.join("\n")}\n};\n`;
await writeFile("scripts/fr-names.generated.ts", content, "utf8");
console.log(`${lines.length} collections écrites dans scripts/fr-names.generated.ts`);