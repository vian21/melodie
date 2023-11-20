"use client";

import { useEffect, useState } from "react";
import PinInput from "~/components/PinInput";
import {
    correctGuess,
    generateRandomKey,
    generateRandomProgression,
    getMajorScale,
    getMelodyNotesNames,
    getNotes,
    makeNotesURL,
    makeSounds,
    playSounds,
} from "~/util/library";
import Notes from "~/util/notes";

export default function ChordsHome() {
    const NUMBER_OF_NOTES = 4;
    const [key, setKey] = useState(0);
    const [speed, setSpeeed] = useState(1);
    const [octave] = useState(2);

    const [correction, setCorrection] = useState(new Array(NUMBER_OF_NOTES));
    const [chordProgression, setChordProgression] = useState(
        new Array(NUMBER_OF_NOTES),
    );

    const [pin, setPin] = useState(new Array(NUMBER_OF_NOTES));
    const onPinChanged = (pinEntry: number | undefined, index: number) => {
        const newPin = [...pin];
        newPin[index] = pinEntry;
        setPin(newPin);
    };

    const [chords, setChords] = useState(new Array(NUMBER_OF_NOTES));

    const [sounds, setSounds] = useState<Howl[] | undefined>([]);

    useEffect(() => {
        const key = generateRandomKey();
        const chordProgression = generateRandomProgression(NUMBER_OF_NOTES);

        const chords = getNotes(key, chordProgression);
        const notesURL = makeNotesURL(chords, octave);

        //set states
        setKey(key);
        setChordProgression(chordProgression);
        setChords(chords);
        setSounds(makeSounds(notesURL, speed));
    }, []);

    useEffect(() => {
        if (chords == undefined) return;

        const melodyNotesName = getMelodyNotesNames(chords, octave);
        const notesURL = melodyNotesName.map((note) => {
            return Notes[note] ?? "";
        });

        //set states
        setSounds(makeSounds(notesURL, speed));
    }, [octave, speed]);

    const newProgression = () => {
        console.log("new Progression");
        //get new key
        // setKey(generateRandomKey());

        const progression = generateRandomProgression(NUMBER_OF_NOTES);
        const chords = getNotes(key, progression);

        //change melody to notes urls
        const melodyNotesName = getMelodyNotesNames(chords, octave);
        const notesURL = melodyNotesName.map((note) => {
            return Notes[note] ?? "";
        });

        //set states
        setChords(chords);
        setChordProgression(progression);
        setPin(new Array(NUMBER_OF_NOTES));
        setSounds(makeSounds(notesURL, speed));
    };

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Chord Progression</h1>

            {/* Settings */}
            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Speed:</p>

                <input
                    className="w-4/5"
                    type="range"
                    min="1"
                    max="4"
                    value={speed}
                    onChange={(e) => {
                        setSpeeed(Number(e.target.value));
                    }}
                />
                <span className="px-2 text-xl">{speed}</span>
            </div>

            {/* <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Notes: </p>

                <input
                    className="w-4/5"
                    type="range"
                    min="2"
                    max="10"
                    value={numberOfNotes}
                    onChange={(e) => {
                        setNumberOfNotes(Number(e.target.value));
                    }}
                />
                <span className="px-2 text-xl">{numberOfNotes}</span>
            </div> */}

            <br />

            {/* Play */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => {
                    console.log(sounds);
                    playSounds(
                        sounds?.length
                            ? sounds
                            : makeSounds(makeNotesURL(chords, octave), speed),
                    );
                }}
            >
                Play
            </button>

            {/* New Melody */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={newProgression}
            >
                New Progression
            </button>

            {/* Enter notes */}
            <div className="m-auto mt-5 flex w-full flex-col">
                <center>
                    <PinInput
                        pin={pin}
                        onPinChanged={onPinChanged}
                        pinLength={NUMBER_OF_NOTES}
                        verification={correction}
                    />
                </center>
                <button
                    onClick={() => {
                        correctGuess(chordProgression, pin, setCorrection);
                    }}
                    className="m-auto mb-4 mt-5 w-4/5 bg-green-300 p-3 text-white"
                >
                    Verify
                </button>
            </div>
        </div>
    );
}
