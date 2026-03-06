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

// type STAT_INDEX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface AttemptMetadata {
    timestamp: number;
    responseTime: number;
    speed: number;
    octave: number;
    length: number;
    degrees: number[];
    guesses: number[];
    results: number[];
}

export interface DetailedStats {
    attempts: AttemptMetadata[];
    confusionMatrix: { [key: string]: number };
}

function getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}

type StorageObject = Record<string, number[][]>;

export class Storage {
    date = "";

    constructor() {
        this.date = getCurrentDate();
    }

    save(training: Training, date: string, data: number[][]) {
        const db: StorageObject = JSON.parse(
            localStorage.getItem(training) ?? "{}"
        ) as StorageObject;

        db[date] = data;
        localStorage.setItem(training, JSON.stringify(db));
    }

    get(training: Training, date: string) {
        const db: StorageObject = JSON.parse(
            localStorage.getItem(training) ?? "{}"
        ) as StorageObject;

        if (db.date == null) {
            this.initializeRecord(training, date);
            return STAT_RECORD_INIT;
        }

        return db.date;
    }

    increment(training: Training, type: number, increment: 0 | 1) {
        const db: StorageObject = JSON.parse(
            localStorage.getItem(training) ?? "{}"
        ) as StorageObject;

        if (db.date == null) {
            db.date = STAT_RECORD_INIT;
        }

        db.date[type]![0] += increment;
        db.date[type]![1]++;

        localStorage.setItem(training, JSON.stringify(db));
        Logger.log("Incremented " + this.date + " ,type: " + type);
    }

    initializeRecord(training: Training, date: string) {
        const db: StorageObject = JSON.parse(
            localStorage.getItem(training) ?? "{}"
        ) as StorageObject;

        db[date] = STAT_RECORD_INIT;

        localStorage.setItem(training, JSON.stringify(db));
    }

    saveAttempt(training: Training, metadata: AttemptMetadata) {
        const key = `${training}_detailed`;
        const db = JSON.parse(
            localStorage.getItem(key) ||
                '{"attempts": [], "confusionMatrix": {}}'
        );

        db.attempts.push(metadata);

        metadata.degrees.forEach((actual, i) => {
            const guess = metadata.guesses[i];
            if (guess !== undefined && actual !== guess) {
                const confusionKey = `${actual}->${guess}`;
                db.confusionMatrix[confusionKey] =
                    (db.confusionMatrix[confusionKey] || 0) + 1;
            }
        });

        localStorage.setItem(key, JSON.stringify(db));
    }

    getDetailedStats(training: Training): DetailedStats {
        const key = `${training}_detailed`;
        const db = JSON.parse(
            localStorage.getItem(key) ||
                '{"attempts": [], "confusionMatrix": {}}'
        );
        return db;
    }

    getProgressionTrend(
        training: Training,
        days: number = 30
    ): Array<{ date: string; accuracy: number }> {
        const db = JSON.parse(localStorage.getItem(training) || "{}");
        const dates = Object.keys(db).sort().slice(-days);

        return dates.map((date) => {
            const data = db[date];
            if (data && data[0] && data[0][1] > 0) {
                return {
                    date,
                    accuracy: (data[0][0] / data[0][1]) * 100,
                };
            }
            return { date, accuracy: 0 };
        });
    }
}

export default function useStorage() {
    const [storage, setStorage] = useState<Storage | null>(null);

    useEffect(() => {
        const storage = new Storage();

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
