import React, { useState, useEffect } from 'react';
import '../../css/MainManga.css';
import { RouteComponentProps, Link } from 'react-router-dom';
import { MangaResponse, TableOfContentsResponse } from '../../helpers/MangaResponse';
import axios from 'axios';
import { postgresToDate } from '../../helpers/ConvertTimestamp';
import Bookmark from './BookmarkComponent';
import verifyToken from '../../helpers/VerifyToken';
const config = require('../../config');

interface TableOfContentsProps {
    chapters: Array<TableOfContentsResponse>,
    path: string
};

interface MangaMainPageRouterProps {
    manga: string,
    id: string
};

interface LoggedInState {
    loggedIn: boolean,
    userId?: string
}

interface MangaMainPageProps extends RouteComponentProps<MangaMainPageRouterProps> {

};

function RenderTableOfContents(props: TableOfContentsProps) {
    if (props.chapters.length)
        return (
            <table id="tableOfContents">
                <thead>
                    <tr key={0}>
                        <th>Volume</th>
                        <th>Chapter</th>
                    </tr>
                </thead>
                <tbody>
                    {props.chapters.map(chapt => (
                        <tr key={chapt.number}>
                            <td>
                                <Link to={`${props.path}/chapter${chapt.number}/page1`}>
                                    {chapt.volume}
                                </Link>
                            </td>
                            <td>
                                <Link to={`${props.path}/chapter${chapt.number}/page1`}>
                                    {chapt.number} - {chapt.name}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    else return (<p>This manga has no added chapters yet.</p>);
}

export default function MangaMain(props: MangaMainPageProps) {
    
    const mangaId = parseInt(props.match.params.id);

    const [tableOfContentsOpened, setTableOfContentsOpened] = useState(false);
    const [tableOfContents, setTableOfContents] = useState<Array<TableOfContentsResponse>>();
    const [mangaData, setMangaData] = useState<MangaResponse>();
    const [loggedIn, setLoggedIn] = useState<LoggedInState>();

    useEffect(() => {
        console.log(props.match.params.id);
        axios.get(`http://${config.serverAddress}/search/mangaId/${mangaId}`)
            .then(res => {
                const mangaData = res.data.message[0];
                setMangaData(mangaData);
        });
        axios.get(`http://${config.serverAddress}/search/mangaId/${mangaId}/toc`)
            .then(res => {
                const tableOfContents = res.data.message;
                setTableOfContents(tableOfContents ? tableOfContents : []);
        });
    }, []);
    useEffect(() => {
        verifyToken().then(res => {
            console.log(res);
            if (res)
                setLoggedIn({ loggedIn: true, userId: res?.accId });
        });
    }, [loggedIn?.userId]);

    const renderTableOfContents = () => {
        if (tableOfContentsOpened) {
            return (
                <RenderTableOfContents path={props.location.pathname} chapters={tableOfContents!} />
            );
            
        }
    }

    return (
        <main>
            <div id="manga-main-page">
                <img id="image-placeholder" src={`http://${config.serverAddress}/images/thumb/${mangaData?.thumbnail}`}/>
                <div id="description">
                    <strong>Name: </strong>{mangaData?.name}<br/>
                    <strong>Author: </strong>{mangaData?.author}<br/>
                    <strong>Status: </strong>{mangaData?.manga_status !== null ? mangaData?.manga_status : "unknown"}<br/>
                    <strong>Years: </strong>{postgresToDate(mangaData?.create_time)?.getFullYear()} - {mangaData?.time_completed !== null ?
                                    postgresToDate(mangaData?.time_completed)?.getFullYear() : "now"}<br/>
                    <strong>Description: </strong>{mangaData?.description}<br/>
                </div>
                <div id="other-info">
                    <p>{mangaData?.bookmarks_count} people added this manga to bookmarks</p>
                    <p>Last updated at {mangaData?.last_modify_time ? postgresToDate(mangaData?.last_modify_time)?.toLocaleDateString() : "unknown time"}</p>
                    {loggedIn ? <Bookmark mangaId={mangaId} userId={loggedIn.userId!}/> : <></>}
                </div>
                <button className="btn" id="open-table-of-contents" onClick={() => setTableOfContentsOpened(!tableOfContentsOpened)}>Table of Contents</button>
                <div id="table-of-contents">{renderTableOfContents()}</div>
            </div>
        </main>
    );

}
