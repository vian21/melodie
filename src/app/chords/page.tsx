"use client";

import { useEffect, useRef, useState } from "react";
import PinInput from "~/components/PinInput";
import usePiano from "~/util/Piano";
import {
    Training,
    correctGuess,
    generateRandomKey,
    generateRandomProgression,
    playChordProgression,
} from "~/util/library";

export default function ChordsHome() {
    const NUMBER_OF_NOTES = 4;
    const key = useRef(0);
    const [speed, setSpeeed] = useState(5);
    const [octave, setOctave] = useState(2);

    const [correction, setCorrection] = useState(
        new Array(NUMBER_OF_NOTES).fill(undefined)
    );
    const [chordProgression, setChordProgression] = useState(
        new Array(NUMBER_OF_NOTES)
    );

    const [pin, setPin] = useState(
        new Array(NUMBER_OF_NOTES + 1).fill(undefined)
    );
    const [startTime, setStartTime] = useState(Date.now());
    const onPinChanged = (pinEntry: number | undefined, index: number) => {
        const newPin = [...pin];
        if (pinEntry) {
            newPin[index] = pinEntry;
        }
        setPin(newPin);
    };

    const piano = usePiano();

    useEffect(() => {
        const k_rand = generateRandomKey();

        const chordProgression = generateRandomProgression(NUMBER_OF_NOTES);

        //set states
        key.current = k_rand;

        setChordProgression(chordProgression);
    }, []);

    const newProgression = () => {
        console.log("new Progression");
        const progression = generateRandomProgression(NUMBER_OF_NOTES);

        setChordProgression(progression);
        setPin(new Array(NUMBER_OF_NOTES).fill(undefined));
        setCorrection(new Array(NUMBER_OF_NOTES).fill(undefined));
        setStartTime(Date.now());
    };

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Chord Progression</h1>

            {/* Settings */}
            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Length:</p>

                <input
                    className="w-4/5"
                    type="range"
                    min="4"
                    max="8"
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
                    min="2"
                    max="4"
                    value={octave}
                    onChange={(e) => {
                        setOctave(Number(e.target.value));
                    }}
                />
                <span className="px-2 text-xl">C{octave}</span>
            </div>
            <br />

            {/* Play */}
            <button
                className="m-auto my-4 w-4/5 bg-blue-300 p-3 text-xl text-white"
                onClick={() => {
                    if (piano == null) return;

                    //TODO: stop previously sequence before starting new one
                    playChordProgression(
                        piano,
                        chordProgression,
                        key.current,
                        octave,
                        speed / 4
                    );
                }}
            >
                Play
            </button>

            {/* Play tonic */}
            <button
                className="m-auto my-4 w-4/5 bg-blue-300 p-3 text-xl text-white"
                onClick={() => {
                    if (piano == null) return;

                    playChordProgression(piano, [1], key.current, octave, 2);
                }}
            >
                Play Tonic (1)
            </button>

            {/* New Chord Progression */}
            <button
                className="m-auto my-4 w-4/5 bg-blue-300 p-3 text-xl text-white"
                onClick={() => {
                    newProgression();
                }}
            >
                New Progression
            </button>

            {/* Enter notes */}
            <div className="m-auto mt-5 flex w-full flex-col">
                <center>
                    <PinInput
                        pin={pin}
                        onPinChanged={onPinChanged}
                        pinLength={chordProgression?.length}
                        verification={correction}
                    />
                </center>
                <button
                    disabled={
                        correction.length === NUMBER_OF_NOTES &&
                        correction.every((value) => value === 1)
                    }
                    onClick={() => {
                        correctGuess(
                            chordProgression,
                            pin,
                            setCorrection,
                            Training.CHORD_PROGRESSION,
                            {
                                responseTime: Date.now() - startTime,
                                speed,
                                octave,
                            }
                        );
                    }}
                    className="m-auto mb-4 mt-5 w-4/5 bg-green-300 p-3 text-xl text-white disabled:opacity-70"
                >
                    Verify
                </button>
            </div>
        </div>
    );
}
