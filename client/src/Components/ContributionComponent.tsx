import React from 'react';
import { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

interface ContributionProps {

};

interface ContributionState {
    pageSelected: number;
    name?: string,
    author?: string,
    year?: number | string,
    description?: string,
    thumbnail?: File
}

function AddMangaComponent() {
    return (
        <div className="card">
            Ranctor
        </div>
    );
}

function AddChapterComponent() {
    return (
        <div className="card">
            Andomer
        </div>
    );
}

export default class ContributionComponent extends React.Component<ContributionProps, ContributionState> {

    constructor(props: ContributionProps) {
        super(props);
        this.state = {
            pageSelected: 1,
            name: undefined,
            author: undefined,
            year: undefined,
            description: undefined,
            thumbnail: undefined
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    /*
export interface MangaResponse {
    name: string,
    author: string,
    description: string,
    manga_key: string,
    bookmarks_count: Number,
    create_time: Date,
    update_time: Date,
    thumbnail: string,
    file_format: string
};
    */


    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        for (const [property, value] of Object.entries(this.state))
            if (!value) {
                alert(`'${property}' in form is not entered!`);
                return;
            }
        alert('form can be submitted!');
        const toSubmit = {
            name: this.state.name,
            author: this.state.author,
            description: this.state.description,
            thumbnail: this.state.thumbnail,
            fileFormat: this.state.thumbnail!.type
        }
        axios.post('http://localhost:3000/upload', toSubmit);
    }    

    render() {
        return (
            <>
                <div className="header">
                    <p>A page where you can make your contribution into manga reader</p>
                </div>
                <main>
                    <h2>Add new manga:</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">Add name:</label>
                        <input type="text" name="name" onChange={
                            (e: React.FormEvent<HTMLInputElement>) =>
                            this.setState({ name: e.currentTarget.value })
                        }/>
                        <label htmlFor="author">Add author:</label>
                        <input type="text" name="author" onChange={
                            (e: React.FormEvent<HTMLInputElement>) =>
                            this.setState({ author: e.currentTarget.value })
                        }/>
                        <label htmlFor="year">Year when manga was created:</label>
                        <input type="number" defaultValue="2000" min="1900" max="2020" name="year" onChange={
                            (e: React.FormEvent<HTMLInputElement>) =>
                            this.setState({ year: e.currentTarget.value })
                        }/>
                        <label htmlFor="descr">Add description:<br/>(max 1500 symbols)</label>
                        <textarea name="descr" maxLength={1500} rows={4} onChange={
                            (e: React.FormEvent<HTMLTextAreaElement>) =>
                            this.setState({ description: e.currentTarget.value })
                        }/>
                        <label htmlFor="thumbnail">Upload thumbnail</label>
                        <input name="thumbnail" type="file" accept="image/*" onChange={
                            (e: any) => {
                                const uploaded = e.target.files[0];
                                if (uploaded.type.match("image/*"))
                                    this.setState({ thumbnail: uploaded });
                                else {
                                    alert('You are attempting to submit not image for thumbnail!');
                                }
                            }
                        }/>
                        <input type="submit" value="Send"/>
                    </form>
                </main>
            </>
        )
    }
}
/*
<Switch>
    <Route to="/" component={AddMangaComponent}/>
    <Route to="/new_manga" component={AddMangaComponent}/>
    <Route to="/new_chapter" component={AddChapterComponent}/>
</Switch>*/