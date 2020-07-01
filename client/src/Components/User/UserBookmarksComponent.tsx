import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, RouteComponentProps, Switch, Route, Link, useRouteMatch, useParams } from 'react-router-dom';
import BookmarkSelected from '../../helpers/bookmark';
import '../../css/BookmarksPage.css';

const addresses = require('../../config');

interface BookmarkProps {
    mangaName: string,
    mangaKey: string,
    volume?: number,
    chapterNum?: number,
    chapterName?: string
    page?: string
}

interface BookmarkListProps {
    user: string,
    queryType: {type: string, message: string}
}

/*const bookmarkQueries = {
    rl: "read_later",
    nr: "reading",
    co: "completed",
    fv: "favourite"
}*/

function Bookmark(props: BookmarkProps) {
    if ([props.volume, props.chapterNum, props.chapterName, props.page].some(el => el === null))
        return (
            <Link to={`/manga/${props.mangaKey}`}>{props.mangaName}</Link>
        )
    else
        return (
            <>
                <Link to={`/manga/${props.mangaKey}/chapter${props.chapterNum}/page${props.page}`}>{props.mangaName} - {props.volume}. Chapter {props.chapterNum} - {props.chapterName}, page {props.page}</Link>
            </>
        )
}

function BookmarkList(props: BookmarkListProps) {

    const [bookmarks, setBookmarks] = useState<Array<any>>();

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/user?user=${props.user}&type=${props.queryType.type}`) //?user=${props.user}&type=${bookmarkQueries.rl}
            .then(res => {
                console.log(res);
                setBookmarks(res.data);
            });
    }, [props.queryType]);

    if (bookmarks?.length)
        return (
            <>
            {
                bookmarks?.map(bookm => (
                    <>
                        <Bookmark 
                            mangaName={bookm.manga_name} 
                            mangaKey={bookm.manga_key}
                            chapterNum={bookm.chapter}
                            chapterName={bookm.chapter_name} 
                        />
                        <br/>
                    </>
                ))
            }
            </>);
    else
        return (
        <h3>This user has not added '{props.queryType.message}' bookmarks yet</h3>
        );
}

export default function UserBookmarksPage() {
    
    const [pageSelected, setPageSelected] = useState(1);
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
    });
    
    const renderPageSelected = () => {
        switch(pageSelected) {
            case 1: return <BookmarkList user={id} queryType={BookmarkSelected.rl}/>;
            case 2: return <BookmarkList user={id} queryType={BookmarkSelected.nr}/>;
            case 3: return <BookmarkList user={id} queryType={BookmarkSelected.co}/>;
            case 4: return <BookmarkList user={id} queryType={BookmarkSelected.fv}/>;
        }
    }

    return (
        <>
            <div className="header">
                <p>Bookmarks</p>
            </div>
            <div className="bookmarks-selector">
                <button className="btn btn-bookmark-type" onClick={(e) => setPageSelected(1)}>Read Later</button>
                <button className="btn btn-bookmark-type" onClick={(e) => setPageSelected(2)}>Currently reading</button>
                <button className="btn btn-bookmark-type" onClick={(e) => setPageSelected(3)}>Completed</button>
                <button className="btn btn-bookmark-type" onClick={(e) => setPageSelected(4)}>Favourite</button>
            </div>
            <main>
                {renderPageSelected()}
            </main>
        </>
    );
}

/*
<div className="bookmarks-selector">
    <Link to={`${url}/rl`} className="btn btn-bookmark-type">Read Later</Link>
    <Link to={`${url}/nr`} className="btn btn-bookmark-type">Currently reading</Link>
    <Link to={`${url}/co`} className="btn btn-bookmark-type">Completed</Link>
    <Link to={`${url}/fv`} className="btn btn-bookmark-type">Favourite</Link>
</div>
<main>
<Switch>
    <Route path={`${path}/:topicId`}>
        <BookmarkPage />
    </Route>
</Switch>
</main>
*/


/*
<ReadLater />
<NowReading />
<Completed />
<Favourite />
*/