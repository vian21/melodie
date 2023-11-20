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
            <head>
                <title>Mélodie</title>
                <meta
                    name="og:description"
                    content="Chord Progression and Melody training for musicians"
                />
                <meta name="application-name" content="PWA App" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta name="apple-mobile-web-app-title" content="Mélodie" />
                <meta name="description" content="Chord Progression and Melody training for musicians" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />

                <link
                    rel="apple-touch-icon"
                    href="/icons/touch-icon-iphone.png"
                />

                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Mélodie" />
                <meta property="og:site_name" content="Mélodie" />
                <meta property="og:url" content="https://vian21.github.io/melodie" />
            </head>
            <body>
                <NavBar />
                {children}
            </body>
        </html>
    );
}
