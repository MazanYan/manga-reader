import React from 'react';
import '../css/MainManga.css';
import { RouteComponentProps, Link } from 'react-router-dom';
import { MangaResponse, TableOfContentsResponse } from '../helpers/MangaResponse';
import axios from 'axios';
import { postgresToDate } from '../helpers/ConvertTimestamp';
const config = require('../config');

interface TableOfContentsProps {
    chapters: Array<TableOfContentsResponse>,
    path: string
};

interface MangaMainPageState {
    tableOfContentsOpened: boolean,
    mangaData?: MangaResponse,
    tableOfContents?: Array<TableOfContentsResponse>
}

interface MangaMainPageRouterProps {
    manga: string,
    id: string
};

interface MangaMainPageProps extends RouteComponentProps<MangaMainPageRouterProps> {};

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
                                <Link to={`${props.path}/chapter${chapt.number}/page1`}>
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

export default class MangaMainComponent extends React.Component<MangaMainPageProps, MangaMainPageState> {
    
    constructor(props: MangaMainPageProps) {
        super(props);
        this.state = {
            tableOfContentsOpened: false,
            tableOfContents: []
        };
        this.renderTableOfContents = this.renderTableOfContents.bind(this);
    }

    async componentDidMount() {
        const mangaId = parseInt(this.props.match.params.id)
        console.log(this.props.match.params.id);
        const mangaData: MangaResponse = await (await axios.get(`http://${config.serverAddress}/search/mangaId/${mangaId}`)).data.message[0];
        const tableOfContents: Array<TableOfContentsResponse> = await (await axios.get(`http://${config.serverAddress}/search/mangaId/${mangaId}/toc`)).data.message;
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
                <div id="manga-main-page">
                    <img id="image-placeholder" src={`http://${config.serverAddress}/images/thumb/${toRender?.thumbnail}`}/>
                    <div id="description">
                        <strong>Name: </strong>{toRender?.name}<br/>
                        <strong>Author: </strong>{toRender?.author}<br/>
                        <strong>Status: </strong>{toRender?.manga_status !== null ? toRender?.manga_status : "unknown"}<br/>
                        <strong>Years: </strong>{postgresToDate(toRender?.create_time)?.getFullYear()} - {toRender?.time_completed !== null ?
                                     postgresToDate(toRender?.time_completed)?.getFullYear() : "now"}<br/>
                        <strong>Description: </strong>{toRender?.description}<br/>
                    </div>
                    <div id="other-info">
                        <p>{toRender?.bookmarks_count} people added this manga to bookmarks</p>
                        <p>Last updated at {toRender?.last_modify_time ? postgresToDate(toRender?.last_modify_time)?.toLocaleDateString() : "unknown time"}</p>
                    </div>
                    <button id="open-table-of-contents" onClick={() => this.setState({tableOfContentsOpened: !this.state.tableOfContentsOpened})}>Table of Contents</button>
                    <div id="table-of-contents">{this.renderTableOfContents()}</div>
                </div>
            </main>
        );
        
    }
}
