import React from 'react';
import '../css/MainManga.css';
import { RouteComponentProps } from 'react-router-dom';
import { MangaResponse, TableOfContentsResponse } from '../helpers/MangaResponse';
import axios from 'axios';

interface TableOfContentsProps {
    chapters: Array<TableOfContentsResponse>
};

interface MangaMainPageState {
    tableOfContentsOpened: boolean,
    mangaData?: MangaResponse,
    tableOfContents?: Array<TableOfContentsResponse>
}

interface MangaMainPageProps {
    id: string
};

interface Props extends RouteComponentProps<MangaMainPageProps> {};

function RenderTableOfContents(props: TableOfContentsProps) {
    return (
        <table id="tableOfContents">
            <thead>
                <tr key={0}>
                    <th>Volume</th>
                    <th colSpan={2}>Chapter</th>
                </tr>
            </thead>
            <tbody>
                {props.chapters.map(chapt => (
                    <tr key={chapt.number}>
                        <td>{chapt.volume}</td>
                        <td>{chapt.number}</td>
                        <td>{chapt.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
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
            toSearch: this.props.match.params.id.slice(1)
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
                <RenderTableOfContents chapters={this.state.tableOfContents!} />
            );
            
        }
    }

    render() {
        const toRender = this.state.mangaData;
        return (
            <main>
                <div id="mangaMainPage">
                    <img id="imagePlaceholder" src="http://placekitten.com/g/300/200"/>
                    <div id="namePlaceholder">{toRender?.name}</div>
                    <div id="authorPlaceholder">{toRender?.author}</div>
                    <div id="descriptionPlaceholder">{toRender?.description}</div>
                    <button id="openTableOfContents" onClick={() => this.setState({tableOfContentsOpened: !this.state.tableOfContentsOpened})}>Table of Contents</button>
                    {this.renderTableOfContents()}
                </div>
            </main>
        )
    }
}
