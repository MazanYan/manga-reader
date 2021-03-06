export enum MangaStatus {
    finished, ongoing
}

export interface MangaResponse {
    name: string,
    author: string,
    description: string,
    manga_key: string,
    bookmarks_count: Number,
    create_time: string,
    last_modify_time: string,
    thumbnail: string,
    time_completed: string,
    manga_status: MangaStatus,
    chapters_count?: number
};

export interface TableOfContentsResponse {
    volume: number,
    number: number,
    name: string
};
