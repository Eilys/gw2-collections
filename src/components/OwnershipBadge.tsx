import { ownershipLabel, ownershipStyle } from "../logic/labels";
import type { Ownership } from "../types";

export default function OwnershipBadge({ ownership }: { ownership: Ownership }) {
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ownershipStyle[ownership]}`}>
            {ownershipLabel[ownership]}
        </span>
    );
}