import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QueryString from 'query-string';
import { Link, useParams } from 'react-router-dom';

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

/*
    Single bookmark link on page of some user
*/
function Bookmark(props: BookmarkProps) {
    console.log(props);
    if ([props.volume, props.chapterNum, props.chapterName, props.page].some(el => el === undefined))
        return (
            <Link to={`/manga/${props.mangaKey}`}>{props.mangaName}</Link>
        )
    else
        return (
            <Link to={`/manga/${props.mangaKey}/chapter${props.chapterNum}/page${props.page}`}>
                {props.mangaName}. Volume {props.volume}. Chapter {props.chapterNum} - {props.chapterName}, page {props.page}
            </Link>
        )
}

/*
    Render list of bookmarks with specific status (read later, reading in progress, completed, favourite)
*/
function BookmarkList(props: BookmarkListProps) {

    const [bookmarks, setBookmarks] = useState<Array<any>>();

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/user?user=${props.user}&type=${props.queryType.type}`)
            .then(res => {
                console.log(res);
                setBookmarks(res.data);
            });
    }, [props]);

    if (bookmarks?.length)
        return (
            <div id="bookmark-list">
                <h3>{props.queryType.message}:</h3>
                {
                    bookmarks?.map(bookm => {
                        if (props.queryType === BookmarkSelected.nr)
                            return (
                                <p className="bookmark">
                                    <Bookmark 
                                        mangaName={bookm.manga_name} 
                                        mangaKey={bookm.manga_key}
                                        volume={bookm.volume}
                                        chapterNum={bookm.chapter}
                                        chapterName={bookm.chapter_name}
                                        page={bookm.page}
                                    />
                                </p>
                            );
                        else
                            return (
                                <p className="bookmark">
                                    <Bookmark 
                                        mangaName={bookm.manga_name} 
                                        mangaKey={bookm.manga_key}
                                    />
                                </p>
                            )
                        }
                    )
                }
            </div>
        );
    else
        return (
        <h3>This user has not added '{props.queryType.message}' bookmarks yet</h3>
        );
}

/*
    Component for page of some user's bookmarks with boormarks selectors
*/
export default function UserBookmarksPage() {
    
    const { id } = useParams();
    const page = QueryString.parse(window.location.search).page;
    
    const renderPageSelected = () => {
        switch(page) {
            case '1': return <BookmarkList user={id} queryType={BookmarkSelected.rl}/>;
            case '2': return <BookmarkList user={id} queryType={BookmarkSelected.nr}/>;
            case '3': return <BookmarkList user={id} queryType={BookmarkSelected.co}/>;
            case '4': return <BookmarkList user={id} queryType={BookmarkSelected.fv}/>;
        }
    }

    return (
        <>
            <div className="header">
                <p>Bookmarks</p>
            </div>
            <div className="bookmarks-selector">
                <Link className="btn btn-bookmark-type" to={`/user/${id}/bookmarks?page=1`}>Read Later</Link>
                <Link className="btn btn-bookmark-type" to={`/user/${id}/bookmarks?page=2`}>Currently reading</Link>
                <Link className="btn btn-bookmark-type" to={`/user/${id}/bookmarks?page=3`}>Completed</Link>
                <Link className="btn btn-bookmark-type" to={`/user/${id}/bookmarks?page=4`}>Favourite</Link>
            </div>
            <main>
                {renderPageSelected()}
            </main>
        </>
    );
}
