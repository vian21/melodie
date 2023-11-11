"use client";

import { useState } from "react";
import { Howl } from "howler";
import {
    generateRandomKey,
    generateRandomMelody,
    getMelodyNotesNames,
    getNoteName,
} from "~/util/library";

import Notes from "~/util/notes";

function makeSounds(notes: string[], rate: number = 1): Howl[] {
    const sounds: Howl[] = [];

    notes.map((note, i) => {
        sounds.push(
            new Howl({
                src: [note],
                rate: rate,
                onend: () => {
                    console.log(rate, note);
                    if (i === notes.length - 1) return;
                    sounds[i + 1]?.play();
                },
            }),
        );
    });

    return sounds;
}

export default function MelodyHome() {
    const [numberOfNotes, setNumberOfNotes] = useState(4);
    const [octave, setOctave] = useState(4);
    const [key, setKey] = useState(generateRandomKey());
    const [speed, setSpeed] = useState(2);
    //generate melody
    let melody = generateRandomMelody(key, numberOfNotes);

    //change melody to notes urls
    let melodyNotesName = getMelodyNotesNames(melody, octave);
    let notesURL: string[] = melodyNotesName.map((note) => {
        return Notes[note] || "";
    });

    const [sounds, setSounds] = useState(makeSounds(notesURL, speed));

    const clickHandler = () => {
        Howler.stop();
        sounds[0]?.play();
    };

    const newMelody = () => {
        melody = generateRandomMelody(key, numberOfNotes);

        //change melody to notes urls
        melodyNotesName = getMelodyNotesNames(melody, octave);
        notesURL = melodyNotesName.map((note) => {
            return Notes[note] || "";
        });

        setSounds(makeSounds(notesURL, speed));
    };

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Advanced Melody Trainer</h1>
            {/* Settings */}
            <p className="text-md">Octave</p>
            <div className="m-auto flex p-3">
                <input
                    className=""
                    type="range"
                    min="3"
                    max="5"
                    value={octave}
                    onChange={(e) => {
                        setOctave(Number(e.target.value));
                        newMelody();
                    }}
                />
                <span>C{octave}</span>
            </div>

            <p className="text-md">How many notes?</p>
            <div className="m-auto flex p-3">
                <input
                    className="w-4/5"
                    type="range"
                    min="2"
                    max="10"
                    value={numberOfNotes}
                    onChange={(e) => {
                        setNumberOfNotes(Number(e.target.value));
                        newMelody();
                    }}
                />
                <span>{numberOfNotes}</span>
            </div>

            <br />

            {/* Play */}
            <button
                className="m-auto w-4/5 bg-blue-300 p-3 text-white"
                onClick={clickHandler}
            >
                Play
            </button>
            {/* Enter notes */}

            <input type="text" maxLength={numberOfNotes} />

            {/* New Melody */}
            <button
                className="m-auto w-4/5 bg-blue-300 p-3 text-white"
                onClick={newMelody}
            >
                New Melody
            </button>
        </div>
    );
}
