import React, { useState, useEffect } from 'react';
import '../../css/MangaPage.css';
import { RouteComponentProps, Link, Router } from 'react-router-dom';
import axios from 'axios';
import Bookmark from './BookmarkComponent';
import CommentList, { BasicCommentProps, CommentProps } from './CommentComponent';
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

/*
interface BasicCommentProps {
    commentId: string,
    showReplyButton: boolean,
    authorName: string,
    authorId: string,
    commentDate: Date,
    commentText: string,
    commentRating: number,

    userReplyerId?: string
    replies?: Array<CommentProps>
}
*/

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
    rawComments.forEach((comment: any) => {
        
        commentsUnpacked.push(rawCommentToComment(comment, showReply, replyer));
    });
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
    }, [props]);

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
                </main>
                <main>
                <div className="manga-page">
                    <div className="page-body comments">
                        Comments:<br/>
                        {<CommentList showReply={loggedIn} comments={commentsList} />}
                    </div>
                </div>
            </main>
        </>
    );
}

/*
<Comment commentId="1" showReplyButton={true} userName="Reno" userId="4312b6dc5fd597e097ca20fc0fbc57ee" commentDate={new Date().toLocaleDateString()} commentText="Hello!" />
<div className="reply">                  
    <Comment commentId="2"
        showReplyButton={true} userName="Reno" 
        userId="4312b6dc5fd597e097ca20fc0fbc57ee" commentDate={new Date().toLocaleDateString()}
        commentText={`Я фанат Хантера:
    Ґон Фрікс — головний герой. Ґон володіє неймовірно гострим слухом, зором і нюхом, які часто виручали його і його друзів в складних ситуаціях. Він дуже наївний, простодушний і добрий, що притягує до нього людей.

    Кіллуа Золдік — найкращий друг Ґона. Кіллуа родом з сім'ї Золдік — потомствених найманих вбивць. Незважаючи на свій юний вік, він уже проявив себе як один з найкращих професіоналів і був призначений наступником свого батька.
                                
    Курапіка — єдиний виживший член клану Курта. Курапіка завжди здатний спокійно аналізувати ситуацію і швидко знаходити правильне рішення.
                                
    Леоріо Парадінайт — молодий чоловік, який подружився з Ґоном під час екзамену на Мисливця. Леоріо буває досить запальним і неврівноваженим. Але він добрий і завжди готовий допомогти своїм друзям в потрібну хвилину. `} 
    />
</div>
*/
