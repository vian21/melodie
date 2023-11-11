"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full">
      <h1>What do you want to learn?</h1>
      <div className="w-full m-auto flex flex-col">
        <Link className="m-auto w-4/5 bg-blue-300 p-3 text-white m-3"href="/chords">Chord Progression →</Link><br/>
        <Link className="m-auto w-4/5 bg-blue-300 p-3 text-white m-3" href="/melody">Melody →</Link>
      </div>
    </main>
  );
}
