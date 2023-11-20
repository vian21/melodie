"use client";

import { useEffect, useState } from "react";
import PinInput from "~/components/PinInput";
import {
    correctGuess,
    generateRandomKey,
    generateRandomMelody,
    getMelodyNotesNames,
    getNotes,
    makeNotesURL,
    makeSounds,
    playSounds,
} from "~/util/library";
import Notes from "~/util/notes";

export default function MelodyRandom() {
    const [numberOfNotes, setNumberOfNotes] = useState(4);
    const [octave, setOctave] = useState(4);
    const [key, setKey] = useState(0);
    const [speed, setSpeeed] = useState(2);
    const [correction, setCorrection] = useState(new Array(numberOfNotes));
    const [melodyDegrees, setMelodyDegrees] = useState(
        new Array(numberOfNotes),
    );

    const [pin, setPin] = useState(new Array(numberOfNotes));
    const onPinChanged = (pinEntry: number | undefined, index: number) => {
        const newPin = [...pin];
        newPin[index] = pinEntry;
        setPin(newPin);
    };

    const [melody, setMelody] = useState(new Array(numberOfNotes));
    const [sounds, setSounds] = useState<Howl[] | undefined>([]);

    useEffect(() => {
        const key = generateRandomKey();
        const melodyDegrees = generateRandomMelody(numberOfNotes);

        const melody = getNotes(key, melodyDegrees);
        const notesURL = makeNotesURL(melody, octave);

        //set states
        setKey(key);
        setMelody(melody);
        setMelodyDegrees(melodyDegrees);
        setSounds(makeSounds(notesURL, speed));
    }, []);

    useEffect(() => {
        newMelody();
    }, [numberOfNotes]);

    useEffect(() => {
        if (melody == undefined) return;

        const melodyNotesName = getMelodyNotesNames(melody, octave);
        const notesURL = melodyNotesName.map((note) => {
            return Notes[note] ?? "";
        });

        //set states
        setSounds(makeSounds(notesURL, speed));
    }, [octave, speed]);

    const newMelody = () => {
        console.log("new melody");
        //get new key
        // setKey(generateRandomKey());

        const melodyDegrees = generateRandomMelody(numberOfNotes);
        const melody = getNotes(key, melodyDegrees);

        //change melody to notes urls
        const melodyNotesName = getMelodyNotesNames(melody, octave);
        const notesURL = melodyNotesName.map((note) => {
            return Notes[note] ?? "";
        });

        //set states
        setMelody(melody);
        setMelodyDegrees(melodyDegrees);
        setPin(new Array(numberOfNotes));
        setSounds(makeSounds(notesURL, speed));
    };

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Advanced Melody Trainer</h1>

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

            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Octave:</p>

                <input
                    className=""
                    type="range"
                    min="3"
                    max="5"
                    value={octave}
                    onChange={(e) => {
                        setOctave(Number(e.target.value));
                    }}
                />
                <span className="px-2 text-xl">C{octave}</span>
            </div>

            <div className="m-auto flex p-3">
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
            </div>

            <br />

            {/* Play */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => {
                    playSounds(
                        sounds?.length
                            ? sounds
                            : makeSounds(makeNotesURL(melody, octave), speed),
                    );
                }}
            >
                Play
            </button>

            {/* New Melody */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={newMelody}
            >
                New Melody
            </button>

            {/* Enter notes */}
            <div className="m-auto mt-5 flex w-full flex-col">
                <center>
                    <PinInput
                        pin={pin}
                        onPinChanged={onPinChanged}
                        pinLength={numberOfNotes}
                        verification={correction}
                    />
                </center>
                <button
                    onClick={() =>
                        correctGuess(
                            melodyDegrees.slice(1).map((note) => note + 1),
                            pin,
                            setCorrection,
                        )
                    }
                    className="m-auto mb-4 mt-5 w-4/5 bg-green-300 p-3 text-white"
                >
                    Verify
                </button>
            </div>
        </div>
    );
}
