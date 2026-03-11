"use client";

import { Sampler, now } from "tone";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type GuessStateMap = Partial<Record<ChordQuality, 0 | 1>>;

const REPEAT_PROBABILITY = 0.1;

/**
 * Apply a guess to the previous guess-state map.
 */
function updateGuessState(
    /**
     * Previous guess state map before applying the current guess.
     */
    prev: GuessStateMap,
    guess: ChordQuality,
    correct: boolean
): GuessStateMap {
    return { ...prev, [guess]: correct ? 1 : 0 };
}

function pickQuality(
    pool: ChordQuality[],
    lastQuality: ChordQuality | null
): ChordQuality {
    if (lastQuality == null) {
        return pool[Math.floor(Math.random() * pool.length)]!;
    }

    if (Math.random() < REPEAT_PROBABILITY) {
        return lastQuality;
    }

    let nextQuality = lastQuality;
    while (nextQuality === lastQuality) {
        nextQuality = pool[Math.floor(Math.random() * pool.length)]!;
    }
    return nextQuality;
}

export default function ChordQualityTrainer() {
    const piano = usePiano();

    const [level, setLevel] = useState<ChordQualityLevel>(
        ChordQualityLevel.EASY
    );
    const [octave] = useState(3);

    const [root, setRoot] = useState(() => generateRandomKey());
    const [targetQuality, setTargetQuality] = useState<ChordQuality>(
        ChordQuality.MAJOR
    );
    const [keepSameRoot, setKeepSameRoot] = useState(true);

    const [resolved, setResolved] = useState(false);
    /**
     * Map of guesses to correctness.
     * 1 = correct, 0 = incorrect, missing = not guessed yet.
     */
    const [states, setStates] = useState<GuessStateMap>({});
    const [startTime, setStartTime] = useState(Date.now());

    const pool = useMemo(() => getChordQualitiesForLevel(level), [level]);
    const lastQualityRef = useRef<ChordQuality | null>(null);

    const resetRound = useCallback(
        /**
         * Start a new round with a given root and chord quality.
         */
        (nextRoot: number, quality: ChordQuality) => {
            setRoot(nextRoot);
            setTargetQuality(quality);
            setResolved(false);
            setStates({});
            setStartTime(Date.now());
            lastQualityRef.current = quality;
        },
        []
    );

    const nextChord = useCallback(() => {
        const quality = pickQuality(pool, lastQualityRef.current);
        const nextRoot = keepSameRoot ? root : generateRandomKey();
        resetRound(nextRoot, quality);
    }, [keepSameRoot, pool, resetRound, root]);

    useEffect(() => {
        const quality = pickQuality(pool, lastQualityRef.current);
        resetRound(generateRandomKey(), quality);
    }, [level, pool, resetRound]);

    const onGuess = (guess: ChordQuality) => {
        if (resolved) return;
        if (states[guess] != null) return;

        const correct = guess === targetQuality;
        setStates((prev) => updateGuessState(prev, guess, correct));
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

            <label className="m-auto mt-3 flex w-4/5 items-center gap-3 text-lg">
                <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={keepSameRoot}
                    onChange={(e) => setKeepSameRoot(e.target.checked)}
                />
                Keep same root note
            </label>

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
                    const disabled = resolved || state != null;
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
