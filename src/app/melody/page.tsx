"use client";

import { useEffect, useRef, useState } from "react";
import PinInput from "~/components/PinInput";
import Logger from "~/util/Logger";

import {
    correctGuess,
    generateRandomKey,
    generateRandomMelody,
    getNotes,
    makeNotesURL,
    makeSounds,
    playSounds,
} from "~/util/library";

export default function MelodyRandom() {
    const [numberOfNotes, setNumberOfNotes] = useState(4);
    const [octave, setOctave] = useState(4);
    const key = useRef(0);
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
        const k_rand = generateRandomKey();
        Logger.warn("Random Key gen", k_rand);
        //generate new melody
        newMelody(k_rand);

        key.current = k_rand;
    }, []);

    useEffect(() => {
        Logger.warn("Number of notes changed");
        newMelody(key.current); //TODO: causing error on initial render. The key and the melody being played are out of sync.
    }, [numberOfNotes]);

    useEffect(() => {
        if (melody == undefined) return;

        const notesURL = makeNotesURL(melody, octave);

        //set states
        setSounds(makeSounds(notesURL, speed));
    }, [octave, speed]);

    const newMelody = (key: number) => {
        Logger.log("new melody, Key=", key);

        const melodyDegrees = generateRandomMelody(numberOfNotes);
        const melody = getNotes(key, melodyDegrees);

        //change melody to notes urls
        const notesURL = makeNotesURL(melody, octave);

        //set states
        setMelody(melody);
        setMelodyDegrees(melodyDegrees);
        setSounds(makeSounds(notesURL, speed));

        //clear correction
        setPin(new Array(numberOfNotes));
        setCorrection(new Array(numberOfNotes));
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
                        Logger.log("Speed changed");
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
                    if (sounds == undefined || sounds?.length == 0) {
                        playSounds(
                            makeSounds(makeNotesURL(melody, octave), speed),
                        );
                        return;
                    }

                    playSounds(sounds);
                }}
            >
                Play
            </button>

            {/* Play tonic */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => {
                    playSounds(makeSounds(makeNotesURL([key.current], octave)));
                }}
            >
                Play Tonic (1)
            </button>

            {/* New Melody */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => {
                    newMelody(key.current);
                }}
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
                            melodyDegrees.map((note) => note + 1),
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
