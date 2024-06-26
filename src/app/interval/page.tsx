"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PinInput from "~/components/PinInput";
import usePiano from "~/util/Piano";
import useStorage from "~/util/Storage";
import {
    Training,
    correctGuess,
    generateRandomIntervals,
    generateRandomKey,
    playMelody,
} from "~/util/library";

export default function MelodyRandom() {
    const [numberOfNotes, setNumberOfNotes] = useState(1);
    const [octave, setOctave] = useState(4);
    const key = useRef(0);
    const [speed, setSpeeed] = useState(4);
    const [correction, setCorrection] = useState(new Array(numberOfNotes * 2));
    const [melodyDegrees, setMelodyDegrees] = useState<number[]>(
        new Array(numberOfNotes * 2),
    );

    const [pin, setPin] = useState<number[]>(new Array(numberOfNotes * 2));
    const onPinChanged = (pinEntry: number | undefined, index: number) => {
        const newPin = [...pin];
        if (pinEntry) {
            newPin[index] = pinEntry;
        }
        setPin(newPin);
    };

    const piano = usePiano();
    const storage = useStorage();

    const [melody, setMelody] = useState(new Array(numberOfNotes));

    const newMelody = useCallback(() => {
        console.log("new melody");

        const melodyDegrees = generateRandomIntervals(numberOfNotes);

        //set states
        setMelodyDegrees(melodyDegrees);
        setPin(new Array(numberOfNotes));

        //clear correction
        setCorrection(new Array(numberOfNotes));
    }, [numberOfNotes]);

    useEffect(() => {
        const k_rand = generateRandomKey();
        const melodyDegrees = generateRandomIntervals(numberOfNotes);

        //set states
        key.current = k_rand;

        setMelody(melody);
        setMelodyDegrees(melodyDegrees);
    }, [melody, numberOfNotes]);

    useEffect(() => {
        newMelody();
    }, [newMelody, numberOfNotes]);

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Interval Trainer</h1>

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
                    min="1"
                    max="5"
                    value={octave}
                    onChange={(e) => {
                        setOctave(Number(e.target.value));
                    }}
                />
                <span className="px-2 text-xl">C{octave}</span>
            </div>

            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Intervals: </p>

                <input
                    className="w-4/5"
                    type="range"
                    min="1"
                    max="7"
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
                    if (piano == null) return;

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

            {/* New Melody */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={newMelody}
            >
                New Interval
            </button>

            {/* Enter notes */}
            <div className="m-auto mt-5 flex w-full flex-col">
                <center>
                    <PinInput
                        pin={pin}
                        onPinChanged={onPinChanged}
                        pinLength={numberOfNotes * 2}
                        verification={correction}
                    />
                </center>
                <button
                    onClick={() => {
                        if (storage == null) return;

                        correctGuess(
                            melodyDegrees,
                            pin,
                            setCorrection,
                            storage,
                            Training.INTERVAL,
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
