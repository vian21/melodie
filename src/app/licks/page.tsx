"use client";

import { useEffect, useState } from "react";
import usePiano from "~/util/Piano";
import useLickStorage from "../../util/LickStorage";
import { LickFilter as LickFilterType } from "../../util/library";
import { LickList } from "./components/LickList";
import { LickFilterComponent } from "./components/LickFilter";

export default function LicksDB() {
    const storage = useLickStorage();
    const piano = usePiano();
    const [filter, setFilter] = useState<LickFilterType>({});
    const [filteredLicks, setFilteredLicks] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    useEffect(() => {
        if (!storage) return;

        const tags = storage.getAllTags();
        setAvailableTags(tags);

        const licks = storage.filterLicks(filter);
        setFilteredLicks(licks);
    }, [storage, filter]);

    if (!storage) {
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
            />

            <div className="m-auto my-4 text-xl">
                Showing {filteredLicks.length} lick
                {filteredLicks.length !== 1 ? "s" : ""}
            </div>

            <LickList licks={filteredLicks} piano={piano} />
        </div>
    );
}
