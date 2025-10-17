"use client";

import { useState } from "react";
import { Sampler } from "tone";
import {
    Lick,
    playLick,
    stopAllPlayback,
    getLickDuration,
} from "../../../util/library";

interface Props {
    lick: Lick;
    piano: Sampler | null;
    musicKey: number;
}

export function LickPlayer({ lick, piano, musicKey }: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [playChords, setPlayChords] = useState(true);
    const [octave, setOctave] = useState(4);

    const handlePlay = () => {
        if (!piano) return;

        stopAllPlayback(piano);

        setIsPlaying(true);
        playLick(piano, lick, musicKey, octave, playChords, speed);

        const duration = getLickDuration(lick);
        setTimeout(() => setIsPlaying(false), (duration / speed) * 1000);
    };

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex gap-2 items-center">
                <button
                    onClick={handlePlay}
                    disabled={isPlaying || !piano}
                    className="px-4 py-2 bg-blue-300 text-white text-xl disabled:bg-gray-300"
                >
                    {isPlaying ? "Playing..." : "Play"}
                </button>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={playChords}
                        onChange={(e) => setPlayChords(e.target.checked)}
                    />
                    <span>Play Chords</span>
                </label>
            </div>

            <div className="flex gap-4">
                <div className="flex items-center">
                    <p className="px-2 text-xl">Speed:</p>
                    <input
                        type="range"
                        min="0.25"
                        max="2"
                        step="0.25"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-32"
                    />
                    <span className="px-2 text-xl">{speed}x</span>
                </div>

                <div className="flex items-center">
                    <p className="px-2 text-xl">Octave:</p>
                    <input
                        type="range"
                        min="2"
                        max="6"
                        step="1"
                        value={octave}
                        onChange={(e) => setOctave(parseInt(e.target.value))}
                        className="w-32"
                    />
                    <span className="px-2 text-xl">{octave}</span>
                </div>
            </div>
        </div>
    );
}
