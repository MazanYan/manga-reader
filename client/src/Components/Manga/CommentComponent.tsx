import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';
import axios from 'axios';
const addresses = require('../../config');

export interface CommentProps {
    commentId: string,
    showReplyButton: boolean,
    authorName: string,
    authorId: string,
    commentDate: Date,
    commentText: string,
    commentRating: number,

    userReplyerId?: string
}

export interface BasicCommentProps extends CommentProps {
    pageData: PageData,
    replies?: Array<CommentReplyProps>
}

interface CommentReplyProps extends CommentProps {
    commentReplyId: string
}

interface CommentRepliesProps {
    replies?: Array<CommentReplyProps>
}

interface NewCommentProps {
    pageData: PageData,
    isReply: boolean,
    replyOn?: string
}

interface PageData {
    mangaKey: number,
    chapterNum: number,
    pageNum: number
}

interface CommentListProps {
    pageData: PageData,
    showReply: boolean,
    comments?: Array<BasicCommentProps>
}

export default function CommentList(props: CommentListProps) {

    return (
        <>
            {props.comments?.map((comment: any) => 
                (
                    <BasicComment pageData={props.pageData} {...comment}/>
                )
            )}
        </>
    )
}

export function NewComment(props: NewCommentProps) {

    const [authorId, setAuthorId] = useState("");
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        verifyToken().then(response => {
            if (response) {
                setAuthorId(response.accId);
            }
        });
    });

    const sendComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(props);

        const toSend = {
            mangaKey: props.pageData.mangaKey,
            chapterNum: props.pageData.chapterNum,
            pageNum: props.pageData.pageNum,
            author: authorId,
            text: commentText,
            isReply: props.isReply,
            replyOn: props?.replyOn
        };

        console.log(toSend);

        axios.post(`http://${addresses.serverAddress}/add/comment`, toSend)
            .then(response => alert(response.data))
            .catch(response => alert('Comment not added'));
    };

    return (
        <form onSubmit={sendComment} className={`form-comment ${props.isReply ? 'reply' : ''}`}>
            <textarea name="comment-text" maxLength={1000} onChange={
                (event: React.FormEvent<HTMLTextAreaElement>) => setCommentText(event.currentTarget.value)
            }/>
            <button className="btn btn-comment" type="submit">Write comment</button>
        </form>
    );
}

function CommentReply(props: CommentReplyProps) {

    return (
        <p className="comment">
            <div className="comment-head">
                <Link className="username" to={`/user/${props.authorId}`}>{props.authorName}</Link>
                <div className="comment-date">{props.commentDate.toLocaleDateString()}</div>
                <div className="comment-rating">{props.commentRating ? props.commentRating : 0}</div>
            </div>
            <div className="comment-body">
                {props.commentText}
            </div>
        </p>
    );
}

function CommentReplies(props: CommentRepliesProps) {
    useEffect(() => {
        console.log("Replies");
        console.log(props);
    });
    return (
        <div className="reply">
            {
                props.replies?.map((reply: CommentReplyProps) => (
                    <CommentReply {...reply} />
                ))
            }
        </div>
    );
}

function BasicComment(props: BasicCommentProps) {

    const [commentHovered, setCommentHovered] = useState(false);
    const [replyBtnClicked, setReplyBtnClicked] = useState(false);
    
    const renderReplyLink = () => {
        if (props.showReplyButton && commentHovered)
            return (
                <div className="link-colored" onClick={() => setReplyBtnClicked(!replyBtnClicked)}>
                    Reply
                </div>
            );
        else 
            return (<></>);
    };

    const renderReply = () => {

        if (replyBtnClicked)
            return (
                <NewComment 
                    pageData={props.pageData}
                    isReply={true} 
                    replyOn={props.commentId} 
                />
            )
    };

    return (
        <p className="comment" onMouseEnter={() => setCommentHovered(true)} onMouseLeave={() => setCommentHovered(false)}>
            <div className="comment-head">
                <Link className="username" to={`/user/${props.authorId}`}>{props.authorName}</Link>
                <div className="comment-date">{props.commentDate.toLocaleDateString()}</div>
                <div className="comment-rating">{props.commentRating ? props.commentRating : 0}</div>
            </div>
            <div className="comment-body">
                {props.commentText}
                {renderReplyLink()}
            </div>
            {<CommentReplies replies={props?.replies}/>}
            {renderReply()}
        </p>
    );
}
