import { BOX_ID, GEM_RATE_COINS, useBoxItem, useBoxPrice, useGemRate } from "../api/queries";
import { formatGold } from "../logic/format";

export default function MarketSummary() {
    const gems = useGemRate();
    const boxItem = useBoxItem();
    const boxPrice = useBoxPrice();
    const price = boxPrice.data?.get(BOX_ID);

    return (
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gemmes pour {formatGold(GEM_RATE_COINS)}
                </p>
                <p className="text-xl font-semibold tabular-nums">
                    {gems.data ? gems.data.quantity.toLocaleString("fr-FR") : gems.isError ? "—" : "…"}
                </p>
            </div>

            <div className="flex justify-center items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                {boxItem.data?.icon && (
                    <img src={boxItem.data.icon} alt="" width={40} height={40} className="rounded" />
                )}
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{boxItem.data?.name ?? "Boîte d'armes"}</p>
                    <p className="text-sm tabular-nums">
                        {price ? (
                            <>
                                Achat <span className="font-semibold">{formatGold(price.sells.unit_price)}</span>
                                {" · "}
                                Demande <span className="font-semibold">{formatGold(price.buys.unit_price)}</span>
                            </>
                        ) : boxPrice.isError ? (
                            "—"
                        ) : (
                            "…"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}