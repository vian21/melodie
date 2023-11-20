"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function NavLinks(props: { hidden: boolean }) {
    if (props.hidden) return <></>;

    return (
        <>
            <li>
                <Link className="nav-link" href="/">
                    Home
                </Link>
            </li>

            <li>
                <Link className="nav-link" href="/about">
                    About
                </Link>
            </li>
        </>
    );
}

export default function NavBar() {
    function inDarkMode() {
        if (document.documentElement.classList.contains("dark")) {
            return true;
        } else {
            return false;
        }
    }

    function toggleMode() {
        if (inDarkMode()) {
            document.documentElement.classList.remove("dark");

            localStorage.setItem("theme", "light");

            setMode(false);
        } else {
            document.documentElement.classList.add("dark");

            localStorage.setItem("theme", "dark");

            setMode(true);
        }
    }

    let dark = false;
    const [mode, setMode] = useState(dark);

    const minWidth = 750;
    const [windowWidth, setWindowWidth] = useState(450);
    const [showNav, setShowNav] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    function isDesktop() {
        return windowWidth > minWidth;
    }

    useEffect(() => {
        dark = localStorage.getItem("theme") === "dark" ? true : false;
        setWindowWidth(window.innerWidth);
        setShowNav(window.innerWidth > minWidth);

        if (inDarkMode()) {
            setMode(true);
        } else {
            setMode(false);
        }

        addEventListener("resize", () => {
            if (window.innerWidth > minWidth) {
                setShowMenu(false);
                setShowNav(true);
            } else {
                setShowNav(false);
            }

            setWindowWidth(window.innerWidth);
        });

        const menu = document.querySelector(".menu");
        menu?.addEventListener("click", () => {
            setShowMenu(!showMenu);
        });
    }, []);

    return (
        <div className="sticky flex w-full justify-between p-2">
            <div className="h-8 w-8">
                {/* Home button*/}
                <Link className="" href="/">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                </Link>
            </div>

            {/* Nav bar */}
            <nav>
                <ul className="m-0 flex list-none items-center gap-2 p-0">
                    {/* Nav links */}
                    <NavLinks hidden={!showNav} />

                    {/* dark mode toggle */}
                    <li onClick={toggleMode}>
                        {mode ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                                />
                            </svg>
                        )}
                    </li>

                    {!isDesktop() ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="mx-2 h-6 w-6"
                            onClick={() => {
                                setShowMenu(!showMenu);
                            }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    ) : (
                        false
                    )}

                    <ul className="menu absolute right-2 top-10  z-10 my-auto flex flex-col gap-y-2 divide-y-2 divide-gray-100 rounded-md bg-slate-700 p-3 drop-shadow-2xl empty:hidden">
                        <NavLinks hidden={!showMenu} />
                    </ul>
                </ul>
            </nav>
        </div>
    );
}
