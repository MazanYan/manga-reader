import React from 'react';
import axios from 'axios';
import { RouteComponentProps, Link } from 'react-router-dom';
import { MangaResponse } from '../helpers/MangaResponse';

type SearchPageState = {
    query: string,
    response?: Array<MangaResponse>
    responseReceived: boolean
};

type SearchPageProps = {
    query: string
    
};

interface Props extends RouteComponentProps<SearchPageProps> {};

export default class SearchPageComponent extends React.Component<Props, SearchPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            query: this.props.match.params.query.slice(1),
            responseReceived: false
        };
    }

    async componentDidMount() {
        if (this.state.query) {
            const response: Array<MangaResponse> = await (await axios.post(`http://localhost:3000/search`, {toSearch: this.state.query})).data.message;
            if (response.length)
                this.setState({responseReceived: true});
            this.setState({response: response});
        }
    }

    render() {
        if (this.state.responseReceived)
            return (
                <main>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Time created</th>
                        </tr>
                        {this.state.response?.map(res => (
                            <tr>
                                <td><Link to={`/manga/${res.manga_key}`}>{res.name}</Link></td>
                                <td><Link to={`/manga/${res.manga_key}`}>{res.author}</Link></td>
                                <td><Link to={`/manga/${res.manga_key}`}>{res.description}</Link></td>
                                <td><Link to={`/manga/${res.manga_key}`}>{res.create_time}</Link></td>
                            </tr>
                        ))}
                    </table>
                </main>
            );
        else return (
            <main>
                <h1>Search by '{this.state.query}' didn't get any results</h1>
            </main>
        );
    }
}
