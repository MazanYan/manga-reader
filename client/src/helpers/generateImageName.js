export function getMangaPageName(mangaName, volume = null, chapter, fileFormat) {
    const mangaNameProcessed = mangaName.replaceAll(' ', '_');
    return `${mangaNameProcessed}_${volume ? volume : '0'}_${chapter}.${fileFormat}`;
}

export function getThumbnailName(mangaName, fileFormat) {
    const mangaNameProcessed = mangaName.replaceAll(' ', '_');
    return `thumb_${mangaNameProcessed}_${new Date().getTime()}.${fileFormat}`;
}

export function getProfilePhotoName(userId, fileFormat) {
    return `user_${userId}_${new Date().getTime()}.${fileFormat}`;
}
