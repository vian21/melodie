"use client";

import { Sampler } from "tone";
import { Lick } from "../../../util/library";
import { LickCard } from "./LickCard";

interface Props {
    licks: Lick[];
    piano: Sampler | null;
}

export function LickList({ licks, piano }: Props) {
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
                <LickCard key={lick.id} lick={lick} piano={piano} />
            ))}
        </div>
    );
}
