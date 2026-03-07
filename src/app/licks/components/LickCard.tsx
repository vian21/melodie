"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LickIndexEntry } from "../../../types/lickTypes";
import { env } from "~/env.mjs";

interface Props {
    lick: LickIndexEntry;
}

interface TrackInfo {
    index: number;
    name: string;
}

/**
 * Strip YAML frontmatter from an alphatex file, returning only the body.
 */
function stripFrontmatter(content: string): string {
    const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    if (match) {
        return content.slice(match[0].length);
    }
    return content;
}

/** Format milliseconds as mm:ss */
function formatDuration(ms: number): string {
    let seconds = ms / 1000;
    const minutes = (seconds / 60) | 0;
    seconds = (seconds - minutes * 60) | 0;
    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}

export function LickCard({ lick }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [tracks, setTracks] = useState<TrackInfo[]>([]);

    const destroyApi = useCallback(() => {
        if (apiRef.current) {
            try {
                apiRef.current.destroy();
            } catch {
                // ignore
            }
            apiRef.current = null;
        }
        setIsPlaying(false);
        setPlayerReady(false);
        setCurrentTime(0);
        setEndTime(0);
        setTracks([]);
    }, []);

    useEffect(() => {
        if (
            !isExpanded ||
            !containerRef.current ||
            typeof window === "undefined"
        ) {
            return;
        }

        let cancelled = false;
        let previousSeconds = -1;

        const init = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch the alphatex file
                const basePath = env.NEXT_PUBLIC_BASEPATH?.trim() || "";
                const res = await fetch(`${basePath}${lick.path}`);
                if (!res.ok) {
                    throw new Error(
                        `Failed to fetch ${lick.path}: ${res.status}`
                    );
                }
                const raw = await res.text();
                const texBody = stripFrontmatter(raw);

                if (cancelled) return;

                // Dynamic import of alphaTab
                const alphaTab = await import("@coderline/alphatab");

                if (cancelled || !containerRef.current) return;

                // Clear previous content
                containerRef.current.innerHTML = "";

                const mainEl = document.createElement("div");
                mainEl.style.width = "100%";
                mainEl.style.overflow = "auto";
                mainEl.style.backgroundColor = "#ffffff";
                containerRef.current.appendChild(mainEl);

                const settings = {
                    core: {
                        tex: true,
                        fontDirectory: `${basePath}/font/`,
                    },
                    display: {
                        layoutMode: 1, // Page layout
                        resources: {
                            mainGlyphColor: "rgb(0, 0, 0)",
                            secondaryGlyphColor: "rgba(0, 0, 0, 0.6)",
                            scoreInfoColor: "rgb(0, 0, 0)",
                            barNumberColor: "rgb(128, 0, 0)",
                            barSeparatorColor: "rgb(80, 80, 80)",
                            staffLineColor: "rgb(80, 80, 80)",
                        },
                    },
                    player: {
                        enablePlayer: true,
                        enableCursor: true,
                        enableUserInteraction: true,
                        soundFont: `${basePath}/soundfont/sonivox.sf2`,
                        scrollElement: viewportRef.current,
                    },
                };

                const api = new alphaTab.AlphaTabApi(mainEl, settings as any);
                apiRef.current = api;

                api.playerReady.on(() => {
                    if (!cancelled) {
                        setPlayerReady(true);
                    }
                });

                api.playerStateChanged.on((e: any) => {
                    if (!cancelled) {
                        setIsPlaying(e.state === 1);
                    }
                });

                // Track position changes — throttle to once per second
                api.playerPositionChanged.on((e: any) => {
                    if (cancelled) return;
                    const currentSeconds = (e.currentTime / 1000) | 0;
                    if (currentSeconds !== previousSeconds) {
                        previousSeconds = currentSeconds;
                        setCurrentTime(e.currentTime);
                        setEndTime(e.endTime);
                    }
                });

                // Once the score is loaded, render ALL tracks and extract track info
                api.scoreLoaded.on((score: any) => {
                    if (!cancelled && score?.tracks?.length > 0) {
                        api.renderTracks(score.tracks);
                        setTracks(
                            score.tracks.map((t: any) => ({
                                index: t.index,
                                name: t.name,
                            }))
                        );
                    }
                });

                api.renderFinished.on(() => {
                    if (!cancelled) {
                        setIsLoading(false);
                    }
                });

                api.error.on((e: any) => {
                    console.error("AlphaTab error:", e);
                    if (!cancelled) {
                        setError(
                            e?.message ||
                                "An error occurred rendering the lick."
                        );
                        setIsLoading(false);
                    }
                });

                api.tex(texBody);
            } catch (err: any) {
                if (!cancelled) {
                    console.error("LickCard init error:", err);
                    setError(err?.message || "Failed to load lick.");
                    setIsLoading(false);
                }
            }
        };

        init();

        return () => {
            cancelled = true;
            destroyApi();
        };
    }, [isExpanded, lick.path, destroyApi]);

    const handlePlayPause = () => {
        if (apiRef.current) {
            apiRef.current.playPause();
        }
    };

    const handleStop = () => {
        if (apiRef.current) {
            apiRef.current.stop();
        }
    };

    /** Seek to a position by clicking on the progress bar */
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!apiRef.current || endTime <= 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = Math.max(
            0,
            Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        apiRef.current.timePosition = fraction * endTime;
    };

    const progressPercent =
        endTime > 0 ? Math.min(100, (currentTime / endTime) * 100) : 0;

    return (
        <div className="m-auto my-4 w-4/5 border border-gray-300 dark:border-gray-600">
            {/* Header - always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <div>
                    <h3 className="text-2xl">{lick.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {lick.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded px-2 py-1 bg-blue-600 text-white text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                        <span className="rounded px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm">
                            {lick.key}
                        </span>
                        <span className="rounded px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm">
                            {lick.tempo} BPM
                        </span>
                    </div>
                </div>
                <span className="text-2xl">
                    {isExpanded ? "\u25B2" : "\u25BC"}
                </span>
            </button>

            {/* Expanded content */}
            {isExpanded && (
                <div className="border-t border-gray-300 dark:border-gray-600">
                    {error && (
                        <div className="m-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    {isLoading && (
                        <div className="m-4 text-gray-500 dark:text-gray-400">
                            Loading notation...
                        </div>
                    )}

                    {/* AlphaTab viewport */}
                    <div
                        ref={viewportRef}
                        className="at-viewport relative overflow-auto bg-white"
                        style={{ maxHeight: "500px" }}
                    >
                        <div ref={containerRef} />
                    </div>

                    {/* Player bar — footer style inspired by AlphaTab demo */}
                    <div className="flex flex-col bg-[#436d9d] dark:bg-[#2d4a6a] text-white">
                        {/* Progress bar — clickable for seeking */}
                        <div
                            className="h-1.5 w-full cursor-pointer bg-white/20"
                            onClick={handleProgressClick}
                            title="Seek"
                        >
                            <div
                                className="h-full bg-white/80 transition-[width] duration-200"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        {/* Controls row */}
                        <div className="flex items-center gap-1 px-3 py-2">
                            {/* Stop */}
                            <button
                                onClick={handleStop}
                                disabled={!playerReady}
                                className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Stop"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M6 6h12v12H6z" />
                                </svg>
                            </button>

                            {/* Play / Pause */}
                            <button
                                onClick={handlePlayPause}
                                disabled={!playerReady}
                                className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                                title={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5 fill-current"
                                    >
                                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5 fill-current"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            {/* Time display */}
                            <span className="ml-2 font-mono text-sm tabular-nums">
                                {formatDuration(currentTime)}
                                {" / "}
                                {formatDuration(endTime)}
                            </span>

                            {/* Spacer */}
                            <span className="flex-1" />

                            {/* Player loading state */}
                            {!playerReady && !error && (
                                <span className="text-xs text-white/60">
                                    Loading player...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
