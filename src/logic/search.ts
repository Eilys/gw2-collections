export function normalize(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function matchesSearch(query: string, ...fields: string[]): boolean {
    const q = normalize(query);
    if (!q) return true;
    return fields.some((field) => normalize(field).includes(q));
}