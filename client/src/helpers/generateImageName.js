export function getMangaPageName(mangaName, volume = null, chapter, pageNum, fileFormat) {
    const mangaNameProcessed = mangaName.replaceAll(' ', '_');
    return `${mangaNameProcessed}_${volume ? volume : '0'}_${chapter}_${pageNum}.${fileFormat}`;
}

export function getThumbnailName(mangaName, fileFormat) {
    const mangaNameProcessed = mangaName.replaceAll(' ', '_');
    return `thumb_${mangaNameProcessed}.${fileFormat}`;
}

export function getProfilePhotoName(userId, fileFormat) {
    return `user_${userId}.${fileFormat}`;
}
