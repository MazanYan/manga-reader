import React from 'react';
import { serverPort } from '../../../config';
import axios from 'axios';


type SearchState = {
    toSearch: string
};

type SearchProps = {

};

type MangaResponse = {
    name: string,
    author: string,
    description: string,
    manga_key: string,
    bookmarks_count: Number,
    add_time: Date
}

export default class SearchComponent extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            toSearch: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({toSearch: ((event.target) as any).value});
    }

    async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const data = {
            toSearch: this.state.toSearch
        };
        let response: Array<MangaResponse>;
        axios.post('http://localhost:3000/search', data)
            .then(function (res) {
                response = res.data.message;
            })
            .catch(function (error) {
                console.log(error);
        });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <input id="mangaName" type="text"></input>
            </form>
        );
    }
}
