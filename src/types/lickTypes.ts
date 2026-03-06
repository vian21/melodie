export interface LickIndexEntry {
    id: string;
    title: string;
    tags: string[];
    tempo: number;
    key: string;
    path: string;
}

export interface LickFilter {
    tags?: string[];
    searchTerm?: string;
    key?: string;
}
