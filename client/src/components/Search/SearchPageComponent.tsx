import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RouteComponentProps, Link } from 'react-router-dom';
import { MangaResponse } from '../../helpers/MangaResponse';
import { postgresToDate } from '../../helpers/ConvertTimestamp';
import '../../css/SearchPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
const addresses = require('../../config');

type SearchPageRouter = {
    query: string
};

interface AdvancedSearchProps {
    resultsUpdater: (res: Array<MangaResponse>) => void;
}

interface SearchPageProps extends RouteComponentProps<SearchPageRouter> {};

function AdvancedSearch(props: AdvancedSearchProps) {
    const [mangaName, setMangaName] = useState("");
    const [authName, setAuthName] = useState("");
    const [minLen, setMinLen] = useState(0);
    const [maxLen, setMaxLen] = useState(10);
    const [status, setStatus] = useState("any");
    const [startLaterYear, setStartLaterYear] = useState(1900);
    const [orderBy, setOrderBy] = useState("nm");
    const [orderAscDesc, setOrderAscDesc] = useState("asc");
    
    const handleSearch = (event: any) => {
        event.preventDefault();
        axios.get(`http://${addresses.serverAddress}/search/advanced?` +
                    `mgname=${mangaName}` +
                    `&authname=${authName}` +
                    `&minlen=${minLen}` +
                    `&maxlen=${maxLen}` +
                    `&st=${status}` +
                    `&startyear=${startLaterYear}` +
                    `&orderby=${orderBy}` +
                    `&order=${orderAscDesc}`)
            .then(response => props.resultsUpdater(response.data as Array<MangaResponse>));
    }

    return (
        <form className="advanced-search" onSubmit={handleSearch}>
            <label htmlFor="manga-name">Name includes</label>
            <input type="text" id="manga-name" 
                onChange={(e: any) => setMangaName(e.currentTarget.value)}
            />
            <label htmlFor="author-name">Author name</label>
            <input type="text" id="author-name" 
                onChange={(e: any) => setAuthName(e.currentTarget.value)}
            />
            <label htmlFor="len">Number of chapters</label>
            <select id="len" onChange={(e: any) => {
                const [min, max] = e.currentTarget.value.split('-');
                setMinLen(parseInt(min));
                setMaxLen(max !== 'inf' ? parseInt(max) : Number.MAX_SAFE_INTEGER);
            }}>
                <option value="0-10">&lt; 10</option>
                <option value="10-50">10 - 50</option>
                <option value="50-200">50 - 200</option>
                <option value="200-inf">&gt; 200</option>
            </select>
            <div>Status</div>
            <div id="status">
                <input type="radio" id="ong" name="status" value="ongoing" 
                    onChange={(e: any) => setStatus(e.currentTarget.value)}
                />
                <label htmlFor="ong">Ongoing</label>
                <input type="radio" id="fin" name="status" value="finished" 
                    onChange={(e: any) => setStatus(e.currentTarget.value)}
                />
                <label htmlFor="fin">Finished</label>
                <input type="radio" id="nosel" name="status" value="any" 
                    onChange={(e: any) => setStatus(e.currentTarget.value)}
                />
                <label htmlFor="nosel">Any status</label>
            </div>
            <label htmlFor="started">Started later than</label>
            <input type="year" id="started" min="1900" 
                onChange={(e: any) => setStartLaterYear(e.currentTarget.value)}
            />
            <label htmlFor="order-by">Order by</label>
            <select id="order-by" 
                onChange={(e: any) => setOrderBy(e.currentTarget.value)}>
                <option defaultChecked value="nm">Name</option>
                <option value="auth">Author</option>
                <option value="pop">Bookmarks</option>
            </select>
            <label htmlFor="order">Order</label>
            <select id="order" 
                    onChange={(e: any) => setOrderAscDesc(e.currentTarget.value)}>
                <option defaultChecked value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            <button className="btn" type="submit">Search <FontAwesomeIcon icon={faSearch} /></button>
        </form>
    );
}

export default function SearchPage(props: SearchPageProps) {
    const [query, setQuery] = useState<string>();
    const [response, setResponse] = useState<Array<MangaResponse>>();
    const [advancedSearchClicked, setAdvancedSearchClicked] = useState(false);

    useEffect(() => {
        setQuery(props.match.params.query);
        if (query) {
            axios.get(`http://${addresses.serverAddress}/search?nameauthor=${query}`)
                .then(res => {
                    const response = res.data.message;
                    setResponse(response);
                });
        }
    }, [props, query]);

    const queryResults = response?.length ? (
        <table>
            <tr className="table-search">
                <th>Name</th>
                <th>Author</th>
                <th>Description</th>
                <th>Time created</th>
                <th>In bookmarks</th>
                <th>Chapters</th>
            </tr>
            {response?.map(res => (
                <tr>
                    <td><Link to={`/manga/${res.manga_key}`}>{res.name}</Link></td>
                    <td><Link to={`/manga/${res.manga_key}`}>{res.author}</Link></td>
                    <td><Link to={`/manga/${res.manga_key}`}>{res.description}</Link></td>
                    <td><Link to={`/manga/${res.manga_key}`}>{postgresToDate(res.create_time)?.getFullYear()}</Link></td>
                    <td><Link to={`/manga/${res.manga_key}`}>{res.bookmarks_count}</Link></td>
                    <td><Link to={`/manga/${res.manga_key}`}>{res.chapters_count}</Link></td>
                </tr>
            ))}
        </table>
    ) : (
        <h1>
            Search by '{query}' didn't return any results
        </h1>
    );

    return (
        <main>
            <button className="btn btn-advanced-search dropdown" onClick={() => setAdvancedSearchClicked(!advancedSearchClicked)}>Advanced search</button>
            {advancedSearchClicked ? (
                <div className=" advanced-search-box dropdown-content">
                    <AdvancedSearch
                        resultsUpdater={
                            (response: Array<MangaResponse>) => {
                                console.log('The response table is being updated');
                                setResponse(response);
                            }
                        }
                    />
                </div>
            ) : (<></>)}
            {queryResults}
        </main>
    );
}
