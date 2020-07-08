import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

export default function UserBookmarksPage() {
    
    const [pageSelected, setPageSelected] = useState(1);
    const { id } = useParams();
    
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
