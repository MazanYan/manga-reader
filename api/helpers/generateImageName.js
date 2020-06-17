function getMangaPageName(mangaName, volume = null, chapter, fileFormat) {
    const mangaNameProcessed = mangaName.replace(' ', '_');
    return `${mangaNameProcessed}_${volume ? volume : '0'}_${chapter}.${fileFormat}`;
}

function getThumbnailName(mangaName, fileFormat) {
    const mangaNameProcessed = mangaName.replace(' ', '_');
    return `thumb_${mangaNameProcessed}_${new Date().getTime()}.${fileFormat}`;
}

function getProfilePhotoName(userId, fileFormat) {
    return `user_${userId}_${new Date().getTime()}.${fileFormat}`;
}

console.log(getThumbnailName('Fullmetal Alchemist', 'jpg'));

module.exports = {
    mangaPage: getMangaPageName,
    thumbnail: getThumbnailName,
    profilePhoto: getProfilePhotoName
};
