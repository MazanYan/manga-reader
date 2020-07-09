import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
const addresses = require('../../config');

export interface CommentProps {
    commentId: string,
    authorName: string,
    authorId: string,
    commentDate: Date,
    commentText: string,
    commentRating: number,

    pageData: PageData,
    interactable: boolean,          // someone can vote or reply on comment
    userInteractorId?: string
}

export interface BasicCommentProps extends CommentProps {
    //pageData: PageData,
    replies?: Array<CommentReplyProps>
}

interface CommentReplyProps extends CommentProps {
    commentReplyId: string
}

interface VoteCommentProps {
    commentId: string,

    interactorId?: string,
    previousInteractorVote?: number
}

interface CommentRepliesProps {
    interactorId?: string,
    replies?: Array<CommentReplyProps>
}

interface NewCommentProps {
    authorId: string,
    pageData: PageData,
    isReply: boolean,
    replyOn?: string
}

export interface PageData {
    mangaKey: number,
    chapterNum: number,
    pageNum: number
}

interface CommentListProps {
    interactable: boolean,
    userInteractorId: string,
    pageData: PageData,
    comments: Array<BasicCommentProps>
}

export default function CommentList(props: CommentListProps) {
    const [commentsList, setCommentsList] = useState(props.comments!);
    const [addCommentClicked, setAddCommentClicked] = useState(false);
    const [commentsRendered, setCommentsRendered] = useState((<></>));

    const updateCommentsOrder = () => {
        if (commentsList?.length)
            setCommentsRendered((
                <>
                    {commentsList?.map((comment: any) => 
                        (
                            <BasicComment 
                                interactable={props.interactable} 
                                userInteractorId={props.userInteractorId} 
                                {...comment}/>
                        )
                    )}
                </>
            ));
        else
            setCommentsRendered((
                <h3>No comments added yet</h3>
            ));
    };

    useEffect(() => {
        //console.log(props.interactable, props.userInteractorId);
        setCommentsList(props.comments);
        updateCommentsOrder();
    }, [commentsList, props]);

    const oldestFirst = (event: any) => {
        setCommentsList(commentsList?.sort( (comm1, comm2) => comm1.commentDate.getTime() - comm2.commentDate.getTime() ));
        updateCommentsOrder();
    }

    const newestFirst = (event: any) => {
        setCommentsList(commentsList?.sort( (comm1, comm2) => comm2.commentDate.getTime() - comm1.commentDate.getTime() ));
        updateCommentsOrder();
    }

    const popularFirst = (event: any) => {
        setCommentsList(commentsList?.sort( (comm1, comm2) => comm1.commentRating - comm2.commentRating ).reverse());
        updateCommentsOrder();
    }

    const renderAddComment = () => {
        if (addCommentClicked)
            return (
                <NewComment authorId={props.userInteractorId} isReply={false} pageData={props.pageData}/>
            )
    }
    
    return (
        <div className="manga-page">
            <div className="page-body comments">
                <div className="comments-first-row">
                    Comments:
                    <div className="dropdown hoverable">
                        <button className="btn dropbtn">
                            Order by <FontAwesomeIcon icon={faCaretDown} />
                        </button>
                        <div className="dropdown-content">
                            <div className="bookm-type" onClick={oldestFirst}>Oldest first</div>
                            <div className="bookm-type" onClick={newestFirst}>Newest first</div>
                            <div className="bookm-type" onClick={popularFirst}>Best first</div>
                        </div>
                    </div>
                </div>
                {
                    props.interactable ? (
                        <div className="btn btn-comment" onClick={() => setAddCommentClicked(!addCommentClicked)}>
                            Add comment
                        </div>
                    ) : <></>
                }
                
                <div className="btn-add-comment">
                    {renderAddComment()}
                </div>
                {commentsRendered}
            </div>
        </div>
    )
}

export function NewComment(props: NewCommentProps) {

    const [commentText, setCommentText] = useState("");

    const sendComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //console.log(props);

        const toSend = {
            ...props.pageData,
            author: props.authorId,
            text: commentText,
            isReply: props.isReply,
            replyOn: props?.replyOn
        };

        console.log(toSend);

        axios.post(`http://${addresses.serverAddress}/add/comment`, toSend)
            .then(response => alert(response.data))
            .catch(err => alert('Comment not added'));
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
                <div className={`comment-rating ${props.commentRating >= 0 ? 'comment-good' : 'comment-bad'}`}>{props.commentRating ? props.commentRating : 0}</div>
                {props.interactable ? <VoteComment commentId={props.commentId} interactorId={props.userInteractorId} /> : <></>}
            </div>
            <div className="comment-body">
                {props.commentText}
            </div>
        </p>
    );
}

function CommentReplies(props: CommentRepliesProps) {
    return (
        <div className="reply">
            {
                props.replies?.map((reply: CommentReplyProps) => (
                    <CommentReply userInteractorId={props.interactorId} {...reply} />
                ))
            }
        </div>
    );
}

function VoteComment(props: VoteCommentProps) {

    const [userVote, setUserVote] = useState(props.previousInteractorVote);

    const vote = (userVote: number) => {
        //setUserVote(userVote);

        const toSend = {
            voterId: props.interactorId,
            vote: userVote,
            commentId: props.commentId
        }

        axios.post(`http://${addresses.serverAddress}/update/vote`, toSend)
            .then(response => {
                //alert('You voted for a comment');
                setUserVote(userVote);
            })
    }

    return (
        <div className="comment-vote btn-group">
            <FontAwesomeIcon 
                icon={faPlus} size="xs" 
                className={`vote-plus ${userVote === 1 ? 'active' : ''}`} 
                onClick={() => userVote === 1 ? vote(0) : vote(1)} 
            />
            <FontAwesomeIcon 
                icon={faMinus} size="xs" 
                className={`vote-minus ${userVote === -1 ? 'active' : ''}`} 
                onClick={() => userVote === -1 ? vote(0) : vote(-1)} 
            />
        </div>
    )
}

function BasicComment(props: BasicCommentProps) {

    const [replyBtnClicked, setReplyBtnClicked] = useState(false);
    
    const renderReplyLink = () => {
        if (props.interactable)
            return (
                <div className="link-colored" onClick={() => setReplyBtnClicked(!replyBtnClicked)}>
                    Reply
                </div>
            );
    };

    const renderReply = () => {

        if (replyBtnClicked)
            return (
                <NewComment 
                    authorId={props.userInteractorId!}
                    pageData={props.pageData!}
                    isReply={true} 
                    replyOn={props.commentId} 
                />
            )
    };

    return (
        <p className="comment">
            <div className="comment-head">
                <Link className="username" to={`/user/${props.authorId}`}>{props.authorName}</Link>
                <div className="comment-date">{props.commentDate.toLocaleDateString()}</div>
                <div className={`comment-rating ${props.commentRating >= 0 ? 'comment-good' : 'comment-bad'}`}>{props.commentRating ? props.commentRating : 0}</div>
                {props.interactable ? <VoteComment commentId={props.commentId} interactorId={props.userInteractorId} /> : <></>}
            </div>
            <div className="comment-body">
                {props.commentText}
                {renderReplyLink()}
            </div>
            <CommentReplies interactorId={props.userInteractorId} replies={props?.replies}/>
            {renderReply()}
        </p>
    );
}
