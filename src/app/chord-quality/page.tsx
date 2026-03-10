"use client";

import { Sampler, now } from "tone";

import { useCallback, useEffect, useMemo, useState } from "react";
import usePiano from "~/util/Piano";
import { db } from "~/util/db";

import {
    CHORD_QUALITIES,
    ChordQuality,
    ChordQualityLevel,
    Training,
    generateRandomKey,
    makeChordByQuality,
    verificationColor,
} from "~/util/library";

export default function ChordQualityTrainer() {
    const piano = usePiano();

    const [level, setLevel] = useState<ChordQualityLevel>(
        ChordQualityLevel.EASY
    );
    const [octave] = useState(3);

    const [root, setRoot] = useState(0);
    const [targetQuality, setTargetQuality] = useState<ChordQuality>(
        ChordQuality.MAJOR
    );

    const [resolved, setResolved] = useState(false);
    const [states, setStates] = useState<Partial<Record<ChordQuality, 0 | 1>>>(
        {}
    );
    const [startTime, setStartTime] = useState(Date.now());

    const pool = useMemo(() => getChordQualitiesForLevel(level), [level]);

    const nextChord = useCallback(() => {
        const next = generateRandomChordQuality(level);
        setRoot(next.root);
        setTargetQuality(next.quality);
        setResolved(false);
        setStates({});
        setStartTime(Date.now());
    }, [level]);

    useEffect(() => {
        nextChord();
    }, [level, nextChord]);

    const onGuess = (guess: ChordQuality) => {
        if (resolved) return;

        const correct = guess === targetQuality;
        setStates((prev) => ({ ...prev, [guess]: correct ? 1 : 0 }));
        if (correct) setResolved(true);

        const correctId = getChordQualityIdx(targetQuality);
        const guessId = getChordQualityIdx(guess);

        void db.attempts.add({
            training: Training.CHORD_QUALITY,
            timestamp: Date.now(),
            responseTime: Date.now() - startTime,
            speed: 1,
            octave,
            length: 1,
            degrees: [correctId],
            guesses: [guessId],
            results: [correct ? 1 : 0],
        });
    };

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Chord Quality</h1>

            <div className="m-auto mt-4 flex w-4/5 items-center gap-3">
                <label className="text-xl">Level:</label>
                <select
                    className="flex-1 border border-gray-300 bg-white p-3 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    value={level}
                    onChange={(e) =>
                        setLevel(e.target.value as ChordQualityLevel)
                    }
                >
                    {Object.values(ChordQualityLevel).map((lvl) => (
                        <option key={lvl} value={lvl}>
                            {lvl}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="m-auto my-4 w-4/5 bg-blue-300 p-3 text-xl text-white font-bold"
                onClick={() => {
                    if (piano == null) return;
                    playChord(piano, root, targetQuality, octave);
                }}
            >
                Play
            </button>

            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-xl text-white font-bold"
                onClick={nextChord}
            >
                Next
            </button>

            <div className="m-auto mt-6 grid w-4/5 grid-cols-2 gap-3 sm:grid-cols-3">
                {pool.map((q) => {
                    const state = states[q];
                    const disabled = resolved;
                    return (
                        <button
                            key={q}
                            disabled={disabled}
                            className={`rounded-md border-2 ${verificationColor(
                                state
                            )} bg-white p-4 text-center text-lg text-black transition-opacity disabled:opacity-70 dark:bg-gray-800 dark:text-white`}
                            onClick={() => onGuess(q)}
                        >
                            {q}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function getChordQualitiesForLevel(level: ChordQualityLevel): ChordQuality[] {
    switch (level) {
        case ChordQualityLevel.EASY:
            return [
                ChordQuality.MAJOR,
                ChordQuality.MINOR,
                ChordQuality.SUS2,
                ChordQuality.SUS4,
            ];
        case ChordQualityLevel.INTERMEDIATE:
            return [
                ChordQuality.MAJOR,
                ChordQuality.MINOR,
                ChordQuality.SUS2,
                ChordQuality.SUS4,
                ChordQuality.DIMINISHED,
                ChordQuality.AUGMENTED,
            ];
        case ChordQualityLevel.ADVANCED:
            return [...CHORD_QUALITIES];
    }
}

/**
 * Get index of chord quality in CHORD_QUALITIES array
 */
function getChordQualityIdx(quality: ChordQuality): number {
    return CHORD_QUALITIES.indexOf(quality) + 1;
}

function playChord(
    Piano: Sampler,
    root: number,
    quality: ChordQuality,
    octave: number,
    durationSeconds = 1.75
) {
    const chord = makeChordByQuality(root, octave, quality);
    Piano.triggerAttackRelease(chord, durationSeconds, now());
}

function generateRandomChordQuality(level: ChordQualityLevel): {
    root: number;
    quality: ChordQuality;
} {
    const root = generateRandomKey();
    const pool = getChordQualitiesForLevel(level);
    const quality = pool[Math.floor(Math.random() * pool.length)]!;
    return { root, quality };
}
