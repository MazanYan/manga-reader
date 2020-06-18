import React from 'react';
import '../css/MainManga.css';
import { RouteComponentProps, Route, Link, Router, Redirect, Switch } from 'react-router-dom';
import { MangaResponse, TableOfContentsResponse } from '../helpers/MangaResponse';
import axios from 'axios';
import MangaPageComponent from './MangaPageComponent';
import { getYear, postgresToDate } from '../helpers/ConvertTimestamp';

interface TableOfContentsProps {
    chapters: Array<TableOfContentsResponse>,
    path: string
};

interface MangaMainPageState {
    tableOfContentsOpened: boolean,
    mangaData?: MangaResponse,
    tableOfContents?: Array<TableOfContentsResponse>
}

interface MangaMainPageProps {
    manga: string,
    id: string
};

/*interface RenderPageProps {
    render: MangaResponse
}*/

interface Props extends RouteComponentProps<MangaMainPageProps> {};

function RenderTableOfContents(props: TableOfContentsProps) {
    if (props.chapters.length)
        return (
            <table id="tableOfContents">
                <thead>
                    <tr key={0}>
                        <th>Volume</th>
                        <th>Chapter</th>
                    </tr>
                </thead>
                <tbody>
                    {props.chapters.map(chapt => (
                        <tr key={chapt.number}>
                            <td>
                                <Link to={`${props.path}/${chapt.number}/1`}>
                                    {chapt.volume}
                                </Link>
                            </td>
                            <td>
                                <Link to={`${props.path}/${chapt.number}/1`}>
                                    {chapt.number} - {chapt.name}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    else return (<p>This manga has no added chapters yet.</p>);
}

export default class MangaMainComponent extends React.Component<Props, MangaMainPageState> {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            tableOfContentsOpened: false,
            tableOfContents: []
        };
        this.renderTableOfContents = this.renderTableOfContents.bind(this);
    }

    async componentDidMount() {
        const mangaId = {
            toSearch: parseInt(this.props.match.params.id, 10)
        };
        const mangaData: MangaResponse = await (await axios.post(`http://localhost:3000/search/mangaId`, mangaId)).data.message[0];
        const tableOfContents: Array<TableOfContentsResponse> = await (await axios.post(`http://localhost:3000/search/mangaId/toc`, mangaId)).data.message;
        this.setState({
            mangaData: mangaData,
            tableOfContents: tableOfContents ? tableOfContents : []
        });
    }

    renderTableOfContents() {
        if (this.state.tableOfContentsOpened) {
            return (
                <RenderTableOfContents path={this.props.location.pathname} chapters={this.state.tableOfContents!} />
            );
            
        }
    }

    render() {
        const toRender = this.state.mangaData;
        return (
            <main>
                <div id="mangaMainPage">
                    <img id="imagePlaceholder" src={`http://localhost:3000/images/thumb/${toRender?.thumbnail}`}/>
                    <div id="description">
                        <strong>Name: </strong>{toRender?.name}<br/>
                        <strong>Author: </strong>{toRender?.author}<br/>
                        <strong>Status: </strong>{toRender?.manga_status !== null ? toRender?.manga_status : "unknown"}<br/>
                        <strong>Years: </strong>{postgresToDate(toRender?.create_time)?.getFullYear()} - {toRender?.time_completed !== null ?
                                     postgresToDate(toRender?.time_completed)?.getFullYear() : "now"}<br/>
                        <strong>Description: </strong>{toRender?.description}<br/>
                    </div>
                    <div id="otherInfo">
                        <p>{toRender?.bookmarks_count} people added this manga to bookmarks</p>
                        <p>Last updated at {toRender?.last_modify_time ? postgresToDate(toRender?.last_modify_time)?.toLocaleDateString() : "unknown time"}</p>
                    </div>
                    <button id="openTableOfContents" onClick={() => this.setState({tableOfContentsOpened: !this.state.tableOfContentsOpened})}>Table of Contents</button>
                    <div id="tableOfContents">{this.renderTableOfContents()}</div>
                </div>
            </main>
        );
        
    }
}

/*
<div id="namePlaceholder">{toRender?.name}</div>
<div id="authorPlaceholder">{toRender?.author}</div>
<div id="descriptionPlaceholder">{toRender?.description}</div>
*/
