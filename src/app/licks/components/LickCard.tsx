"use client";

import { useState } from "react";
import { Sampler } from "tone";
import { Lick, notes, KeyType } from "../../../util/library";
import { LickNotation } from "./LickNotation";
import { LickPlayer } from "./LickPlayer";

interface Props {
    lick: Lick;
    piano: Sampler | null;
}

export function LickCard({ lick, piano }: Props) {
    const [currentKey, setCurrentKey] = useState(0);

    const getKeyTypeName = (keyType: KeyType): string => {
        switch (keyType) {
            case KeyType.MAJOR:
                return "Major";
            case KeyType.MINOR:
                return "Minor";
            case KeyType.HARMONIC_MINOR:
                return "Harmonic Minor";
            case KeyType.MELODIC_MINOR:
                return "Melodic Minor";
            case KeyType.PHRYGIAN:
                return "Phrygian";
        }
    };

    return (
        <div className="m-auto my-4 w-4/5 border p-3">
            <div className="mb-2">
                <h3 className="text-2xl">{lick.name}</h3>
                <p className="text-xl">{lick.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {lick.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-1 bg-blue-300 text-white"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mb-3 text-xl">
                <span>Works over:</span>{" "}
                {lick.context.overChords
                    .map((deg) => {
                        const numerals = [
                            "",
                            "I",
                            "ii",
                            "iii",
                            "IV",
                            "V",
                            "vi",
                            "vii°",
                        ];
                        return numerals[deg];
                    })
                    .join("-")}{" "}
                ({getKeyTypeName(lick.context.inKey)})
            </div>

            <LickNotation lick={lick} musicKey={currentKey} />

            <div className="mt-3 flex items-center gap-2">
                <label className="text-xl">Key:</label>
                <select
                    value={currentKey}
                    onChange={(e) => setCurrentKey(parseInt(e.target.value))}
                    className="border p-2 text-black"
                >
                    {notes.map((note, index) => (
                        <option key={index} value={index}>
                            {note}
                        </option>
                    ))}
                </select>
            </div>

            <LickPlayer lick={lick} piano={piano} musicKey={currentKey} />
        </div>
    );
}
