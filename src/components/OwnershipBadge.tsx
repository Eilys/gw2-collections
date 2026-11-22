import type { ReactNode } from "react";
import { ownershipLabel, ownershipStyle } from "../logic/labels";
import type { Ownership } from "../types";

interface Props {
    ownership: Ownership;
    children?: ReactNode;
}

export default function OwnershipBadge({ ownership, children }: Props) {
    return (
        <span
            title={ownershipLabel[ownership]}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ownershipStyle[ownership]}`}
        >
            {children ?? ownershipLabel[ownership]}
        </span>
    );
}