import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RouteComponentProps, Link } from 'react-router-dom';
import { MangaResponse } from '../../helpers/MangaResponse';
import { postgresToDate } from '../../helpers/ConvertTimestamp';
const config = require('../../config');

type SearchPageRouter = {
    query: string
};

interface SearchPageProps extends RouteComponentProps<SearchPageRouter> {};

export default function SearchPageComponent(props: SearchPageProps) {
    const [query, setQuery] = useState<string>();
    const [response, setResponse] = useState<Array<MangaResponse>>();
    const [responseReceived, setResponseReceived] = useState(false);

    useEffect(() => {
        setQuery(props.match.params.query);
        if (query) {
            axios.post(`http://${config.serverAddress}/search`, {toSearch: query})
                .then(res => {
                    const response = res.data.message;
                    if (response.length)
                        setResponseReceived(true);
                    setResponse(response);
                });
        }
    });

    if (responseReceived)
        return (
            <main>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Time created</th>
                    </tr>
                    {response?.map(res => (
                        <tr>
                            <td><Link to={`/manga/${res.manga_key}`}>{res.name}</Link></td>
                            <td><Link to={`/manga/${res.manga_key}`}>{res.author}</Link></td>
                            <td><Link to={`/manga/${res.manga_key}`}>{res.description}</Link></td>
                            <td><Link to={`/manga/${res.manga_key}`}>{postgresToDate(res.create_time)?.getFullYear()}</Link></td>
                        </tr>
                    ))}
                </table>
            </main>
        );
    else return (
        <main>
            <h1>Search by '{query}' didn't get any results</h1>
        </main>
    );
}
