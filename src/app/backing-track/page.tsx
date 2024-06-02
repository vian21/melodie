/**
 * BackingTrack - Playground to play custom chord progression backing tracks
 * Ref: https://jsfiddle.net/GarrettBodley/435jp1fa/
 */
"use client";

import { useRef, useState } from "react";
import { Loop, Transport, Sampler } from "tone";
import PinInput from "~/components/PinInput";
import * as Tone from "tone";
import Logger from "~/util/Logger";
import usePiano from "~/util/Piano";
import useStorage from "~/util/Storage";
import { notes } from "~/util/library";

import { playChordProgression } from "~/util/library";

export default function BackingTrack() {
    const [numberOfNotes, setNumberOfNotes] = useState(4);
    const [octave, setOctave] = useState(2);
    const key = useRef(0);
    const [speed, setSpeeed] = useState(5);
    const [playing, setPlaying] = useState(false);
    const [audioContextStarted, setStarted] = useState(false);
    const [loop, setLoop] = useState<Loop | null>(null);
    const [pin, setPin] = useState<number[]>(new Array(numberOfNotes));

    const onPinChanged = (pinEntry: number | undefined, index: number) => {
        const newPin = [...pin];
        if (pinEntry) {
            newPin[index] = pinEntry;
        }
        setPin(newPin);
    };

    const piano = usePiano();
    const _storage = useStorage();

    async function handleClick(piano: Sampler | null) {
        if (piano === null) return;
        setPlaying(!playing);

        if (!audioContextStarted) {
            await Tone.start();
            setStarted(true);
        }

        if (playing) {
            Logger.log("Stopping loop!");
            loop!.stop()
            loop!.dispose()
            Transport.stop(0);
            return;
        }

        const beatLength = 10 / speed;

        const _loop = new Loop(() => {
            Logger.log("Starting loop!");
            playChordProgression(piano, pin, key.current, octave, beatLength);
        }, beatLength * pin.length).start(0);
        setLoop(_loop);

        Transport.start();
    }

    return (
        <div className="flex flex-col">
            <h1 className="m-auto text-3xl">Playground</h1>

            {/* Settings */}
            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Speed:</p>

                <input
                    className="w-4/5"
                    type="range"
                    min="1"
                    max="10"
                    value={speed}
                    onChange={(e) => {
                        Logger.log("Speed changed");
                        setSpeeed(Number(e.target.value));
                    }}
                />
                <span className="px-2 text-xl">{speed}</span>
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
                        const n = Number(e.target.value)
                        setNumberOfNotes(n);
                        pin.length = n;
                        setPin(pin)
                    }}
                />
                <span className="px-2 text-xl">{numberOfNotes}</span>
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

            <div className="m-auto flex p-3">
                <p className="px-2 text-xl">Key:</p>

                <select
                    className="w-40 text-black"
                    onChange={(e) => (key.current = Number(e.target.value))}
                    defaultValue="0"
                >
                    {notes.map((key, i) => {
                        return (
                            <option value={i} key={i}>
                                {key}
                            </option>
                        );
                    })}
                </select>
            </div>

            <br />

            {/* Enter notes */}
            <div className="m-auto mt-5 flex w-full flex-col">
                <center>
                    <PinInput
                        pin={pin}
                        onPinChanged={onPinChanged}
                        pinLength={numberOfNotes}
                    />
                </center>
            </div>

            {/* Play */}
            <button
                className="m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white"
                onClick={() => void handleClick(piano)}
            >
                {playing ? "Stop" : "Play"}
            </button>
        </div>
    );
}
