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
            try {
                const {
                    Renderer,
                    Stave,
                    StaveNote,
                    Voice,
                    Formatter,
                    Accidental,
                }: any = await import("vexflow");

                if (
                    !Renderer ||
                    !Stave ||
                    !StaveNote ||
                    !Voice ||
                    !Formatter ||
                    !Accidental
                ) {
                    console.error("VexFlow classes missing", {
                        Renderer,
                        Stave,
                        StaveNote,
                        Voice,
                        Formatter,
                        Accidental,
                    });
                    return;
                }

                containerRef.current!.innerHTML = "";
                (containerRef.current as HTMLDivElement).style.minHeight =
                    "200px";

                const renderer = new Renderer(
                    containerRef.current!,
                    Renderer.Backends.SVG
                );

                const width = Math.max(400, lick.notes.length * 60);
                const height = 200;

                renderer.resize(width, height);
                const context = renderer.getContext();

                const stave = new Stave(10, 40, width - 20);
                // Clef/time signature across VF versions
                const addClef =
                    (stave as any).addClef ?? (stave as any).setClef;
                const addTS =
                    (stave as any).addTimeSignature ??
                    (stave as any).setTimeSignature;
                try {
                    addClef?.("treble");
                } catch (e) {
                    console.warn("Clef set failed", e);
                }
                try {
                    addTS?.(lick.timeSignature);
                } catch (e) {
                    console.warn("Time signature set failed", e);
                }
                stave.setContext(context).draw();

                // If no notes, stop after drawing stave
                if (!lick.notes || lick.notes.length === 0) {
                    return;
                }

                const vexNotes = lick.notes.map((note: LickNote) => {
                    const duration = durationToVexFlowDuration(note.duration);
                    const noteName = degreeToNoteName(
                        note.degree,
                        musicKey,
                        note.octave || 0
                    );
                    const parts = noteName.split("/");
                    const raw = parts[0] ?? "C";
                    const oct = parts[1] ?? "4";
                    const letter = raw.charAt(0).toLowerCase();
                    const accidental = raw.length > 1 ? raw.slice(1) : ""; // "" | "#" | "b"
                    const key = `${letter}${accidental}/${oct}`; // e.g., "c#/4"
                    const sn = new StaveNote({ keys: [key], duration });
                    if (accidental) {
                        sn.addAccidental(0, new Accidental(accidental));
                    }
                    return sn;
                });

                const totalBeats = lick.notes.reduce(
                    (sum, n) => sum + n.duration,
                    0
                );
                const [tsBeats, tsBeatValue] = (lick.timeSignature || "4/4")
                    .split("/")
                    .map((x) => parseInt(x, 10));
                let voice: any;
                try {
                    // VF v5-style options object
                    voice = new Voice({
                        num_beats: tsBeats || Math.ceil(totalBeats),
                        beat_value: tsBeatValue || 4,
                    });
                } catch {
                    // Legacy signature
                    voice = new (Voice as any)(
                        tsBeats || Math.ceil(totalBeats),
                        tsBeatValue || 4
                    );
                }
                voice.setStrict?.(false);
                voice.addTickables(vexNotes);

                try {
                    new Formatter()
                        .joinVoices([voice])
                        .format([voice], width - 40);
                } catch (e) {
                    console.warn(
                        "VexFlow format failed; drawing unformatted",
                        e
                    );
                }

                try {
                    voice.draw(context, stave);
                } catch (e) {
                    console.error("VexFlow draw failed", e);
                }
            } catch (err) {
                console.error("Failed to render notation", err);
            }
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
