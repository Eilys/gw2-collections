export function formatGold(price: number): string {
    const gold = Math.floor(price / 10000);
    const silver = Math.floor((price % 10000) / 100);
    const copper = price % 100;
    const parts: string[] = [];
    if (gold) parts.push(`${gold} po`);
    if (silver) parts.push(`${silver} pa`);
    if (copper) parts.push(`${copper} pc`);
    return parts.join(" ");
}