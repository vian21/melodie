"use client";

import { useEffect, useRef } from "react";
import {
    Lick,
    LickNote,
    getMajorScale,
    getNoteName,
} from "../../../util/library";

interface Props {
    lick: Lick;
    musicKey: number;
    displayType?: "notation" | "tab";
}

export function LickNotation({
    lick,
    musicKey,
    displayType = "notation",
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || typeof window === "undefined") return;

        const loadVexFlow = async () => {
            const Vex = (await import("vexflow")).default;
            const VF = Vex.Flow;

            if (!VF || !VF.Renderer) return;

            containerRef.current!.innerHTML = "";

            const renderer = new VF.Renderer(
                containerRef.current!,
                VF.Renderer.Backends.SVG
            );

            const width = Math.max(400, lick.notes.length * 60);
            const height = 200;

            renderer.resize(width, height);
            const context = renderer.getContext();

            const stave = new VF.Stave(10, 40, width - 20);
            stave.addClef("treble").addTimeSignature(lick.timeSignature);
            stave.setContext(context).draw();

            const vexNotes = lick.notes.map((note: LickNote) => {
                const duration = durationToVexFlowDuration(note.duration);
                const noteName = degreeToNoteName(
                    note.degree,
                    musicKey,
                    note.octave || 0
                );
                return new VF.StaveNote({ keys: [noteName], duration });
            });

            const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(vexNotes);

            new VF.Formatter().joinVoices([voice]).format([voice], width - 40);

            voice.draw(context, stave);
        };

        loadVexFlow().catch(console.error);
    }, [lick, musicKey, displayType]);

    return (
        <div className="lick-notation-container p-4">
            <div ref={containerRef} />
        </div>
    );
}

function durationToVexFlowDuration(beats: number): string {
    if (beats >= 4) return "w";
    if (beats >= 2) return "h";
    if (beats >= 1) return "q";
    if (beats >= 0.5) return "8";
    if (beats >= 0.25) return "16";
    return "32";
}

function degreeToNoteName(
    degree: number,
    key: number,
    octave: number = 0
): string {
    const scale = getMajorScale(key);
    const noteIndex = scale[degree - 1];
    const actualOctave = 4 + octave;
    return `${getNoteName(noteIndex!)}/${actualOctave}`;
}
