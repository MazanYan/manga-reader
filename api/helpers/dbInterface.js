const initOptions = {
    error(error, e) {
        if (e.cn) {
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};
const crypt = require('crypto-js');
const pgp = require('pg-promise')(initOptions);

const databaseConfig = {
    host: "localhost",
    port: 5432,
    database: "manga_reader",
    user: "postgres",
    //password: "passw"
};

const db = pgp(databaseConfig);

function generateSalt() {
    return Array(10).fill(null).map(_ => Math.ceil(Math.random() * Math.floor(9))).join('');
}

async function checkPassword(userId, password) {
    const salt = await performQuery(
        'SELECT salt from salts WHERE salt.id=$1', userId
    );
    const hashedPassword = crypt.SHA256(password + salt);
    const correctPassword = await performQuery(
        'SELECT password FROM account WHERE account.id=$1', userId
    );
    return hashedPassword === correctPassword;
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

async function performQuery() {
    try {
        const result = await db.query(...arguments);
        //console.log('Query completed');
        //console.log(result);
        return result;
    }
    catch (error) {
        console.log('ERROR:', error.message || error);
    }
}

async function createAccount({name, email, passw, photo = null, descr = null}) {
    const accId = crypt.MD5(email + name);
    const salt = generateSalt();
    const hashedPassw = crypt.SHA256(passw + salt);
    console.log(`Name: ${name}`);
    performQuery(
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
            email: email
        }
    )

    performQuery(
        'INSERT INTO salts(name, salt) VALUES ($1, $2)',
        [accId, hashedPassw]
    );
}

async function addManga({name, author, descr, time = null}) {
    performQuery(
        'INSERT INTO manga(${this:name}) VALUES(${this:csv});',
        {
            name: name,
            author: author,
            description: descr,
            create_time: time ? time : 'NOW()',
            bookmarks_count: 0,
        }
    );
}

async function createBookmark({accId, mangaKey, chapter = null, page = null}) {
    performQuery(
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
    performQuery(
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

async function addChapter({mangaKey, name = null, number, volume = null}) {
    const chapterKey = crypt.MD5(string(mangaKey) + number);
    performQuery(
        'INSERT INTO chapter(${this:name} VALUES(${this:csv});',
        {
            chapter_key: chapterKey,
            manga_key: mangaKey,
            name: name,
            number: number,
            volume: volume,
            add_time: 'NOW()'
        }
    );
}

async function createNotification({acc, text, author}) {
    const notificationId = crypt.MD5(string(acc) + author + new Date().toLocaleString());
    performQuery(
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

/*async function searchMangaByName(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga WHERE UPPER(name) LIKE UPPER('%${name}%') ORDER BY bookmarks_count DESC LIMIT ${limit};`,
    );
}*/

async function searchMangaByNameAuthor(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga 
            WHERE UPPER(manga.name) LIKE UPPER('%${name}%') 
            OR UPPER(manga.author) LIKE UPPER('%${name}%') 
            ORDER BY bookmarks_count DESC LIMIT ${limit};`,
    );
}

async function getMangaById(id) {
    return performQuery('SELECT * FROM manga WHERE manga_key=$1', id);
}

/*async function searchMangaByAuthor(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga WHERE UPPER(author) LIKE UPPER('%$1%') ORDER BY bookmarks_count DESC LIMIT $2;`,
        name, limit
    );
}*/

async function searchPopularManga(limit) {
    return performQuery(
        'SELECT DISTINCT * FROM manga ORDER BY bookmarks_count LIMIT $1;', limit
    );
}

async function getTableOfContents(mangaId) {
    return performQuery(
        'SELECT volume, number, name FROM chapter WHERE manga_key=$1 ORDER BY number ASC;', mangaId
    );
}

async function getPageComments(pageId) {
    return performQuery(
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
    return performQuery(
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
    return performQuery(
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
    return performQuery(
        `SELECT * FROM manga_page
        WHERE chapter_key=(
        SELECT chapter_key FROM chapter 
            WHERE chapter.number=2
            AND chapter.manga_key=(
                SELECT manga_key FROM manga WHERE manga.name='Naruto'
            )
        ) AND manga_page.page_number=1;`
    );
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
    checkPassword: checkPassword,
    createAccount: createAccount,
    addManga: addManga,
    createBookmark: createBookmark,
    addComment: addComment,
    addChapter: addChapter,
    createNotification: createNotification,
    searchMangaByNameAuthor: searchMangaByNameAuthor,
    //searchMangaByName: searchMangaByName,
    getMangaById: getMangaById,
    //searchMangaByAuthor: searchMangaByAuthor,
    searchPopularManga: searchPopularManga,
    getTableOfContents: getTableOfContents,
    getPageComments: getPageComments,
    getPrevPage: getPrevPage,
    getNextPage: getNextPage,
    getMangaPageImage: getMangaPageImage,
    //changeProfilePhoto: changeProfilePhoto,
    changePassword: changePassword,
    changeDescription: changeDescription,
    updateBookmark: updateBookmark,
    updateComment: updateComment,
    //updateChapter: updateChapter,
    //updateMangaPage: updateMangaPage,
    updateOnlineStatus: updateOnlineStatus,
    deleteManga: deleteManga,
    deleteChapter: deleteChapter,
    deleteUser: deleteUser,
    //deleteNotification : deleteNotification
};
