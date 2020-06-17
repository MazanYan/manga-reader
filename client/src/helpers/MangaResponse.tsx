export interface MangaResponse {
    name: string,
    author: string,
    description: string,
    manga_key: string,
    bookmarks_count: Number,
    create_time: Date,
    update_time: Date,
    thumbnail: string,
    file_format: string
};

export interface TableOfContentsResponse {
    volume: number,
    number: number,
    name: string
};
