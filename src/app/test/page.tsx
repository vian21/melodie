"use client";

import { now, Time } from "tone";
import Logger from "~/util/Logger";
import Piano from "~/util/Piano";
import {
    generateRandomProgression,
    getMajorScale,
    getMelodyNotesNames,
    getMinorScale,
    getNoteName,
} from "~/util/library";

enum ChordQuality {
    MINOR,
    MAJOR,
    DIMINISHED,
}

/**
 * @param root - 0-11 root note
 * @param octave - 0-7
 * @param type - ChordQuality
 */
function makeChord(root: number, octave: number, type: ChordQuality) {
    const scale =
        type == ChordQuality.MAJOR ? getMajorScale(root) : getMinorScale(root);

    //1-5-1-3
    const chord_formula = [root, scale[4], root, scale[2]];

    //diminish 5th if VII degreee
    if (type == ChordQuality.DIMINISHED) {
        chord_formula[1] = scale[4] - 1;
    }

    const chord_names = chord_formula.map((note) => getNoteName(note));
    Logger.log("chord_names", chord_names);

    return [
        chord_names[0] + octave,
        chord_names[1] + (root < 5) ? octave : octave + 1, //from F, their 5th is in the next octave
        chord_names[2] + (octave + 1),
        chord_names[3] + (octave + 1),
    ];
}

/**
 * @param progression - chord progression using number system (1-7)
 * @param interval - time between each note i.e speed
 *
 */
function playChordProgression(
    progression: number[],
    key: number,
    interval: number,
) {
    const scale = getMajorScale(key);

    const time = now();

    progression.map((note, i) => {
        let quality: ChordQuality = ChordQuality.MAJOR;

        if (note == 2 || note == 3 || note == 6) {
            quality = ChordQuality.MINOR;
        }

        if (note == 7) {
            quality = ChordQuality.DIMINISHED;
        }

        Piano.triggerAttackRelease(
            makeChord(scale[note - 1], 2, quality),
            interval,
            time + interval * i,
        );
    });
}

export default function TestPage() {
    const clicked = () => {
        let interval = 1.5;

        playChordProgression([6, 7, 1, 4], 0, interval);
    };

    return (
        <div>
            <button onClick={clicked}>Play</button>
        </div>
    );
}
