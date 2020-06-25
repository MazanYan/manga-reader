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

async function performQuery() {
    try {
        const result = await db.query(...arguments);
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

/*
db.connect()
    .then(obj => {
        // Can check the server version here (pg-promise v10.1.0+):
        const serverVersion = obj.client.serverVersion;
        console.log(`Server Version ${serverVersion}`);
        obj.done(); // success, release the connection;
        console.log("Connection closed");
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

const result = db.any('SELECT * FROM manga').then(result => console.log(result));
*/

async function getUserByEmailOrUsername(usernameEmail) {
    console.log(`UsernameEmail ${usernameEmail}`);
    return await performQuery(
        `SELECT id FROM account 
            WHERE name=$1 OR email=$1 LIMIT 1;`,
        [usernameEmail]);
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
    //console.log(hashedPassword === correctPassword);
    return hashedPassword === correctPassword;
}

async function createUser({name, email, passw, photo = null, descr = null}) {
    const accId = cryptoJS.MD5(email + name).toString();
    const salt = crypto.randomBytes(20).toString('hex');
    const hashedPassw = cryptoJS.SHA256(passw + salt).toString();
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

    console.log(arrToStr(images));
    console.log()
    //const chapterKey = crypt.MD5(string(mangaKey) + number);
    return performQuery(
        'INSERT INTO chapter(manga_key, name, number, volume, pages_count, add_time)' +
            'VALUES ((SELECT manga_key FROM manga WHERE manga.name=${manga_name} LIMIT 1),' +
                     '${name}, ${number}, ${volume}, ${pages_count}, NOW());' +
        'INSERT INTO manga_page(image, page_number, chapter_key)' +
            'SELECT unnest(array' + arrToStr(images) + '), unnest(array' + arrToStrInts(pageNumbers) + '),' +
            '(SELECT chapter_key FROM chapter WHERE chapter.name=${name} LIMIT 1);',
        {
            //chapter_key: chapterKey,
            manga_name: mangaName,
            name: chapterName,
            number: chapterNumber,
            volume: chapterVolume,
            pages_count: pagesCount
        }
    );
}

//console.log(addChapter({mangaName: 'Naruto', name: 'Sasuke Uchiha!', number: 5, volume: 1}));

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
        'SELECT volume, number, name FROM chapter WHERE manga_key=$1 ORDER BY number ASC;', mangaId
    );
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

/*
CREATE OR REPLACE FUNCTION prev_page(IN page integer, IN chapter_num bigint)
  	RETURNS TABLE(f1 bigint, f2 integer, f3 bytea, f4 character varying)
   	AS $$
  	DECLARE chapter_pages_count int;
   	BEGIN
  		IF page=1 THEN
 		BEGIN
 			SELECT pages_count FROM chapter WHERE chapter_key=chapter_num LIMIT 1 INTO chapter_pages_count;
   			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num+1 AND page_number=1;
 		END;
   		ELSE
   			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num AND page_number=page+1;
   		END IF;
   	END; $$ LANGUAGE PLPGSQL;
*/
async function getPrevPage(pageNum, chapterKey) {
    return await performQuery(
        'SELECT prev_page($1, $2);', pageNum, chapterKey
    );
}

/*
CREATE OR REPLACE FUNCTION next_page(IN page integer, IN chapter_num bigint)
 	RETURNS TABLE(f1 bigint, f2 integer, f3 bytea, f4 character varying)
  	AS $$
 	DECLARE chapter_pages_count int;
  	BEGIN
 		SELECT pages_count FROM chapter WHERE chapter_key=chapter_num LIMIT 1 INTO chapter_pages_count;
  		IF chapter_pages_count=page THEN
  			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num+1 AND page_number=1;
  		ELSE
  			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num AND page_number=page+1;
  		END IF;
  	END; $$ LANGUAGE PLPGSQL;
*/
async function getNextPage(pageNum, chapterKey) {
    return await performQuery(
        'SELECT prev_page($1, $2);', pageNum, chapterKey
    );
}

async function getMangaPageImage(mangaName, mangaChapter, pageNumber) {
    return performQuery(
        `SELECT manga.name AS manga_name, chapter.number AS chapter_number, manga_page.page_number, manga_page.image FROM manga_page
	        INNER JOIN chapter ON chapter.chapter_key=manga_page.chapter_key AND chapter.number=$2
	        INNER JOIN manga ON manga.name='$1'
	        WHERE manga_page.page_number=$3;`, mangaName, mangaChapter, pageNumber
    )
}

function changeProfilePhoto() {
    /*performQuery(
        'UPDATE'
    )*/
}

function changePassword(userId, newPassword) {
    const newSalt=generateSalt();
    const hashedPassw=crypt.SHA256(newPassword + newSalt);
}

function changeDescription(userId, newDescription) {
    return performQuery(
        `UPDATE account
            SET description=$1 WHERE account.id=$2`,
        newDescription, userId
    );
}

function updateBookmark(accId, mangaKey, newChapter) {
    return performQuery(
        `UPDATE boormark
            SET chapter=$1 WHERE account=$2 AND manga_key=$3`,
        newChapter, accId, mangaKey
    );
}

async function updateComment(commentId, newText) {
    return performQuery(
        `UPDATE comment
            SET comment.text=$1 WHERE comment.comment_id=$2`, newText,commentId
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
    checkPassword,
    createUser,
    confirmUserByToken,
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
    getMangaPageData,
    getPageComments,
    getPrevNextChapterNum,
    //getPrevPage,
    //getNextPage,
    //getMangaPageImage,
    //changeProfilePhoto,
    changePassword,
    changeDescription,
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
