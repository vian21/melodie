"use client";

import { LickIndexEntry } from "../../../types/lickTypes";
import { LickCard } from "./LickCard";

interface Props {
    licks: LickIndexEntry[];
}

export function LickList({ licks }: Props) {
    if (licks.length === 0) {
        return (
            <div className="m-auto text-xl py-12">
                No licks found. Try adjusting your filters.
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {licks.map((lick) => (
                <LickCard key={lick.id} lick={lick} />
            ))}
        </div>
    );
}
