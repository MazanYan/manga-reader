export interface MangaResponse {
    name: string;
    author: string;
    description: string;
    manga_key: string;
    bookmarks_count: Number;
    create_time: Date;
};

export interface TableOfContentsResponse {
    volume: number,
    number: number,
    name: string
};
