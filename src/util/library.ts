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
    [1, 4, 6, 5],
    [1, 5, 6, 4],
    [6, 4, 1, 5],
];

/**
 *
 * @returns index of a tonal key (0-11)
 */
export function generateRandomKey(): number {
    return Math.floor(Math.random() * 12);
}

/**
 * @param key index of the tonal key (0-11)
 * @returns array of indexes of notes starting with the tonic
 */
export function generateRandomMelody(key: number, length: number): number[] {
    const scale = getMajorScale(key);
    const melody = [];
    //tonic
    scale[0] ? melody.push(scale[0]) : null;

    for (let i = 0; i < length; i++) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        if (note == undefined) continue;
        melody.push(note);
    }

    return melody;
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
