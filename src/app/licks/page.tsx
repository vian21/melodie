"use client";

import { useEffect, useState } from "react";
import { LickIndexEntry, LickFilter } from "../../types/lickTypes";
import { LickList } from "./components/LickList";
import { LickFilterComponent } from "./components/LickFilter";
import { env } from "~/env.mjs";

export default function LicksDB() {
    const [licks, setLicks] = useState<LickIndexEntry[]>([]);
    const [filter, setFilter] = useState<LickFilter>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const basePath = env.NEXT_PUBLIC_BASEPATH?.trim() || "";
        fetch(`${basePath}/data/licks/index.json`)
            .then((res) => res.json())
            .then((data: LickIndexEntry[]) => {
                setLicks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load lick index:", err);
                setLoading(false);
            });
    }, []);

    const filteredLicks = licks.filter((lick) => {
        if (filter.tags && filter.tags.length > 0) {
            const hasTag = filter.tags.some((tag) => lick.tags.includes(tag));
            if (!hasTag) return false;
        }

        if (filter.key && lick.key !== filter.key) {
            return false;
        }

        if (filter.searchTerm) {
            const term = filter.searchTerm.toLowerCase();
            const inTitle = lick.title.toLowerCase().includes(term);
            const inTags = lick.tags.some((t) =>
                t.toLowerCase().includes(term)
            );
            if (!inTitle && !inTags) return false;
        }

        return true;
    });

    const availableTags = Array.from(
        new Set(licks.flatMap((l) => l.tags))
    ).sort();

    const availableKeys = Array.from(new Set(licks.map((l) => l.key))).sort();

    if (loading) {
        return (
            <div className="flex flex-col">
                <h1 className="m-auto text-3xl">Loading licks...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Licks Database</h1>

            <LickFilterComponent
                filter={filter}
                onFilterChange={setFilter}
                availableTags={availableTags}
                availableKeys={availableKeys}
            />

            <LickList licks={filteredLicks} />
        </div>
    );
}
