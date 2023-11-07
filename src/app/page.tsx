"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full">
      <h1>What do you want to learn?</h1>
      <div className="w-full m-auto flex flex-col">
        <Link href="/chords">Chord Progression</Link><br/>
        <Link href="/melody">Melody</Link>
      </div>
    </main>
  );
}
