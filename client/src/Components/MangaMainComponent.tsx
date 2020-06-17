import React from 'react';
import '../css/MainManga.css';
import { RouteComponentProps, Route, Link, Router, Redirect, Switch } from 'react-router-dom';
import { MangaResponse, TableOfContentsResponse } from '../helpers/MangaResponse';
import axios from 'axios';
import MangaPageComponent from './MangaPageComponent';

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
        //alert(this.props.match.params.id);
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
                    <img id="imagePlaceholder" src="http://placekitten.com/g/300/200"/>
                    <div id="namePlaceholder">{toRender?.name}</div>
                    <div id="authorPlaceholder">{toRender?.author}</div>
                    <div id="descriptionPlaceholder">{toRender?.description}</div>
                    <button id="openTableOfContents" onClick={() => this.setState({tableOfContentsOpened: !this.state.tableOfContentsOpened})}>Table of Contents</button>
                    <div id="tableOfContents">{this.renderTableOfContents()}</div>
                </div>
                {/*<Switch>
                    <Route path={`/:chapter/:page`} component={MangaPageComponent}/>
                </Switch>*/}
            </main>
        );
        
    }
}
