"use client";

import { LickFilter, KeyType } from "../../../util/library";

interface Props {
    filter: LickFilter;
    onFilterChange: (filter: LickFilter) => void;
    availableTags: string[];
}

export function LickFilterComponent({
    filter,
    onFilterChange,
    availableTags,
}: Props) {
    const handleTagToggle = (tag: string) => {
        const currentTags = filter.tags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter((t) => t !== tag)
            : [...currentTags, tag];
        onFilterChange({ ...filter, tags: newTags });
    };

    const handleSearchChange = (searchTerm: string) => {
        onFilterChange({ ...filter, searchTerm });
    };

    const handleKeyChange = (inKey: KeyType | undefined) => {
        onFilterChange({ ...filter, inKey });
    };

    const clearFilters = () => {
        onFilterChange({});
    };

    const hasActiveFilters =
        (filter.tags && filter.tags.length > 0) ||
        filter.searchTerm ||
        filter.inKey !== undefined;

    return (
        <div className="m-auto flex w-full flex-col p-3">
            <div className="m-auto flex w-4/5 justify-between">
                <p className="text-xl">Filters</p>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-blue-300 hover:text-blue-400"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="m-auto w-4/5 p-3">
                <p className="px-2 text-xl">Search:</p>
                <input
                    type="text"
                    value={filter.searchTerm || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search licks..."
                    className="w-full border p-2 text-black"
                />
            </div>

            <div className="m-auto w-4/5 p-3">
                <p className="px-2 text-xl">Key:</p>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleKeyChange(undefined)}
                        className={`p-2 text-white ${
                            filter.inKey === undefined
                                ? "bg-blue-400"
                                : "bg-blue-300"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleKeyChange(KeyType.MAJOR)}
                        className={`p-2 text-white ${
                            filter.inKey === KeyType.MAJOR
                                ? "bg-blue-400"
                                : "bg-blue-300"
                        }`}
                    >
                        Major
                    </button>
                    <button
                        onClick={() => handleKeyChange(KeyType.MINOR)}
                        className={`p-2 text-white ${
                            filter.inKey === KeyType.MINOR
                                ? "bg-blue-400"
                                : "bg-blue-300"
                        }`}
                    >
                        Minor
                    </button>
                    <button
                        onClick={() => handleKeyChange(KeyType.HARMONIC_MINOR)}
                        className={`p-2 text-white ${
                            filter.inKey === KeyType.HARMONIC_MINOR
                                ? "bg-blue-400"
                                : "bg-blue-300"
                        }`}
                    >
                        Harmonic Minor
                    </button>
                    <button
                        onClick={() => handleKeyChange(KeyType.MELODIC_MINOR)}
                        className={`p-2 text-white ${
                            filter.inKey === KeyType.MELODIC_MINOR
                                ? "bg-blue-400"
                                : "bg-blue-300"
                        }`}
                    >
                        Melodic Minor
                    </button>
                    <button
                        onClick={() => handleKeyChange(KeyType.PHRYGIAN)}
                        className={`p-2 text-white ${
                            filter.inKey === KeyType.PHRYGIAN
                                ? "bg-blue-400"
                                : "bg-blue-300"
                        }`}
                    >
                        Phrygian
                    </button>
                </div>
            </div>

            <div className="m-auto w-4/5 p-3">
                <p className="px-2 text-xl">Tags:</p>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`p-2 text-white ${
                                filter.tags?.includes(tag)
                                    ? "bg-blue-400"
                                    : "bg-blue-300"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
