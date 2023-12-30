"use client";
import { useEffect, useState } from "react";
import Logger from "./Logger";
import { Training } from "./library";

const STAT_RECORD_INIT = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
];

type STAT_INDEX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}

/**
 * Local Storage utility class
 */
export class _Storage {
    date = "";

    constructor() {
        this.date = getCurrentDate();
    }

    save(training: Training, date: string, data: number[][]) {
        const db = JSON.parse(localStorage.getItem(training) || "{}");

        db[date] = data;
        localStorage.setItem(training, JSON.stringify(db));
    }

    get(training: Training, date: string) {
        const db = JSON.parse(localStorage.getItem(training) || "{}");

        if (db[date] == null) {
            this.initializeRecord(training, date);
            return STAT_RECORD_INIT;
        }

        return db[date];
    }

    /**
     * increment tally[correct_tries, number of tries] for specified scale degree or training
     * @param type - 0-7 specifying which count to increment. 0: overall count, 1: count for tonic degree, 2: count for second degree, ...
     */
    increment(training: Training, type: number, increment: 0 | 1) {
        const db = JSON.parse(localStorage.getItem(training) || "{}");

        if (db[this.date] == null) {
            db[this.date] = STAT_RECORD_INIT;
        }

        db[this.date][type][0] += increment;
        db[this.date][type][1]++;

        localStorage.setItem(training, JSON.stringify(db));
        Logger.log("Incremented " + this.date + " ,type: " + type);
    }

    initializeRecord(training: Training, date: string) {
        const db = JSON.parse(localStorage.getItem(training) || "{}");

        db[date] = STAT_RECORD_INIT;

        localStorage.setItem(training, JSON.stringify(db));
    }
}

export default function useStorage() {
    const [storage, setStorage] = useState<_Storage | null>(null);

    useEffect(() => {
        const storage = new _Storage();

        Logger.log("Storage loaded");
        setStorage(storage);

        return () => {
            if (storage) {
                setStorage(null);
            }
        };
    }, []);

    return storage;
}
