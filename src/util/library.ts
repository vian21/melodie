import Logger from "./Logger";

import { Sampler, now } from "tone";
import { Storage } from "./Storage";

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

export const popularProgressions = [
    [1, 2, 3, 4],
    [1, 2, 6, 4],
    [1, 2, 6, 5],
    [1, 3, 4, 5],
    [1, 4, 6, 5],
    [1, 4, 2, 5],
    [1, 5, 6, 4],

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
 * @param index index of a note (0-11)
 * @returns name of the note using American notation (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
 */
export function getNoteName(index: number) {
    return notes[index];
}

export function getMelodyNotesNames(
    melody: number[],
    octave: number,
): string[] {
    return melody.map((note) => {
        const _note = getNoteName(note);
        return _note ? _note + octave : "";
    });
}

/**
 * Correct guess of degrees of melody/chord progression being played and save them using the useState setter
 */
export function correctGuess(
    degrees: number[],
    pin: number[],
    setCorrection: (arg0: number[]) => void,
    storage: Storage,
    training: Training,
) {
    Logger.log(degrees, pin);

    const newCorrection:number[] = [];
    let allCorrect: 0 | 1 = 1;

    for (let i = 0; i < degrees.length; i++) {
        const isCorrect = pin[i] === degrees[i] ? 1 : 0;

        if (isCorrect == 0) allCorrect = 0;

        newCorrection[i] = isCorrect;

        //TODO: bring back analytics
        void allCorrect;
        void storage;
        void training;
        // storage.increment(training, degrees[i]!, isCorrect);
    }

    setCorrection(newCorrection);

    //overall tries increment
    // storage.increment(training, 0, allCorrect);
}

export enum ChordQuality {
    MINOR,
    MAJOR,
    DIMINISHED,
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
    interval: number,
) {
    const scale = getMajorScale(key);

    const time = now();

    progression.filter ((note)=> note)
    .map((note, i) => {
        if(!note) return
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
 *
 */
export function playMelody(
    Piano: Sampler,
    melody: number[],
    key: number,
    octave: number,
    interval: number,
) {
    const scale = getMajorScale(key);

    const time = now();

    melody.map((note, i) => {
        Logger.log(`${getNoteName(scale[note - 1]!)}${octave}`);

        Piano.triggerAttackRelease(
            `${getNoteName(scale[note - 1]!)}${octave}`,
            interval,
            time + interval * i,
        );
    });
}
