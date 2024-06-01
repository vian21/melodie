"use client";

import Link from "next/link";

export default function HomePage() {
    return (
        <main className="w-full">
            <h1 className="p-3 text-xl">What do you want to learn?</h1>
            <div className="m-auto flex w-full flex-col">
                <Link
                    className="m-auto my-3 w-4/5 bg-blue-300 p-3 text-xl text-white"
                    href="/chords"
                >
                    Chord Progression →
                </Link>
                <Link
                    className="m-auto my-3 w-4/5 bg-blue-300 p-3 text-xl text-white"
                    href="/melody"
                >
                    Melody →
                </Link>
                <Link
                    className="m-auto my-3 w-4/5 bg-blue-300 p-3 text-xl text-white"
                    href="/interval"
                >
                    Interval Training →
                </Link>
                <Link
                    className="m-auto my-3 w-4/5 bg-blue-300 p-3 text-xl text-white"
                    href="/backing-track"
                >
                    🎹 Backing Track →
                </Link>
            </div>
        </main>
    );
}
