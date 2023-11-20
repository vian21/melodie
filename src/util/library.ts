import { Howl } from "howler";
import { env } from "~/env.mjs";
import Notes from "./notes";

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
    [6, 4, 5, 1],
    [6, 5, 4, 1],
    [6, 5, 1, 4],
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
 * ### NOTE: Will append the tonal note at the beginning of the melody
 * @returns array of degrees of notes(0-6)
 */
export function generateRandomMelody(length: number): number[] {
    const melody = [0]; //tonal note

    for (let i = 0; i < length; i++) {
        const note = Math.floor(Math.random() * 7);
        if (note == undefined) continue;

        melody.push(note);
    }

    return melody;
}

/**
 * generate random length-1 intervals starting with the root
 */
export function generateRandomIntervals(length: number): number[] {
    const intervals = [];
    for (let i = 0; i < length; i++) {
        intervals.push(0);
        intervals.push(Math.floor(Math.random() * 7));
    }

    return intervals;
}
/**
 *
 * @param length length of the progression. Default: 4
 * @returns degreess of chords in the progression
 */

export function generateRandomProgression(length: number = 4): number[] {
    const prog = popularProgressions[
        Math.floor(Math.random() * popularProgressions.length)
    ]?.slice(0, length);
    return prog ? prog : [];
}

/**
 *
 * @param key index of a tonal key (0-11)
 *
 * w-w-h-w-w-w-h -> +0 +2 +2 +1 +2 +2 +2
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
 *
 * @param notes array of URLs of notes to play
 * @param rate speed of the melody. Default is 1
 * @returns
 */
export function makeSounds(notes: string[], rate = 1): Howl[] {
    const sounds: Howl[] = [];

    notes.map((note, i) => {
        sounds.push(
            new Howl({
                src: [env.NEXT_PUBLIC_BASEPATH + note],
                rate: rate,
                html5: true,
                onend: () => {
                    console.log(note);
                    if (i === notes.length - 1) return;
                    sounds[i + 1]?.play();
                },
            }),
        );
    });
    console.log("makeSounds: ", notes);
    return sounds;
}

/**
 * correct guess of degress of melody being played
 */
export function correctGuess(
    melodyDegrees: number[],
    pin: number[],
    setCorrection: (arg0: number[]) => void,
) {
    console.log(melodyDegrees, pin);
    const newCorrection = [];
    for (let i = 0; i < melodyDegrees.length; i++) {
        if (pin[i] === (melodyDegrees[i] ?? 0)) {
            newCorrection[i] = 1;
        } else {
            newCorrection[i] = 0;
        }
    }
    setCorrection(newCorrection);
}

/**
 * @param sounds array of Howl objects
 */
export function playSounds(sounds: { play: () => void }[]) {
    console.log("playSounds: ", sounds);

    Howler.stop();
    sounds[0]?.play();
}

/**
 *
 */
export function makeNotesURL(melody: number[], octave: number) {
    const melodyNotesName = getMelodyNotesNames(melody, octave);

    console.log("makeNotesURL: ", melodyNotesName);
    return melodyNotesName.map((note) => {
        return Notes[note] ?? "";
    });
}
