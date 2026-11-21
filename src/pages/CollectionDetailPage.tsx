import { Link, useParams } from "react-router-dom";
import { formatGold } from "../logic/format";
import type { CollectionSummary } from "../types";

interface Props {
    collections: CollectionSummary[];
    hasKey: boolean;
}

export default function CollectionDetailPage({ collections, hasKey }: Props) {
    const { name } = useParams();
    const collection = collections.find((c) => c.name === name);

    if (!collection) {
        return (
            <>
                <p>Collection introuvable.</p>
                <Link to="/">← Retour</Link>
            </>
        );
    }

    const rows = [...collection.rows].sort((a, b) => a.achat - b.achat);

    return (
        <>
            <p><Link to="/">← Retour</Link></p>
            <h2>{collection.name}</h2>
            <p>
                Total : achat {formatGold(collection.achat)} · demande {formatGold(collection.demande)}
            </p>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Nom</th>
                        <th>Achat</th>
                        <th>Demande</th>
                        <th>Possédé</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.item.id}>
                            <td>
                                {r.item.icon && (
                                    <img src={r.item.icon} alt="" width={32} height={32} loading="lazy" />
                                )}
                            </td>
                            <td>{r.item.nameFr}</td>
                            <td>{r.achat ? formatGold(r.achat) : "—"}</td>
                            <td>{r.demande ? formatGold(r.demande) : "—"}</td>
                            <td>{hasKey ? (r.owned ? "Oui" : "Non") : "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}