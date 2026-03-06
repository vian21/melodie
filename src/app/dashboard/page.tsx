"use client";
import useStorage, { Storage } from "~/util/Storage";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Colors,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";

import { Pie } from "react-chartjs-2";
import { Training } from "~/util/library";
import { useState, useMemo } from "react";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Colors,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

export default function Dashboard() {
    const storage = useStorage();
    const [view, setView] = useState("General");

    return (
        <div className="p-4">
            <center>
                <select
                    className="text-bold m-auto p-3 text-black"
                    onChange={(e) => {
                        setView(e.target.value);
                    }}
                >
                    <option value="General">General</option>
                    <option value={Training.CHORD_PROGRESSION}>
                        Chord Progression
                    </option>
                    <option value={Training.MELODY}>Melody</option>
                    <option value={Training.INTERVAL}>Intervals</option>
                </select>
            </center>
            <div className="w-95 m-auto mt-5">{renderView(view, storage)}</div>
        </div>
    );
}

function renderView(view: string, storage: Storage | null) {
    if (!storage) {
        return <div className="text-center">Loading...</div>;
    }

    switch (view) {
        case "General":
            return <Overall storage={storage} />;
        default:
            return <TrainingStat training={view} storage={storage} />;
    }
}

function getAllDatesData(storage: Storage, training: Training): number[][] {
    const allData: number[][] = Array.from({ length: 8 }, () => [0, 0]);

    const rawData = localStorage.getItem(training);
    if (!rawData) return allData;

    const db = JSON.parse(rawData);

    Object.keys(db).forEach((date) => {
        const dateData = db[date];
        if (Array.isArray(dateData)) {
            dateData.forEach((record: number[], index: number) => {
                if (Array.isArray(record) && record.length >= 2) {
                    allData[index]![0] += record[0] || 0;
                    allData[index]![1] += record[1] || 0;
                }
            });
        }
    });

    return allData;
}

function Overall({ storage }: { storage: Storage }) {
    const statsData = useMemo(() => {
        return (Object.keys(Training) as Array<keyof typeof Training>).map(
            (training) => {
                const data = getAllDatesData(storage, Training[training]);
                return {
                    name: training,
                    data: data[0] || [0, 0],
                };
            }
        );
    }, [storage]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {statsData.map(({ name, data }, i) => {
                const correct = data[0] || 0;
                const total = data[1] || 0;
                const accuracy =
                    total > 0 ? ((correct / total) * 100).toFixed(1) : "0.0";

                return (
                    <div
                        key={i}
                        className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                    >
                        <h1 className="text-center text-2xl font-bold">
                            {name.replace(/_/g, " ")}
                        </h1>
                        <div className="my-3 text-center text-sm text-gray-400">
                            <p>Total Attempts: {total}</p>
                            <p>Correct: {correct}</p>
                            <p>Accuracy: {accuracy}%</p>
                        </div>
                        {total > 0 ? (
                            <div
                                className="mx-auto"
                                style={{ maxWidth: "300px" }}
                            >
                                <Pie
                                    data={{
                                        labels: ["Correct", "Incorrect"],
                                        datasets: [
                                            {
                                                label: "Count",
                                                data: [
                                                    correct,
                                                    total - correct,
                                                ],
                                                backgroundColor: [
                                                    "rgba(134, 239, 172, 0.8)",
                                                    "rgba(252, 165, 165, 0.8)",
                                                ],
                                                borderColor: [
                                                    "rgba(134, 239, 172, 0.8)",
                                                    "rgba(252, 165, 165, 0.8)",
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: "white",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                No data yet
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function getRatio(data: number[]): number[] {
    const correct = data[0] || 0;
    const total = data[1] || 0;
    if (total === 0) return [0, 100];

    const correctPercent = (correct / total) * 100;
    const incorrectPercent = ((total - correct) / total) * 100;

    return [correctPercent, incorrectPercent];
}

function TrainingStat({
    training,
    storage,
}: {
    training: string;
    storage: Storage;
}) {
    const degreeNames = [
        "Overall",
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
    ];

    const statsData = useMemo(() => {
        const data = getAllDatesData(storage, training as Training);
        return data.map((record, i) => ({
            name: degreeNames[i]!,
            data: record,
        }));
    }, [storage, training]);

    return (
        <div className="my-3">
            <h1 className="mb-6 text-center text-3xl font-bold">
                {training.replace(/_/g, " ")}
            </h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {statsData.map(({ name, data }, i) => {
                    const correct = data[0] || 0;
                    const total = data[1] || 0;
                    const accuracy =
                        total > 0
                            ? ((correct / total) * 100).toFixed(1)
                            : "0.0";

                    return (
                        <div
                            key={i}
                            className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                        >
                            <h2 className="text-center text-xl font-bold">
                                {name} {i > 0 ? "Degree" : ""}
                            </h2>
                            <div className="my-3 text-center text-sm text-gray-400">
                                <p>Total Attempts: {total}</p>
                                <p>Correct: {correct}</p>
                                <p>Accuracy: {accuracy}%</p>
                            </div>
                            {total > 0 ? (
                                <div
                                    className="mx-auto"
                                    style={{ maxWidth: "300px" }}
                                >
                                    <Pie
                                        data={{
                                            labels: ["Correct", "Incorrect"],
                                            datasets: [
                                                {
                                                    label: "Percentage",
                                                    data: getRatio(data),
                                                    backgroundColor: [
                                                        "rgba(134, 239, 172, 0.8)",
                                                        "rgba(252, 165, 165, 0.8)",
                                                    ],
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: "white",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    No data yet
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
