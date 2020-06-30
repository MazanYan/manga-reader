require('dotenv').config();

const initOptions = {
    error(error, e) {
        if (e.cn) {
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};
const crypto = require('crypto');   // generateRandomBytes
const cryptoJS = require('crypto-js');  // other hashing algorithms
const pgp = require('pg-promise')(initOptions);

const databaseConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const db = pgp(databaseConfig);

async function performQuery(query, ...data) {
    try {
        const result = await db.query(query, ...data);
        console.log('Query completed');
        console.log(result);
        return Promise.resolve(result);
    }
    catch (error) {
        const myError = 'ERROR:' + (error.message || error);
        console.log(myError);
        return Promise.reject(myError);
    }
}

function createPasswordSalt(passw) {
    const salt = crypto.randomBytes(20).toString('hex');
    const hashedPassw = cryptoJS.SHA256(passw + salt).toString();
    return [salt, hashedPassw];
}

async function getUserByEmailOrUsername(usernameEmail) {
    return await performQuery(
        `SELECT id, name FROM account 
            WHERE name=$1 OR email=$1 LIMIT 1;`,
        [usernameEmail]);
}

async function getUserByEmail(email) {
    return await performQuery(
        `SELECT id, name FROM account 
            WHERE email=$1 LIMIT 1;`,
        [email]);
}

async function getUserName(userId) {
    return await performQuery(
        `SELECT name FROM account 
            WHERE id=$1;`,
        [userId]);
}

async function getUserPageData(userId) {
    return await performQuery(
        `SELECT name, is_online, photo, description FROM account
            WHERE id=$1;`,
        [userId]);
}

async function checkPassword(userId, password) {
    console.log(`Initial toSearch: ${userId} ${password}`);
    const salt = (await performQuery(
        'SELECT salt FROM salts WHERE salts.id=$1', userId
    ))[0].salt;
    const hashedPassword = cryptoJS.SHA256(password + salt).toString();
    const correctPassword = (await performQuery(
        'SELECT passw_hashed FROM account WHERE account.id=$1', userId
    ))[0].passw_hashed;
    
    console.log(`Salt ${salt}`);
    console.log(`Hashed passw ${hashedPassword}`);
    console.log(`Correct passw ${correctPassword}`);
    return hashedPassword === correctPassword;
}

async function createUser({name, email, passw, photo = null, descr = null}) {
    const accId = cryptoJS.MD5(email + name).toString();
    const [salt, hashedPassw] = createPasswordSalt(passw);
    const token = crypto.randomBytes(20).toString('hex');

    const response = [];

    const userAddResponse = await performQuery(
        'INSERT INTO public.account(${this:name}) VALUES (${this:csv});',
        {
            id: accId,
            name: name,
            registration_time: 'NOW()',
            is_online: false,
            last_online: 'NOW()',
            photo: null,
            description: descr,
            passw_hashed: hashedPassw,
            type: 'user',
            email: email,
            confirmed: false
        }
    );
    response.push(userAddResponse);    
    const saltResponse = await performQuery(
        'INSERT INTO salts(id, salt) VALUES ($1, $2)',
        [accId, salt]
    );
    const confirmStatusResponse = await performQuery(
        'INSERT INTO user_registration(${this:name}) VALUES(${this:csv})',
        {
            id: accId,
            token: token,
            token_create_time: 'NOW()'
        }
    );

    response.push(saltResponse);
    response.push(confirmStatusResponse);

    return [response, token];
}

async function confirmUserByToken(token, timeToLive) {
    const response = await performQuery(
        `UPDATE account
            SET confirmed=true 
            WHERE id=(SELECT id FROM user_registration
                WHERE (NOW() - token_create_time) < $1
                AND token=$2);
        DELETE FROM user_registration WHERE token=$2;`,
        [timeToLive, token]
    );
    console.log(response);
    return response;
}

async function createPasswordResetToken(userId) {
    const token = crypto.randomBytes(20).toString('hex');
    const queryPromise = performQuery(
        `INSERT INTO passw_change_tokens(id, token) VALUES($1, $2);`,
        [userId, token]
    );
    return token;
}

async function resetPassword(token, newPassword) {
    const userId = (await performQuery(
        `SELECT id FROM passw_change_tokens WHERE token=$1;`, [token]
    ))[0].id;
    console.log("User");
    console.log(userId);
    const [salt, newPasswordHashed] = createPasswordSalt(newPassword);
    return performQuery(
        `UPDATE account
            SET passw_hashed=$2 WHERE id=$1;
        UPDATE salts
            SET salt=$3 WHERE id=$1;
        DELETE FROM passw_change_tokens WHERE id=$1;`,
        [userId, newPasswordHashed, salt]
    );
}

async function addManga({mangaName, author, descr, thumbnail, timeStart, status, timeEnd = null}) {
    return performQuery(
        'INSERT INTO manga(${this:name}) VALUES(${this:csv});',
        {
            name: mangaName,
            author: author,
            description: descr,
            create_time: timeStart,
            last_modify_time: 'NOW()',
            bookmarks_count: 0,
            thumbnail: thumbnail,
            manga_status: status,
            time_completed: timeEnd
        }
    );
}

async function createBookmark({accId, mangaKey, chapter = null, page = null}) {
    return performQuery(
        'INSERT INTO bookmark(${this:name}) VALUES(${this:csv});',
        {
            account: accId,
            manga_key: mangaKey,
            chapter: chapter,
            page: page,
            first_bookmark: true
        }
    );
}

async function addComment({author, page, text, answerOn = null}) {
    const commentId = crypt.MD5(string(page) + new Date().toLocaleString());
    return performQuery(
        'INSERT INTO comment(${this:name}) VALUES(${this:csv});',
        {
            comment_id: commentId,
            author: author,
            page_key: page,
            text: text,
            rating: 0,
            time_added: 'NOW()',
            answer_on: andwerOn
        }
    );
}

async function addChapter({mangaName, chapterName, chapterNumber, chapterVolume = null, images}) {
    const pagesCount = images.length;
    const pageNumbers = [...Array(pagesCount).keys()].map(i => i + 1);
    const arrToStr = (arr) => {
        return '[' + arr.map(el => '\'' + el + '\'').join(', ') + ']';
    }
    const arrToStrInts = (arr) => {
        return '[' + arr.join(', ') + ']';
    }
    return performQuery(
        'INSERT INTO chapter(manga_key, name, number, volume, pages_count, add_time)' +
            'VALUES ((SELECT manga_key FROM manga WHERE manga.name=${manga_name} LIMIT 1),' +
                     '${name}, ${number}, ${volume}, ${pages_count}, NOW());' +
        'INSERT INTO manga_page(image, page_number, chapter_key)' +
            'SELECT unnest(array' + arrToStr(images) + '), unnest(array' + arrToStrInts(pageNumbers) + '),' +
            '(SELECT chapter_key FROM chapter WHERE chapter.name=${name} LIMIT 1);',
        {
            manga_name: mangaName,
            name: chapterName,
            number: chapterNumber,
            volume: chapterVolume,
            pages_count: pagesCount
        }
    );
}

async function createNotification({acc, text, author}) {
    const notificationId = crypt.MD5(string(acc) + author + new Date().toLocaleString());
    return performQuery(
        'INSERT INTO notification(${this:name} VALUES(${this:csv});',
        {
            account: acc,
            notification_id: notificationId,
            text: text,
            readen: false,
            author: author
        }
    );
}

async function searchMangaByName(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga WHERE UPPER(name) LIKE UPPER('%${name}%') ORDER BY bookmarks_count DESC LIMIT ${limit};`,
    );
}

async function searchMangaByNameAuthor(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga 
            WHERE UPPER(manga.name) LIKE UPPER('%${name}%') 
            OR UPPER(manga.author) LIKE UPPER('%${name}%') 
            ORDER BY bookmarks_count DESC LIMIT ${limit};`,
    );
}

async function getMangaByIdImage(id) {
    return await performQuery(
        `SELECT DISTINCT * FROM manga
            WHERE manga.manga_key=$1;`, id
    );
}

async function getMangaById(id) {
    return await performQuery(
        `SELECT DISTINCT * FROM manga
            WHERE manga_key=$1`, id
        );
}

async function searchMangaByAuthor(name, limit) {
    return await performQuery(
        `SELECT DISTINCT * FROM manga 
            WHERE UPPER(author) LIKE UPPER('%$1%') ORDER BY bookmarks_count DESC LIMIT $2;`,
        name, limit
    );
}

async function searchPopularManga(limit) {
    return await performQuery(
        `SELECT DISTINCT * FROM manga 
            ORDER BY bookmarks_count DESC LIMIT $1;`, limit
    );
}

async function searchRecentManga(limit) {
    return await performQuery(
        `SELECT DISTINCT * FROM manga
            ORDER BY create_time DESC LIMIT $1;`, limit
    );
}

async function searchRandomManga(limit) {
    return await performQuery(
        `SELECT * FROM manga
            ORDER BY RANDOM() LIMIT $1;`, limit
    );
}

async function getTableOfContents(mangaId) {
    return await performQuery(
        `SELECT volume, number, name FROM chapter 
            WHERE manga_key=$1 
            ORDER BY number ASC;`, mangaId
    );
}

async function getUserBookmarks(userId, bookmarkType) {
    return await performQuery(
        `SELECT * FROM bookmark
            WHERE bookmark.account=$1 AND bookmark.type=$2
            ORDER BY time_added ASC;`,
        [userId, bookmarkType]
    );
}

async function getUserMangaBookmarkStatus(userId, mangaId) {
    return await performQuery(
        `SELECT type FROM bookmark WHERE account=$1 AND manga_key=$2`,
        [userId, mangaId]
    )
}

async function getMangaPageData(mangaId, chapterNum, pageNum) {
    console.log(mangaId);
    return await performQuery(
        `SELECT 
            manga.name as manga_name,
            chapter.name as chapter_name, 
            number as chapter_number,
            volume, pages_count, image, page_number FROM chapter 
                JOIN manga_page ON chapter.chapter_key=manga_page.chapter_key
                JOIN manga ON chapter.manga_key=manga.manga_key
                    WHERE manga.manga_key=$1 AND chapter.number=$2 AND manga_page.page_number=$3;`,
        [mangaId, chapterNum, pageNum]);
}

async function getPageComments(pageId) {
    return await performQuery(
        'SELECT (${columns:name}) FROM comment WHERE page_key=$2;',
        [
            'comment_id',
            'author',
            'text',
            'rating',
            'time_added',
            'answer_on'
        ],
        pageId
    );
}

async function getPrevNextChapterNum(mangaId, chapterNum) {
    console.log("Has prev/next chapter request");
    console.log(mangaId);
    console.log(chapterNum);
    return await performQuery(
        `SELECT
            (SELECT chapter.number
                FROM chapter WHERE manga_key=$1 AND chapter.number<$2
                ORDER BY number DESC LIMIT 1) AS ch_num_prev,
            (SELECT chapter.number
                FROM chapter WHERE manga_key=$1 AND chapter.number>$2
                ORDER BY number ASC LIMIT 1) AS ch_num_next;`,
        [mangaId, chapterNum]
    )
}

function changePassword(userId, newPassword) {
    const [newSalt, newPasswordHashed] = createPasswordSalt(newPassword);
    return performQuery(
        `UPDATE account
            SET passw_hashed=$2 WHERE id=$1;
        UPDATE salts
            SET salt=$3 WHERE id=$1;`,
        [userId, newPasswordHashed, newSalt]        
    );
}

function changeUserGeneralData(userId, { name, photo, description }) {
    let photoPromise, namePromise, descriptionPromise;
    if (photo)
        photoPromise = performQuery(
            `UPDATE account
                SET photo=$2 WHERE account.id=$1`,
            [userId, photo]
        );
    if (name) 
        namePromise = performQuery(
            `UPDATE account
                SET name=$2 WHERE account.id=$1;`,
            [userId, name]
        );
    if (description)
        descriptionPromise = performQuery(
            `UPDATE account
                SET description=$2 WHERE account.id=$1;`,
            [userId, description]
        );
    return Promise.all([photoPromise, namePromise, descriptionPromise])
            .then(_ => "Data added")
            .catch(_ => "Data not added");
}

function updateBookmark(accId, mangaKey, newStatus, newChapter=null, newPage=null) {
    return performQuery(
        `UPDATE bookmark
            SET time_added=NOW(), type=$3, chapter=$4, page=$5 
            WHERE account=$1 AND manga_key=$2;
        INSERT INTO bookmark(account, manga_key, chapter, page, type, time_added)
            SELECT $1, $2, $4, $5, $3, NOW()
            WHERE NOT EXISTS (SELECT 1 FROM bookmark WHERE account=$1 AND manga_key=$2);`,
        [accId, mangaKey, newStatus, newChapter, newPage]
    );
}

async function updateComment(commentId, newText) {
    return performQuery(
        `UPDATE comment
            SET comment.text=$1 WHERE comment.comment_id=$2;`, newText, commentId
    );
}

async function updateChapter() {

}

async function updateMangaPage(mangaName, chapterNumber, pageNumber, image) {
    /*return performQuery(
        `SELECT * FROM manga_page
        WHERE chapter_key=(
        SELECT chapter_key FROM chapter 
            WHERE chapter.number=2
            AND chapter.manga_key=(
                SELECT manga_key FROM manga WHERE manga.name='Naruto'
            )
        ) AND manga_page.page_number=1;`
    );*/
}

async function updateOnlineStatus(userId) {
    return performQuery(
        `UPDATE account
            SET is_online=NOT is_online, last_online=NOW()
            WHERE account.id='$1';`, userId
    );
}

async function deleteManga(mangaName) {
    return performQuery(
        'DELETE FROM manga WHERE name=$1', mangaName
    );
}

async function deleteChapter(mangaName, chapterNumber) {
    return performQuery(
        `DELETE FROM chapter WHERE chapter.manga_key=(
            SELECT manga_key from manga WHERE manga.name=$1 LIMIT 1
        ) AND chapter.number=$2`,
        mangaName, chapterNumber
    );
}

async function deleteUser(userId) {
    return performQuery(
        'DELETE FROM account where id=$1', userId
    );
}

async function deleteNotification() {

}

module.exports = {
    getUserByEmailOrUsername,
    getUserByEmail,
    getUserName,
    getUserPageData,
    checkPassword,
    createUser,
    confirmUserByToken,
    createPasswordResetToken,
    resetPassword,
    addManga,
    createBookmark,
    addComment,
    addChapter,
    createNotification,
    searchMangaByNameAuthor,
    searchMangaByName,
    getMangaByIdImage,
    getMangaById,
    searchMangaByAuthor,
    searchPopularManga,
    searchRecentManga,
    searchRandomManga,
    getTableOfContents,
    getUserBookmarks,
    getUserMangaBookmarkStatus,
    getMangaPageData,
    getPageComments,
    getPrevNextChapterNum,
    changePassword,
    changeUserGeneralData,
    updateBookmark,
    updateComment,
    //updateChapter,
    //updateMangaPage,
    updateOnlineStatus,
    deleteManga,
    deleteChapter,
    deleteUser,
    //deleteNotification
};
