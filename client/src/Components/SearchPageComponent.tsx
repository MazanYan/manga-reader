import React from 'react';
import axios from 'axios';
import { Redirect, RouteComponentProps, Link } from 'react-router-dom';
import queryString from 'query-string';

type MangaResponse = {
    name: string,
    author: string,
    description: string,
    manga_key: string,
    bookmarks_count: Number,
    add_time: Date
};

type SearchPageState = {
    response: Array<MangaResponse>
};

type SearchPageProps = {
    query: string
};

interface Props extends RouteComponentProps<SearchPageProps> {};

export default class SearchPageComponent extends React.Component<Props, SearchPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            response: []
        };
        this.renderResponse = this.renderResponse.bind(this);
    }

    async componentDidMount() {
        const query = {
            toSearch: this.props.match.params.query.slice(1)
        };
        const response: Array<MangaResponse> = await (await axios.post(`http://localhost:3000/search`, query)).data.message;
        this.setState({response: response});
    }

    renderResponse() {
        return (
            <table>
                <tr>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Description</th>
                    <th>Time added</th>
                </tr>
                {this.state.response.map(res => (
                    <tr>
                        <td><Link to={`/manga/:${res.manga_key}`}>{res.name}</Link></td>
                        <td><Link to={`/manga/:${res.manga_key}`}>{res.author}</Link></td>
                        <td><Link to={`/manga/:${res.manga_key}`}>{res.description}</Link></td>
                        <td><Link to={`/manga/:${res.manga_key}`}>{res.add_time}</Link></td>
                    </tr>
                ))}
            </table>
        )
    }

    render() {
        return (
            <React.Fragment>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Time added</th>
                    </tr>
                    {this.state.response.map(res => (
                        <tr>
                            <td><Link to={`/manga/:${res.manga_key}`}>{res.name}</Link></td>
                            <td><Link to={`/manga/:${res.manga_key}`}>{res.author}</Link></td>
                            <td><Link to={`/manga/:${res.manga_key}`}>{res.description}</Link></td>
                            <td><Link to={`/manga/:${res.manga_key}`}>{res.add_time}</Link></td>
                        </tr>
                    ))}
                </table>
            </React.Fragment>
        );
    }
}