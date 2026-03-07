"use client";

import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    Colors,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Training } from "~/util/library";
import { useState, useEffect, useCallback } from "react";
import {
    type Attempt,
    TimeRange,
    getAttempts,
    computeAccuracy,
    groupByDate,
} from "~/util/db";

ChartJS.register(
    Tooltip,
    Legend,
    Colors,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
);

/** Human-readable labels for each time range option. */
const TIME_RANGE_LABELS: Record<TimeRange, string> = {
    [TimeRange.TODAY]: "Today",
    [TimeRange.WEEK]: "This Week",
    [TimeRange.LAST_30_DAYS]: "Last 30 Days",
    [TimeRange.THIS_YEAR]: "This Year",
    [TimeRange.ALL_TIME]: "All Time",
};

/** Human-readable labels for each training mode. */
const TRAINING_LABELS: Record<Training, string> = {
    [Training.CHORD_PROGRESSION]: "Chord Progression",
    [Training.MELODY]: "Melody",
    [Training.INTERVAL]: "Intervals",
};

export default function Dashboard() {
    const [view, setView] = useState("General");
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.ALL_TIME);

    return (
        <div className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
                <select
                    className="border border-gray-300 bg-white p-3 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                >
                    <option value="General">General</option>
                    {Object.values(Training).map((t) => (
                        <option key={t} value={t}>
                            {TRAINING_LABELS[t]}
                        </option>
                    ))}
                </select>

                <select
                    className="border border-gray-300 bg-white p-3 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                >
                    {Object.values(TimeRange).map((range) => (
                        <option key={range} value={range}>
                            {TIME_RANGE_LABELS[range]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-95 m-auto mt-5">
                {view === "General" ? (
                    <OverallView timeRange={timeRange} />
                ) : (
                    <TrainingView
                        training={view as Training}
                        timeRange={timeRange}
                    />
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Overall View - one card per training mode
// ---------------------------------------------------------------------------

/**
 * Displays a summary card with a line chart for each training mode.
 */
function OverallView({ timeRange }: { timeRange: TimeRange }) {
    const [data, setData] = useState<Record<Training, Attempt[]>>({
        [Training.CHORD_PROGRESSION]: [],
        [Training.MELODY]: [],
        [Training.INTERVAL]: [],
    });

    useEffect(() => {
        async function load() {
            const [chords, melody, intervals] = await Promise.all([
                getAttempts(Training.CHORD_PROGRESSION, timeRange),
                getAttempts(Training.MELODY, timeRange),
                getAttempts(Training.INTERVAL, timeRange),
            ]);
            setData({
                [Training.CHORD_PROGRESSION]: chords,
                [Training.MELODY]: melody,
                [Training.INTERVAL]: intervals,
            });
        }
        void load();
    }, [timeRange]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {Object.values(Training).map((training) => {
                const attempts = data[training];
                const accuracy = computeAccuracy(attempts);
                const total = attempts.length;

                return (
                    <StatsCard
                        key={training}
                        title={TRAINING_LABELS[training]}
                        attempts={attempts}
                        accuracy={accuracy}
                        total={total}
                        timeRange={timeRange}
                    />
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Training-specific View - overall + per-degree breakdown
// ---------------------------------------------------------------------------

/** Degree labels for indices 1-7. */
const DEGREE_NAMES = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

/**
 * Displays detailed stats for a single training mode:
 * an overall card plus one card per scale degree (1st-7th).
 */
function TrainingView({
    training,
    timeRange,
}: {
    training: Training;
    timeRange: TimeRange;
}) {
    const [attempts, setAttempts] = useState<Attempt[]>([]);

    useEffect(() => {
        void getAttempts(training, timeRange).then(setAttempts);
    }, [training, timeRange]);

    /** Filters attempts to only the results for a specific degree. */
    const getDegreeAttempts = useCallback(
        (degree: number): Attempt[] => {
            return attempts
                .map((a) => {
                    const indices: number[] = [];
                    a.degrees.forEach((d, i) => {
                        if (d === degree) indices.push(i);
                    });
                    if (indices.length === 0) return null;
                    return {
                        ...a,
                        degrees: indices.map((i) => a.degrees[i]!),
                        guesses: indices.map((i) => a.guesses[i]!),
                        results: indices.map((i) => a.results[i]!),
                        length: indices.length,
                    };
                })
                .filter((a): a is Attempt => a !== null);
        },
        [attempts]
    );

    const overallAccuracy = computeAccuracy(attempts);

    return (
        <div className="my-3">
            <h1 className="mb-6 text-center text-3xl font-bold">
                {TRAINING_LABELS[training]}
            </h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <StatsCard
                    title="Overall"
                    attempts={attempts}
                    accuracy={overallAccuracy}
                    total={attempts.length}
                    timeRange={timeRange}
                />
                {DEGREE_NAMES.map((name, i) => {
                    const degree = i + 1;
                    const degreeAttempts = getDegreeAttempts(degree);
                    const acc = computeAccuracy(degreeAttempts);
                    return (
                        <StatsCard
                            key={degree}
                            title={`${name} Degree`}
                            attempts={degreeAttempts}
                            accuracy={acc}
                            total={degreeAttempts.length}
                            timeRange={timeRange}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Reusable Stats Card with Line Chart
// ---------------------------------------------------------------------------

/**
 * A card displaying total attempts, accuracy %, and a line chart.
 *
 * - For {@link TimeRange.TODAY}: X-axis = attempt index, Y-axis = per-attempt accuracy %.
 * - For other ranges: X-axis = date (YYYY-MM-DD), Y-axis = daily aggregated accuracy %.
 */
function StatsCard({
    title,
    attempts,
    accuracy,
    total,
    timeRange,
}: {
    title: string;
    attempts: Attempt[];
    accuracy: number;
    total: number;
    timeRange: TimeRange;
}) {
    const chartData = buildChartData(attempts, timeRange);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <h2 className="text-center text-xl font-bold">{title}</h2>
            <div className="my-3 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>Total Attempts: {total}</p>
                <p>Accuracy: {accuracy.toFixed(1)}%</p>
            </div>
            {total > 0 ? (
                <div className="mx-auto" style={{ maxWidth: "400px" }}>
                    <Line
                        data={{
                            labels: chartData.labels,
                            datasets: [
                                {
                                    label: "Accuracy %",
                                    data: chartData.values,
                                    borderColor: "rgba(134, 239, 172, 0.9)",
                                    backgroundColor:
                                        "rgba(134, 239, 172, 0.15)",
                                    fill: true,
                                    tension: 0.3,
                                    pointRadius: 3,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    min: 0,
                                    max: 100,
                                    ticks: { color: "#9ca3af" },
                                    grid: {
                                        color: "rgba(255,255,255,0.05)",
                                    },
                                    title: {
                                        display: true,
                                        text: "Accuracy %",
                                        color: "#9ca3af",
                                    },
                                },
                                x: {
                                    ticks: {
                                        color: "#9ca3af",
                                        maxRotation: 45,
                                    },
                                    grid: {
                                        color: "rgba(255,255,255,0.05)",
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    labels: { color: "white" },
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No data yet
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Chart data builders
// ---------------------------------------------------------------------------

interface ChartData {
    labels: string[];
    values: number[];
}

/**
 * Builds the labels and values for the line chart depending on time range.
 *
 * - **Today**: each data point is one attempt, showing that attempt's accuracy.
 * - **Other ranges**: data points are grouped by day, showing daily accuracy.
 *
 * @param attempts - The attempts to visualize (already filtered by time range).
 * @param timeRange - The active time range selection.
 */
function buildChartData(attempts: Attempt[], timeRange: TimeRange): ChartData {
    if (attempts.length === 0) return { labels: [], values: [] };

    if (timeRange === TimeRange.TODAY) {
        return buildPerAttemptData(attempts);
    }

    return buildDailyData(attempts);
}

/**
 * One data point per attempt.
 * Label = attempt index (1, 2, 3, ...).
 * Value = percentage of correct notes in that attempt.
 */
function buildPerAttemptData(attempts: Attempt[]): ChartData {
    const labels: string[] = [];
    const values: number[] = [];

    attempts.forEach((attempt, i) => {
        labels.push(String(i + 1));
        const correct = attempt.results.filter((r) => r === 1).length;
        const total = attempt.results.length;
        values.push(total > 0 ? (correct / total) * 100 : 0);
    });

    return { labels, values };
}

/**
 * One data point per calendar day.
 * Label = date string (YYYY-MM-DD).
 * Value = aggregated accuracy % across all attempts that day.
 */
function buildDailyData(attempts: Attempt[]): ChartData {
    const grouped = groupByDate(attempts);
    const labels: string[] = [];
    const values: number[] = [];

    // Map is insertion-ordered and attempts are sorted by timestamp,
    // so iteration order is chronological.
    grouped.forEach((dayAttempts, dateStr) => {
        labels.push(dateStr);
        values.push(computeAccuracy(dayAttempts));
    });

    return { labels, values };
}
