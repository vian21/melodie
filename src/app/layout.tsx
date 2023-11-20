"use client";

import NavBar from "~/components/Navbar";
import "./index.css";
import { useEffect } from "react";
import Head from "next/head";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (
            localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
        <html lang="en">
            <Head>
                <title>Mélodie</title>
                <meta
                    name="description"
                    content="Chord Progression and Melody training for musicians"
                />
            </Head>
            <body>
                <NavBar />
                {children}
            </body>
        </html>
    );
}
