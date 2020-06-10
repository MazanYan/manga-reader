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
    password: "QuaQuaSHHTK_6"
};

const db = pgp(databaseConfig);

/*db.connect()
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
        console.log('Query completed');
        console.log(result);
        return result;
    }
    catch (error) {
        console.log('ERROR:', error.message || error);
    }
}

function createAccount({name, email, passw, photo = null, descr = null}) {
    const accId = crypt.MD5(email + name);
    const salt = Array(10).fill(null).map(_ => Math.ceil(Math.random() * Math.floor(9))).join('');
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

function addManga({name, author, descr}) {
    performQuery(
        'INSERT INTO manga(${this:name}) VALUES(${this:csv});',
        {
            name: name,
            author: author,
            description: descr,
            add_time: 'NOW()',
            bookmarks_count: 0,
        }
    );
}

function createBookmark({accId, mangaKey, chapter = null, page = null}) {
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

function addComment({author, page, text, answerOn = null}) {
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

function addChapter({mangaKey, name = null, number, volume = null}) {
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

function createNotification({acc, text, author}) {
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

function searchMangaByName(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga where UPPER(name) LIKE UPPER('%$1%') ORDER BY bookmarks_count DESC LIMIT $2;`,
        name, limit
    );
}

function searchMangaByAuthor(name, limit) {
    return performQuery(
        `SELECT DISTINCT * FROM manga where UPPER(author) LIKE UPPER('%$1%') ORDER BY bookmarks_count DESC LIMIT $2;`,
        name, limit
    );
}

function searchPopularManga(limit) {
    return performQuery(
        'SELECT DISTINCT * FROM manga ORDER BY bookmarks_count LIMIT $1;', limit
    );
}

function getTableOfContents(mangaId) {
    return performQuery(
        'SELECT (volume, number, name) FROM chapter WHERE manga_key=$1 ORDER BY number ASC;', mangaId
    );
}

function getPageComments(pageId) {
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
function getPrevPage(pageNum, chapterKey) {
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
function getNextPage(pageNum, chapterKey) {
    return performQuery(
        'SELECT prev_page($1, $2);', pageNum, chapterKey
    );
}