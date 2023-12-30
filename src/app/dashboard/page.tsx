"use client";
import useStorage from "~/util/Storage";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Colors,
} from "chart.js";

import { Pie } from "react-chartjs-2";
import { Training } from "~/util/library";
import { useState } from "react";
import Logger from "~/util/Logger";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function Dashboard() {
    const storage = useStorage();
    console.log(storage?.get(Training.CHORD_PROGRESSION, "2023-12-27")[0]);
    const [view, setView] = useState("General");

    return (
        <div>
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
            <div className="w-95 m-auto mt-5 lg:w-4/12">
                {renderView(view, storage)}
            </div>
        </div>
    );
}

function renderView(view: string, storage: any) {
    switch (view) {
        case "General":
            return <Overall storage={storage} />;
        default:
            return <TrainingStat training={view} storage={storage} />;
    }
}
function Overall({ storage }) {
    return (
        <>
            {(Object.keys(Training) as Array<keyof typeof Training>).map(
                (training, i) => {
                    return (
                        <div className="my-3">
                            <h1 className="text-center text-2xl font-bold">
                                {training}
                            </h1>
                            <Pie
                                data={{
                                    labels: ["correct", "Incorrect"],
                                    datasets: [
                                        {
                                            label: "Percentage",
                                            data: getRatio(
                                                storage?.get(
                                                    Training[training],
                                                    "2023-12-27",
                                                )[0] || [0, 0],
                                            ),
                                        },
                                    ],
                                }}
                            />
                        </div>
                    );
                },
            )}
        </>
    );
}

function getRatio(data: number[]) {
    return [
        (data[0]! * 100) / data[1]!,
        ((data[1]! - data[0]!) * 100) / data[1]!,
    ];
}

function TrainingStat({ training, storage }) {
    Logger.log("Rendering", training);
    const stats = ["Overall", "1", "2", "3", "4", "5", "6", "7"];
    return (
        <div className="my-3">
            <h1 className="text-center text-2xl font-bold">{training}</h1>
            {Array.from({ length: 8 }, (_, i) => i).map((i) => {
                return (
                    <>
                        <h1 className="text-center text-2xl font-bold">
                            {stats[i]}
                        </h1>

                        <Pie
                            data={{
                                labels: ["correct", "Incorrect"],
                                datasets: [
                                    {
                                        label: "Percentage",
                                        data: getRatio(
                                            storage?.get(
                                                Training[training],
                                                "2023-12-27",
                                            )[i] || [0, 0],
                                        ),
                                    },
                                ],
                            }}
                        />
                    </>
                );
            })}
        </div>
    );
}
