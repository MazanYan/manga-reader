import React, { useState, useEffect } from 'react';
import '../../css/MangaPage.css';
import { RouteComponentProps, Link } from 'react-router-dom';
import axios from 'axios';
import Bookmark from './BookmarkComponent';
import CommentList, { BasicCommentProps, CommentProps, NewComment } from './CommentComponent';
import verifyToken from '../../helpers/VerifyToken';
import { postgresToDate } from '../../helpers/ConvertTimestamp';

const addresses = require('../../config');

interface MangaPageRouterProps {
    id: string,
    ch: string,
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

function rawCommentToComment(rawComment: any, showReply: boolean, replyer?: string) : CommentProps {
    const unpackedComment = new Map([
        ['commentId', rawComment.comment_id],
        ['showReplyButton', showReply],
        ['answerOn', rawComment.answer_on],
        ['commentText', rawComment.text],
        ['authorId', rawComment.author],
        ['authorName', rawComment.author_name],
        ['commentDate', postgresToDate(rawComment.time_added)],
        ['commentRating', rawComment.rating],

        ['userReplyerId', replyer],
        ['replies', rawComment.replies?.map((reply: any) => rawCommentToComment(reply, showReply, replyer))],
        ['commentReplyId', rawComment.answer_on]
    ]);
    return Object.fromEntries(unpackedComment) as CommentProps;
}

function serverResponseToComments(rawComments: any, showReply: boolean, replyer?: string) : Array<BasicCommentProps> {
    const commentsUnpacked: Array<any> = [];
    rawComments.forEach( (comment: any) => commentsUnpacked.push(rawCommentToComment(comment, showReply, replyer)) );
    return commentsUnpacked;
}

export default function MangaPage(props: MangaPageProps) {

    const [mangaPageData, setMangaPageData] = useState<MangaPageState>();
    const [commentsList, setCommentsList] = useState<Array<BasicCommentProps>>();
    const [loggedIn, setLoggedIn] = useState(false);
    const [accId, setAccId] = useState("");

    // get general data and comments of manga page
    useEffect(() => {
        const manga = parseInt(props.match.params.id);
        const chapter = parseInt(props.match.params.ch);
        const page = parseInt(props.match.params.pg);

        axios.get(`http://${addresses.serverAddress}/search/page?manga=${manga}&chapter=${chapter}&page=${page}`)
            .then(response => {
                const result = response.data.response;
                const gen = result.generalPageData[0];
                console.log(response);
                setMangaPageData({
                    image: gen.image,
                    volume: gen.volume,
                    chapterName: gen.chapter_name,
                    mangaName: gen.manga_name,
                    pagesCountChapter: gen.pages_count,
                    prevChapter: result.prevChapter,
                    nextChapter: result.nextChapter
                });
                return result.comments;
            })
            .then(comments => {
                // verify that user is signed in
                verifyToken().then(response => {
                    if (response) {
                        setLoggedIn(true);
                        setAccId(response.accId);
                    }
                    setCommentsList(serverResponseToComments(comments, response?.accId, accId));
                }).catch(err => alert(err));
            });
    }, [props, accId]);

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
    };
    
    return (
        <>
            <div className="header page-head">
                <h3>
                    <Link to={`/manga/${props.match.params.id}`}>
                        {mangaPageData?.mangaName}
                    </Link>
                </h3>
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
                            <img alt={mangaPageData?.chapterName} className="page-image" src={`http://${addresses.serverAddress}/images/manga_pages/${mangaPageData?.image}`}/>
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
            </main>
            <main>
                <CommentList 
                    pageData={{ 
                        mangaKey: parseInt(props.match.params.id), 
                        chapterNum: parseInt(props.match.params.ch),
                        pageNum: parseInt(props.match.params.pg)
                    }} loggedIn={loggedIn} userId={accId} comments={commentsList!}
                />
            </main>
        </>
    );
}
