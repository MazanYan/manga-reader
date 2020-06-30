import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, RouteComponentProps, Switch, Route, Link, useRouteMatch, useParams } from 'react-router-dom';
import '../../css/BookmarksPage.css';

const addresses = require('../../config');

interface BookmarkProps {
    mangaName: string,
    volume?: number,
    chapterNum?: number,
    chapterName: string
    page?: string
}

interface BookmarkListProps {
    user: string
}

const bookmarkQueries = {
    rl: "read_later",
    nr: "reading",
    co: "completed",
    fv: "favourite"
}

function Bookmark(props: BookmarkProps) {
    return (
        <>
            Bookmark
        </>
    )
}

function ReadLater(props: BookmarkListProps) {

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/user?user=${props.user}&type=${bookmarkQueries.rl}`) //?user=${props.user}&type=${bookmarkQueries.rl}
            .then(res => console.log(res));
    });

    return (
        <>RL</>
    )
}

function NowReading(props: BookmarkListProps) {

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/${props.user}/${bookmarkQueries.nr}`)
            .then(res => console.log(res));
    });

    return (
        <>NR</>
    )
}

function Completed(props: BookmarkListProps) {

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/${props.user}/${bookmarkQueries.co}`)
            .then(res => console.log(res));
    });

    return (
        <>CO</>
    )
}

function Favourite(props: BookmarkListProps) {

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/bookmarks/${props.user}/${bookmarkQueries.fv}`)
            .then(res => console.log(res));
    });

    return (
        <>FV</>
    )
}

export default function UserBookmarksPage() {
    
    const [pageSelected, setPageSelected] = useState(1);
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
    });
    
    const renderPageSelected = () => {
        switch(pageSelected) {
            case 1: return <ReadLater user={id}/>;
            case 2: return <NowReading user={id}/>;
            case 3: return <Completed user={id}/>;
            case 4: return <Favourite user={id}/>;
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

/*
<div className="bookmarks-selector">
    <Link to={`${url}/rl`} className="btn btn-bookmark-type">Read Later</Link>
    <Link to={`${url}/nr`} className="btn btn-bookmark-type">Currently reading</Link>
    <Link to={`${url}/co`} className="btn btn-bookmark-type">Completed</Link>
    <Link to={`${url}/fv`} className="btn btn-bookmark-type">Favourite</Link>
</div>
<main>
<Switch>
    <Route path={`${path}/:topicId`}>
        <BookmarkPage />
    </Route>
</Switch>
</main>
*/


/*
<ReadLater />
<NowReading />
<Completed />
<Favourite />
*/