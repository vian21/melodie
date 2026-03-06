import { Dexie, type EntityTable } from "dexie";
import { Training } from "./library";

/** A single user attempt at guessing notes/chords/intervals. */
export interface Attempt {
    /** Auto-incremented primary key. */
    id?: number;
    /** Which training mode this attempt belongs to. */
    training: Training;
    /** Unix timestamp (ms) when the attempt was submitted. */
    timestamp: number;
    /** Time in ms the user took to respond. */
    responseTime: number;
    /** Playback speed setting used during the attempt. */
    speed: number;
    /** Octave setting used during the attempt. */
    octave: number;
    /** Number of notes/chords in the exercise. */
    length: number;
    /** The correct scale degrees. */
    degrees: number[];
    /** The user's guesses. TODO: could be used for a confusion matrix */
    guesses: number[];
    /** Per-note correctness: 1 = correct, 0 = incorrect. */
    results: number[];
}

/** Time range options for filtering dashboard stats. */
export enum TimeRange {
    TODAY = "TODAY",
    WEEK = "WEEK",
    LAST_30_DAYS = "LAST_30_DAYS",
    THIS_YEAR = "THIS_YEAR",
    ALL_TIME = "ALL_TIME",
}

const db = new Dexie("MelodieDB") as Dexie & {
    attempts: EntityTable<Attempt, "id">;
};

db.version(1).stores({
    attempts: "++id, training, timestamp, [training+timestamp]",
});

/**
 * Returns the start-of-day timestamp for today in the user's local timezone.
 */
function startOfToday(): number {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

/**
 * Computes the unix timestamp (ms) for the beginning of a given {@link TimeRange}.
 * Returns `0` for {@link TimeRange.ALL_TIME} (i.e. no lower bound).
 */
export function getTimeRangeStart(range: TimeRange): number {
    const now = new Date();

    switch (range) {
        case TimeRange.TODAY:
            return startOfToday();

        case TimeRange.WEEK: {
            const d = new Date(now);
            d.setDate(d.getDate() - d.getDay()); // start of week (Sunday)
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }

        case TimeRange.LAST_30_DAYS: {
            const d = new Date(now);
            d.setDate(d.getDate() - 30);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }

        case TimeRange.THIS_YEAR: {
            const d = new Date(now.getFullYear(), 0, 1);
            return d.getTime();
        }

        case TimeRange.ALL_TIME:
            return 0;
    }
}

/**
 * Fetches all attempts for a given training mode within the specified time range.
 * Results are sorted by timestamp ascending.
 *
 * @param training - The training mode to filter by.
 * @param range - The time range to filter by.
 * @returns Array of matching {@link Attempt} records.
 */
export async function getAttempts(
    training: Training,
    range: TimeRange
): Promise<Attempt[]> {
    const start = getTimeRangeStart(range);

    return db.attempts
        .where("[training+timestamp]")
        .between([training, start], [training, Dexie.maxKey])
        .sortBy("timestamp");
}

/**
 * Groups attempts by calendar date string (YYYY-MM-DD) in local timezone.
 *
 * @param attempts - Array of attempts to group.
 * @returns Map where keys are date strings and values are arrays of attempts for that date.
 */
export function groupByDate(attempts: Attempt[]): Map<string, Attempt[]> {
    const map = new Map<string, Attempt[]>();

    for (const attempt of attempts) {
        const date = new Date(attempt.timestamp);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const existing = map.get(key) ?? [];
        existing.push(attempt);
        map.set(key, existing);
    }

    return map;
}

/**
 * Computes accuracy percentage from an array of attempts.
 *
 * @param attempts - Array of attempts.
 * @returns Accuracy as a percentage (0-100), or `0` if there are no attempts.
 */
export function computeAccuracy(attempts: Attempt[]): number {
    if (attempts.length === 0) return 0;

    let correct = 0;
    let total = 0;

    for (const attempt of attempts) {
        for (const r of attempt.results) {
            correct += r;
            total++;
        }
    }

    return total > 0 ? (correct / total) * 100 : 0;
}

export { db };
