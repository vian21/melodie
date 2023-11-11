"use client";

import Link from "next/link";

export default function MelodyHome() {
    return (
        <div className="flex  w-full flex-col">
            <h1 className="m-auto text-2xl">Melody</h1>
            <Link
                className="m-auto w-4/5 bg-blue-300 p-3 text-white "
                href="/melody/basic"
            >
                Basic →
            </Link>
            <br />
            <Link
                className="m-auto w-4/5 bg-blue-300 p-3 text-white "
                href="/melody/random"
            >
                Advanced →
            </Link>
        </div>
    );
}
