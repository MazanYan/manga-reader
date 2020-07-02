import React, { useState, useEffect } from 'react';
import '../../css/MangaPage.css';
import { RouteComponentProps, Link, Router } from 'react-router-dom';
import axios from 'axios';
import Bookmark from './BookmarkComponent';
import verifyToken from '../../helpers/VerifyToken';

const addresses = require('../../config');

interface MangaPageRouterProps {
    manga: string,
    id: string,
    chapter: string,
    ch: string,
    page: string,
    pg: string
};

interface MangaPageProps extends RouteComponentProps<MangaPageRouterProps> {};

interface MangaPageState {
    image?: string,
    volume?: number,
    chapterName?: string, 
    mangaName?: string,
    nextChapter?: number,
    prevChapter?: number,
    pagesCountChapter?: number
};

export default function MangaPage(props: MangaPageProps) {

    const [mangaPageData, setMangaPageData] = useState<MangaPageState>();
    const [loggedIn, setLoggedIn] = useState(false);
    const [accId, setAccId] = useState("");

    useEffect(() => {
        const manga = parseInt(props.match.params.id);
        const chapter = parseInt(props.match.params.ch);
        const page = parseInt(props.match.params.pg);

        axios.get(`http://${addresses.serverAddress}/search/manga=${manga}/chapter=${chapter}/page=${page}`)
            .then(response => {
                const result = response.data.response;
                const gen = result.generalPageData[0];
                //console.log(result);
                setMangaPageData({
                    image: gen.image,
                    volume: gen.volume,
                    chapterName: gen.chapter_name,
                    mangaName: gen.manga_name,
                    pagesCountChapter: gen.pages_count,
                    prevChapter: result.prevChapter,
                    nextChapter: result.nextChapter
                });
                console.log(mangaPageData);
            });
        
        verifyToken().then(response => {
            if (response) {
                setLoggedIn(true);
                setAccId(response.accId);
            }
        }).catch(err => alert(err));
    }, []);

    const renderPrevChapterButton = () => {
        if (mangaPageData?.prevChapter)
            return (
                <a href={`/manga/${props.match.params.id}/chapter${mangaPageData.prevChapter}/page1`}>
                    <div id="prev-chapter" className="chapter-button">
                        <i className="fa fa-arrow-left"/><br/>
                        Previous chapter
                    </div>
                </a>
            );
        else 
            return (
                <div id="prev-chapter" className="chapter-button inactive">
                    <i className="fa fa-arrow-left"/><br/>
                    Previous chapter
                </div>
            )
    }

    const renderNextChapterButton = () => {
        if (mangaPageData?.nextChapter)
            return (
                <a href={`/manga/${props.match.params.id}/chapter${mangaPageData.nextChapter}/page1`}>
                    <div id="next-chapter" className="chapter-button">
                        <i className="fa fa-arrow-right"/><br/>
                        Next chapter
                    </div>
                </a>
            );
        else 
            return (
                <div id="next-chapter" className="chapter-button inactive">
                    <i className="fa fa-arrow-right"/><br/>
                    Next chapter
                </div>
            )
    };

    const renderBookmark = () => {
        if (loggedIn)
            return (
                <Bookmark
                    mangaId={parseInt(props.match.params.id)}
                    userId={accId} 
                    chapter={parseInt(props.match.params.ch)} 
                    page={parseInt(props.match.params.pg)}
                />
            );
        else
            return (<></>);
    };

    
    return (
        <>
            <div className="header page-head">
                <h3><Link to={`/manga/${props.match.params.id}`}>{mangaPageData?.mangaName}</Link></h3>
                <strong>Volume {mangaPageData?.volume}. Chapter {props.match.params.ch} - {mangaPageData?.chapterName}</strong>{renderBookmark()}
            </div>
            <main>
                <div className="chapter-buttons">
                    {renderPrevChapterButton()}
                    {renderNextChapterButton()}
                </div>
                <div className="manga-page">
                    <div className="page-body">
                        <div className="square">
                            <img className="page-image" src={`http://${addresses.serverAddress}/images/manga_pages/${mangaPageData?.image}`}/>
                        </div>
                        <div className="pagination">
                            {
                                Array.apply(null, Array(mangaPageData?.pagesCountChapter))
                                    .map(function (_, i) {return i+1})
                                    .map(i => {
                                        if (i === parseInt(props.match.params.pg))
                                            return (
                                                <div className="page-link inactive">{i}</div>
                                            )
                                        else
                                            return (
                                                <a href={`http://${addresses.clientAddress}/manga/${props.match.params.id}/chapter${props.match.params.ch}/page${i}`}>
                                                    <div className="page-link">
                                                        {i}
                                                    </div>
                                                </a>
                                            )
                                    })
                            }
                        </div>
                    </div>
                </div>
                <div className="manga-page">
                    <div className="page-body comments">
                        Comments:<br/>
                        <h1>TBA</h1>
                    </div>
                </div>
            </main>
        </>
    );
}
