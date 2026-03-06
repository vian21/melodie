import Logger from "./Logger";

import { Sampler, now, Transport, Part } from "tone";
import { db } from "./db";

// currently running sequence / notes. Theses can be stopped and started together
let __currentParts: { notes?: Part; chords?: Part } = {};

export const notes = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
];

export enum Training {
    CHORD_PROGRESSION = "CHORD_PROGRESSION",
    MELODY = "MELODY",
    INTERVAL = "INTERVAL",
}

/** Lead-in time in seconds before melody notes start over the drone. */
const DRONE_LEAD_IN = 2;

export interface ATTEMPT_STATS {
    responseTime: number;
    speed: number;
    octave: number;
}

export const popularProgressions = [
    [1, 2, 3, 4],
    [1, 2, 6, 4],
    [1, 2, 6, 5],
    [1, 3, 4, 5],
    [1, 4, 6, 5],
    [1, 4, 2, 5],
    [1, 5, 6, 4],
    [1, 6, 4, 5],
    [1, 6, 5, 4],

    [2, 4, 1, 5],
    [2, 4, 6, 5],
    [2, 3, 4, 5],
    [2, 6, 4, 5],
    [2, 6, 1, 5],

    [3, 4, 1, 5],
    [3, 4, 5, 1],
    [3, 4, 6, 5],

    [4, 1, 5, 6],
    [4, 1, 6, 5],
    [4, 3, 2, 1],
    [4, 3, 2, 5],
    [4, 3, 5, 1],
    [4, 5, 1, 6],
    [4, 5, 3, 6],
    [4, 5, 6, 1],
    [4, 6, 1, 5],
    [4, 6, 5, 1],

    [5, 4, 1, 6],
    [5, 6, 4, 1],
    [5, 6, 1, 4],

    [6, 4, 1, 5],
    [6, 4, 1, 7],
    [6, 4, 5, 1],
    [6, 5, 4, 1],
    [6, 5, 1, 4],
    [6, 5, 3, 4],
    [6, 7, 1, 4],
    [6, 7, 3, 4],

    [7, 1, 4, 4],
];

/**
 *
 * @returns index of a tonal key (0-11)
 */
export function generateRandomKey(): number {
    return Math.floor(Math.random() * 12);
}

/**
 * @param key index of a tonal key (0-11)
 * @param melody array of degrees of notes(0-6)
 *
 * @returns array of indexes of notes(0-11) in the melody provided
 */
export function getNotes(key: number, melody: number[]): number[] {
    const notes: number[] = [];

    const scale = getMajorScale(key);

    melody.map((note) => {
        notes.push(scale[note] ?? 0);
    });

    return notes;
}

/**
 * @returns array of degrees of notes 1-7
 */
export function generateRandomMelody(length: number): number[] {
    const melody = [];

    for (let i = 0; i < length; i++) {
        const min = 1;
        const max = 7;
        const note = Math.floor(Math.random() * (max - min + 1) + min); //min and max inclusive

        melody.push(note);
    }

    return melody;
}

/**
 * generate random length-1 intervals starting with the root
 */
export function generateRandomIntervals(length: number): number[] {
    const intervals = [];

    const min = 1;
    const max = 7;

    for (let i = 0; i < length; i++) {
        intervals.push(1); //insert tonic

        intervals.push(Math.floor(Math.random() * (max - min + 1) + min)); //min and max inclusive
    }

    return intervals;
}
/**
 *
 * @param length length of the progression. Default: 4
 * @returns degreess of chords in the progression
 */

export function generateRandomProgression(length = 4): number[] {
    const prog = popularProgressions[
        Math.floor(Math.random() * popularProgressions.length)
    ]?.slice(0, length);

    return prog ? prog : [];
}

/**
 *
 * @param key index of a tonal key (0-11)
 *
 * w-w-h-w-w-w-h(8) -> +0 +2 +2 +1 +2 +2 +2 -> 0, 2, 4, 5, 7, 9, 11, 12
 * @returns array of indexes of notes in scale
 */
export function getMajorScale(key: number) {
    const scale: number[] = [];
    let i = 0;

    //12: number of half-steps in an octave
    while (i < 12) {
        scale.push((key + i) % 12);

        if (i == 4) {
            i++;
            continue;
        }

        i += 2;
    }

    return scale;
}

/**
 *
 * @param key index of a tonal key (0-11)
 *
 * 0, W, H, W, W, H, W, W(8) -> +0 +2 +1 +2 +2 +1 +2 +2 -> 0, 2, 3, 5, 7, 8, 10, 12
 * @returns array of indexes of notes in scale
 */
export function getMinorScale(key: number) {
    const scale: number[] = [];
    let i = 0;

    //12: number of half-steps in an octave
    while (i < 12) {
        scale.push((key + i) % 12);

        if (i == 2 || i == 7) {
            i++;
            continue;
        }

        i += 2;
    }

    return scale;
}

/**
 *
 * @param index - index of a note (0-11)
 * @returns name of the note using American notation (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
 */
export function getNoteName(index: number) {
    return notes[index];
}

export function getMelodyNotesNames(
    melody: number[],
    octave: number
): string[] {
    return melody.map((note) => {
        const _note = getNoteName(note);
        return _note ? _note + octave : "";
    });
}

/**
 * Evaluates the user's guess against the correct degrees, updates the UI
 * correction state, and persists the attempt to IndexedDB.
 *
 * @param degrees - The correct scale degrees for the exercise.
 * @param pin - The user's guessed degrees.
 * @param setCorrection - React state setter for per-note visual feedback (1 = correct, 0 = incorrect).
 * @param training - Which training mode this attempt belongs to.
 * @param stats - Timing and settings metadata for the attempt.
 */
export function correctGuess(
    degrees: number[],
    pin: number[],
    setCorrection: (arg0: number[]) => void,
    training: Training,
    stats: ATTEMPT_STATS
) {
    Logger.log(degrees, pin);

    const results: number[] = [];

    for (let i = 0; i < degrees.length; i++) {
        results[i] = pin[i] === degrees[i] ? 1 : 0;
    }

    setCorrection(results);

    void db.attempts.add({
        training,
        timestamp: Date.now(),
        responseTime: stats.responseTime,
        speed: stats.speed,
        octave: stats.octave,
        length: degrees.length,
        degrees,
        guesses: pin,
        results,
    });
}

export enum ChordQuality {
    MINOR,
    MAJOR,
    DIMINISHED,
    DOM7,
    MAJ7,
    MIN7,
}

export enum KeyType {
    MAJOR,
    MINOR,
    HARMONIC_MINOR,
    MELODIC_MINOR,
    PHRYGIAN,
}

export interface LickNote {
    degree: number;
    timing: number;
    duration: number;
    octave?: number;
}

export interface ChordContext {
    degree: number;
    timing: number;
    duration: number;
    quality: ChordQuality;
}

export interface Lick {
    id: string;
    name: string;
    description: string;
    notes: LickNote[];
    chords: ChordContext[];
    context: {
        overChords: number[];
        inKey: KeyType;
    };
    tags: string[];
    tempo: number;
    timeSignature: string;
}

export interface LickFilter {
    tags?: string[];
    overChords?: number[];
    inKey?: KeyType;
    searchTerm?: string;
}

/**
 * @param root - 0-11 root note
 * @param octave - 0-7
 * @param type - ChordQuality
 */
export function makeChord(root: number, octave: number, type: ChordQuality) {
    const scale =
        type == ChordQuality.MAJOR ? getMajorScale(root) : getMinorScale(root);

    //1-5-1-3
    const chord_formula = [root, scale[4], root, scale[2]];

    //diminish 5th if VII degreee
    if (type == ChordQuality.DIMINISHED) {
        chord_formula[1] = scale[4]! - 1;
    }

    const chord_names = chord_formula.map((note) => getNoteName(note!));

    return [
        chord_names[0]! + octave,
        `${chord_names[1]!}${root < 5 ? octave : octave + 1}`, //from F, their 5th is in the next octave
        chord_names[2]! + (octave + 1),
        chord_names[3]! + (octave + 1),
    ];
}

/**
 * @param progression - chord progression using number system (1-7)
 * @param interval - time each chord will be held for
 *
 */
export function playChordProgression(
    Piano: Sampler,
    progression: number[],
    key: number,
    octave: number,
    interval: number
) {
    const scale = getMajorScale(key);

    const time = now();

    progression
        .filter((note) => note)
        .map((note, i) => {
            if (!note) return;
            let quality: ChordQuality = ChordQuality.MAJOR;

            if (note == 2 || note == 3 || note == 6) {
                quality = ChordQuality.MINOR;
            }

            if (note == 7) {
                quality = ChordQuality.DIMINISHED;
            }

            const chord = makeChord(scale[note - 1]!, octave, quality);
            Logger.log("Playing:", chord);

            Piano.triggerAttackRelease(chord, interval, time + interval * i);
        });
}

/**
 * @param melody - melody using number system
 * @param interval - time between each note i.e speed
 */
export function playMelody(
    Piano: Sampler,
    melody: number[],
    key: number,
    octave: number,
    interval: number
) {
    const scale = getMajorScale(key);

    const time = now();

    melody.map((note, i) => {
        Logger.log(`${getNoteName(scale[note - 1]!)}${octave}`);

        Piano.triggerAttackRelease(
            `${getNoteName(scale[note - 1]!)}${octave}`,
            interval,
            time + interval * i
        );
    });
}

/**
 * Plays a sustained octave drone (root + root one octave up) with a soft attack.
 *
 * @param Piano - Tone.js Sampler instance.
 * @param key - Index of the tonal key (0-11).
 * @param octave - Base octave for the drone.
 * @param duration - How long to sustain the drone (seconds).
 * @returns The Tone.js time at which the drone was triggered, for scheduling coordination.
 */
export function playDrone(
    Piano: Sampler,
    key: number,
    octave: number,
    duration: number
): number {
    const scale = getMajorScale(key);
    const rootName = getNoteName(scale[0]!)!;
    const VELOCITY = 0.5;
    const time = now();

    const low = `${rootName}${octave}`;
    const high = `${rootName}${octave + 1}`;

    Logger.log("Drone:", low, high);
    Piano.triggerAttackRelease(low, duration, time, VELOCITY);
    Piano.triggerAttackRelease(high, duration, time, VELOCITY);

    return time;
}

/**
 * Plays a melody with a sustained octave drone underneath.
 * The drone starts first, then the melody notes begin after a short lead-in
 * so the listener can lock into the key before hearing the exercise.
 *
 * @param Piano - Tone.js Sampler instance.
 * @param melody - Scale degrees to play (1-7).
 * @param key - Index of the tonal key (0-11).
 * @param octave - Octave to play the melody in.
 * @param interval - Time in seconds between each note.
 */
export function playMelodyWithDrone(
    Piano: Sampler,
    melody: number[],
    key: number,
    octave: number,
    interval: number
) {
    const scale = getMajorScale(key);
    const melodyDuration = (melody.length + 0.5) * interval;
    const droneDuration = DRONE_LEAD_IN + melodyDuration;

    // Drone starts immediately, 2 octaves below the melody
    const droneStart = playDrone(Piano, key, octave - 2, droneDuration);

    // Melody notes start after the lead-in
    const melodyStart = droneStart + DRONE_LEAD_IN;
    melody.map((note, i) => {
        const noteName = `${getNoteName(scale[note - 1]!)}${octave}`;
        Logger.log(noteName);
        Piano.triggerAttackRelease(
            noteName,
            interval,
            melodyStart + interval * i
        );
    });
}

export function getLickDuration(lick: Lick): number {
    if (lick.notes.length === 0) return 0;

    const lastNote = lick.notes.reduce((latest, note) => {
        const noteEnd = note.timing + note.duration;
        const latestEnd = latest.timing + latest.duration;
        return noteEnd > latestEnd ? note : latest;
    });

    return lastNote.timing + lastNote.duration;
}

export function lickNoteToNoteName(
    note: LickNote,
    key: number,
    baseOctave: number
): string {
    const scale = getMajorScale(key);
    const noteIndex = scale[note.degree - 1];
    const actualOctave = baseOctave + (note.octave || 0);
    return `${getNoteName(noteIndex!)}${actualOctave}`;
}

export function playLickNotes(
    Piano: Sampler,
    notes: LickNote[],
    key: number,
    baseOctave: number,
    speed: number
): Part {
    const groupedByTiming: Map<number, LickNote[]> = new Map();
    notes.forEach((note) => {
        const existing = groupedByTiming.get(note.timing) || [];
        existing.push(note);
        groupedByTiming.set(note.timing, existing);
    });

    const events = Array.from(groupedByTiming.entries())
        .map(([timing, notesAtTime]) => [timing / speed, notesAtTime] as any)
        .sort((a, b) => a[0] - b[0]);

    const part = new Part((time: number, value: any) => {
        const notesAtTime = value as LickNote[];
        const noteNames = notesAtTime.map((n) =>
            lickNoteToNoteName(n, key, baseOctave)
        );
        const duration = (notesAtTime[0]?.duration || 0.5) / speed;
        if (noteNames.length === 1) {
            Piano.triggerAttackRelease(noteNames[0]!, duration, time);
        } else {
            Piano.triggerAttackRelease(noteNames, duration, time);
        }
    }, events as any);

    part.start(0);
    return part as Part;
}

export function playLickChords(
    Piano: Sampler,
    chords: ChordContext[],
    key: number,
    octave: number,
    speed: number
): Part {
    const scale = getMajorScale(key);

    const events = chords
        .map((chordCtx) => [chordCtx.timing / speed, chordCtx] as any)
        .sort((a, b) => a[0] - b[0]);

    const part = new Part((time: number, value: any) => {
        const chordCtx = value as ChordContext;
        const root = scale[chordCtx.degree - 1]!;
        const chord = makeChord(root, octave, chordCtx.quality);
        const duration = chordCtx.duration / speed;
        Piano.triggerAttackRelease(chord, duration, time);
    }, events as any);

    part.start(0);
    return part as Part;
}

export function playLick(
    Piano: Sampler,
    lick: Lick,
    key: number,
    baseOctave: number = 4,
    playChords: boolean = true,
    speed: number = 1.0
): void {
    stopAllPlayback(Piano);

    if (playChords && lick.chords.length > 0) {
        __currentParts.chords = playLickChords(
            Piano,
            lick.chords,
            key,
            baseOctave - 1,
            speed
        );
    }

    __currentParts.notes = playLickNotes(
        Piano,
        lick.notes,
        key,
        baseOctave,
        speed
    );

    try {
        Transport.start();
    } catch {}
}

export function stopAllPlayback(Piano?: Sampler) {
    try {
        Transport.stop();
        Transport.cancel(0);
    } catch {}
    if (__currentParts.notes) {
        try {
            __currentParts.notes.stop();
            __currentParts.notes.dispose();
        } catch {}
        __currentParts.notes = undefined;
    }
    if (__currentParts.chords) {
        try {
            __currentParts.chords.stop();
            __currentParts.chords.dispose();
        } catch {}
        __currentParts.chords = undefined;
    }
    if (Piano) {
        try {
            Piano.releaseAll();
        } catch {}
    }
}
