"use client";

import { useState, useEffect } from "react";
import { Lick, LickFilter } from "./library";

import { env } from "~/env.mjs";

export class LickStorage {
    private licks: Lick[] = [];
    private loaded: boolean = false;

    async loadLicks(): Promise<void> {
        if (this.loaded) return;

        try {
            const response = await fetch(
                `${env.NEXT_PUBLIC_BASEPATH}/data/licks.json`
            );
            const jsonLicks = await response.json();
            this.licks = jsonLicks as Lick[];

            const customLicksStr = localStorage.getItem("custom_licks");
            if (customLicksStr) {
                const customLicks = JSON.parse(customLicksStr) as Lick[];
                this.licks = [...this.licks, ...customLicks];
            }

            this.loaded = true;
        } catch (error) {
            const msg = `Failed to load licks: ${error}`;
            console.error(msg);
            alert(msg);

            this.licks = [];
            this.loaded = true;
        }
    }

    getAllLicks(): Lick[] {
        return [...this.licks];
    }

    getLickById(id: string): Lick | undefined {
        return this.licks.find((lick) => lick.id === id);
    }

    filterLicks(filter: LickFilter): Lick[] {
        return this.licks.filter((lick) => {
            if (filter.tags && filter.tags.length > 0) {
                const hasTag = filter.tags.some((tag) =>
                    lick.tags.includes(tag)
                );
                if (!hasTag) return false;
            }

            if (filter.overChords && filter.overChords.length > 0) {
                const hasChord = filter.overChords.every((chord) =>
                    lick.context.overChords.includes(chord)
                );
                if (!hasChord) return false;
            }

            if (filter.inKey && lick.context.inKey !== filter.inKey) {
                return false;
            }

            if (filter.searchTerm) {
                const term = filter.searchTerm.toLowerCase();
                const inName = lick.name.toLowerCase().includes(term);
                const inDesc = lick.description.toLowerCase().includes(term);
                if (!inName && !inDesc) return false;
            }

            return true;
        });
    }

    searchLicks(searchTerm: string): Lick[] {
        const term = searchTerm.toLowerCase();
        return this.licks.filter(
            (lick) =>
                lick.name.toLowerCase().includes(term) ||
                lick.description.toLowerCase().includes(term) ||
                lick.tags.some((tag) => tag.toLowerCase().includes(term))
        );
    }

    getAllTags(): string[] {
        const tagSet = new Set<string>();
        this.licks.forEach((lick) => {
            lick.tags.forEach((tag) => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }

    getLicksByChordContext(chordDegrees: number[]): Lick[] {
        return this.licks.filter((lick) =>
            chordDegrees.every((chord) =>
                lick.context.overChords.includes(chord)
            )
        );
    }

    addLick(lick: Lick): void {
        this.licks.push(lick);
        this.saveCustomLicks();
    }

    updateLick(lick: Lick): void {
        const index = this.licks.findIndex((l) => l.id === lick.id);
        if (index !== -1) {
            this.licks[index] = lick;
            this.saveCustomLicks();
        }
    }

    deleteLick(id: string): void {
        this.licks = this.licks.filter((lick) => lick.id !== id);
        this.saveCustomLicks();
    }

    private saveCustomLicks(): void {
        const customLicks = this.licks.filter((lick) =>
            lick.id.startsWith("custom-")
        );
        localStorage.setItem("custom_licks", JSON.stringify(customLicks));
    }

    exportLicks(): string {
        return JSON.stringify(this.licks, null, 2);
    }

    importLicks(json: string): void {
        try {
            const imported = JSON.parse(json) as Lick[];
            imported.forEach((lick) => {
                if (!this.licks.find((l) => l.id === lick.id)) {
                    this.licks.push(lick);
                }
            });
            this.saveCustomLicks();
        } catch (error) {
            console.error("Failed to import licks:", error);
        }
    }
}

export default function useLickStorage(): LickStorage | null {
    const [storage, setStorage] = useState<LickStorage | null>(null);

    useEffect(() => {
        const lickStorage = new LickStorage();
        lickStorage.loadLicks().then(() => {
            setStorage(lickStorage);
        });
    }, []);

    return storage;
}
