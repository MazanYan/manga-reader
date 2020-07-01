import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import BookmarkSelected from '../../helpers/bookmark';
import '../../css/MainManga.css';
import axios from 'axios';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const addresses = require('../../config');

interface BookmarkProps {
    mangaId: number,
    userId: string
}

export default function Bookmark(props: BookmarkProps) {

    const [bookmarkMenuActive, setBookmarkMenuActive] = useState(false);
    const [bookmarkStatus, setBookmarkStatus] = useState<string>();
    const [starIcon, setStarIcon] = useState<IconProp>();//props.isBookmarked ? fasStar : farStar;

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/manga?manga=${props.mangaId}&user=${props.userId}`)
            .then(response => {
                setBookmarkStatus(response.data.status);
                if (response.data.status === "not_added")
                    setStarIcon(farStar);
                else
                    setStarIcon(fasStar);
            });
    }, []);

    const toggleBookmarkMenu = (e: any) => {
        setBookmarkMenuActive(!bookmarkMenuActive);
    }

    const submitBookmarkChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const toSend = {
            userId: props.userId,
            mangaId: props.mangaId,
            newStatus: bookmarkStatus
        };

        axios.post(`http://${addresses.serverAddress}/bookmarks/update`, toSend)
            .then(response => {
                console.log(response);
                alert(`Manga bookmark updated ${response.data}`);
            });
    }

    const BookmarkMenu = () => {
        if (bookmarkMenuActive)
            return (
                <div className="dropdown-content">
                    <form onSubmit={submitBookmarkChange}>
                        {
                            Object.entries(BookmarkSelected).map(([mangaStatus, properties]) => (
                                <div key={mangaStatus} className="bookm-type">
                                    <input 
                                        className="checkbox"
                                        id={mangaStatus}
                                        type="radio" 
                                        defaultChecked={bookmarkStatus === properties.type} 
                                        onChange={_ => setBookmarkStatus(properties.type)} 
                                        name="bookm" value={mangaStatus}
                                    />
                                    <label htmlFor={mangaStatus}>{properties.message}</label>
                                </div>
                            ))
                        }
                        <div className="bookm-type">
                            <button type="submit" className="btn">Update bookmark status</button>
                        </div>
                    </form>
                </div>
            );
        else return (<></>);
    }

    return (
        <>
            <div className="dropdown">
                <FontAwesomeIcon className="icon" icon={starIcon!} onClick={toggleBookmarkMenu}/>
                <BookmarkMenu />
            </div>
        </>
    );
}
