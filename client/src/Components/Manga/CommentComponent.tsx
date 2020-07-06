import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';
import axios from 'axios';
import { postgresToDate } from '../../helpers/ConvertTimestamp';
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
    replies?: Array<CommentReplyProps>
}

interface CommentReplyProps extends CommentProps {
    commentReplyId: string
}

interface CommentRepliesProps {
    replies?: Array<CommentReplyProps>
}

interface NewCommentProps {
    isReply: boolean,
    replyOn?: string
}

interface CommentListProps {
    showReply: boolean,
    comments?: Array<BasicCommentProps>
}

export default function CommentList(props: CommentListProps) {

    return (
        <>
            {props.comments?.map((comment: BasicCommentProps) => 
                (
                    <BasicComment {...comment}/>
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

        const toSend = {
            author: authorId,
            text: commentText,
            isReply: props.isReply,
            replyOn: props?.replyOn
        };

        console.log(toSend);

        axios.post(`http://${addresses.serverAddress}/add/comment`, toSend);
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
            return (<NewComment isReply={true} replyOn={props.commentId}/>)
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
