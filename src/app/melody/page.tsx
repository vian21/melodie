"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PinInput from "~/components/PinInput";
import Logger from "~/util/Logger";
import usePiano from "~/util/Piano";
import useStorage from "~/util/Storage";

import {
    Training,
    correctGuess,
    generateRandomKey,
    generateRandomMelody,
    playMelody,
} from "~/util/library";

export default function MelodyRandom() {
    const [numberOfNotes, setNumberOfNotes] = useState(4);
    const [octave, setOctave] = useState(4);
    const key = useRef(0);
    const [speed, setSpeeed] = useState(5);
    const [correction, setCorrection] = useState(new Array(numberOfNotes));
    const [melodyDegrees, setMelodyDegrees] = useState<number[]>(
        new Array(numberOfNotes),
    );

    const [pin, setPin] = useState<number[]>(new Array(numberOfNotes));
    const onPinChanged = (pinEntry: number | undefined, index: number) => {
        const newPin = [...pin];
        if (pinEntry) {
            newPin[index] = pinEntry;
        }
        setPin(newPin);
    };

    const piano = usePiano();
    const storage = useStorage();

    const newMelody = useCallback(() => {
        // Set states
        setMelodyDegrees(generateRandomMelody(numberOfNotes));

        // Clear correction
        setPin(new Array(numberOfNotes));
        setCorrection(new Array(numberOfNotes));
    }, [numberOfNotes]);

    useEffect(() => {
        const k_rand = generateRandomKey();
        Logger.log("Random Key gen", k_rand);
        // Generate new melody
        newMelody();

        key.current = k_rand;
    }, [newMelody]);

    useEffect(() => {
        Logger.log("Number of notes changed");
        newMelody();
    }, [newMelody, numberOfNotes]);

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Advanced Melody Trainer</h1>

            {/* Settings */}
            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Speed:</p>

                <input
                    className="w-4/5"
                    type="range"
                    min="4"
                    max="8"
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
                    if (piano === null) return;

                    playMelody(
                        piano,
                        melodyDegrees,
                        key.current,
                        octave,
                        speed / 4,
                    );
                }}
            >
                Play
            </button>

            {/* Play tonic */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => {
                    if (piano === null) return;

                    playMelody(piano, [1], key.current, octave, speed / 4);
                }}
            >
                Play Tonic (1)
            </button>

            {/* New Melody */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => {
                    newMelody();
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
                    onClick={() => {
                        if (storage == null) {
                            Logger.warn("Storage undefined!");
                            return;
                        }

                        correctGuess(
                            melodyDegrees,
                            pin,
                            setCorrection,
                            storage,
                            Training.MELODY,
                        );
                    }}
                    className="m-auto mb-4 mt-5 w-4/5 bg-green-300 p-3 text-white"
                >
                    Verify
                </button>
            </div>
        </div>
    );
}
