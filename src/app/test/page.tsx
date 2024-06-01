"use client";

import usePiano from "~/util/Piano";
import { playChordProgression } from "~/util/library";

export default function TestPage() {
    const piano = usePiano();
    const clicked = () => {
        const interval = 1.5;

        if (piano == null) return;

        playChordProgression(piano, [6, 7, 1, 4], 0, 2, interval);
    };

    return (
        <div>
            <button onClick={clicked}>Play</button>
        </div>
    );
}
