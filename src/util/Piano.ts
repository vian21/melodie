"use client";

import { useEffect, useState } from "react";
import { Part, Sampler, Transport, start } from "tone";
import { env } from "~/env.mjs";
import Logger from "./Logger";

export type PianoSampler = Sampler & {
    stopAll: () => void;
    setActivePart: (part: Part, loopOptions?: LoopOptions) => void;
};

type LoopOptions = { start?: number; end: number };

let sharedPiano: PianoSampler | null = null;
let activePart: Part | null = null;
let audioContextStarted = false;

function clearActivePart() {
    if (!activePart) return;

    activePart.stop(0);
    activePart.cancel(0);
    activePart.dispose();
    activePart = null;
}

function buildSampler() {
    if (sharedPiano) return;

    const piano = new Sampler({
        urls: {
            A0: "A0.mp3",
            C1: "C1.mp3",
            "D#1": "Ds1.mp3",
            "F#1": "Fs1.mp3",
            A1: "A1.mp3",
            C2: "C2.mp3",
            "D#2": "Ds2.mp3",
            "F#2": "Fs2.mp3",
            A2: "A2.mp3",
            C3: "C3.mp3",
            "D#3": "Ds3.mp3",
            "F#3": "Fs3.mp3",
            A3: "A3.mp3",
            C4: "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            A4: "A4.mp3",
            C5: "C5.mp3",
            "D#5": "Ds5.mp3",
            "F#5": "Fs5.mp3",
            A5: "A5.mp3",
            C6: "C6.mp3",
            "D#6": "Ds6.mp3",
            "F#6": "Fs6.mp3",
            A6: "A6.mp3",
            C7: "C7.mp3",
            "D#7": "Ds7.mp3",
            "F#7": "Fs7.mp3",
            A7: "A7.mp3",
            C8: "C8.mp3",
        },
        release: 1,
        baseUrl: `${env.NEXT_PUBLIC_BASEPATH}/sounds/piano/`,
        onload: () => {
            Logger.log("Piano loaded");
        },
    }).toDestination() as PianoSampler;

    piano.stopAll = () => {
        Logger.log("[Piano.ts] Stopping playback");
        clearActivePart();

        Transport.stop();
        Transport.cancel(0);

        piano.releaseAll();
    };

    piano.setActivePart = (part: Part, opts?: LoopOptions) => {
        clearActivePart();

        activePart = part;
        part.loop = !!opts;

        if (!!opts) {
            part.loopStart = opts?.start || 0;
            part.loopEnd = opts.end;
        }

        if (!audioContextStarted) {
            start();
            audioContextStarted = true;
        }

        Transport.seconds = 0;
        part.start(0);
        Transport.start();
    };

    sharedPiano = piano;
}

export default function usePiano(): PianoSampler | null {
    const [piano, setPiano] = useState<PianoSampler | null>(sharedPiano);

    useEffect(() => {
        if (!sharedPiano) {
            buildSampler();
        }

        setPiano(sharedPiano);

        return () => {
            sharedPiano?.stopAll();
        };
    }, []);

    return piano;
}
