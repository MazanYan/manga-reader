import React from 'react';
import { serverPort } from '../../../config';

type SearchState = {
    toSearch: string
};

type SearchProps = {

};

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
        //event.preventDefault();
        this.setState({toSearch: ((event.target) as any).value})
        //alert(this.state.toSearch);
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const data = this.state.toSearch;
        fetch(`http://localhost:${serverPort}/search`, {
                method: 'GET',
                body: data
        });
        //alert(this.state.toSearch);
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
