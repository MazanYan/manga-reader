import React from 'react';
import '../../css/MangaPage.css';
import { RouteComponentProps, Link, Router } from 'react-router-dom';
import axios from 'axios';

const addresses = require('../../config');

interface MangaPageRouterProps {
    manga: string,
    id: string,
    chapter: string,
    ch: string,
    page: string,
    pg: string
};

interface MangaPageProps extends RouteComponentProps<MangaPageRouterProps> {};

interface MangaPageState {
    image?: string,
    volume?: number,
    chapterName?: string, 
    mangaName?: string,
    nextChapter?: number,
    prevChapter?: number,
    pagesCountChapter?: number
};

export default class MangaPage extends React.Component<MangaPageProps, MangaPageState> {

    constructor(props: MangaPageProps) {
        super(props);
        this.state = {};
        this.renderPrevChapterButton = this.renderPrevChapterButton.bind(this);
        this.renderNextChapterButton = this.renderNextChapterButton.bind(this);
    }

    async componentDidMount() {
        const manga = parseInt(this.props.match.params.id);
        const chapter = parseInt(this.props.match.params.ch);
        const page = parseInt(this.props.match.params.pg);

        const result = await (
                await axios.get(`http://${addresses.serverAddress}/search/manga=${manga}/chapter=${chapter}/page=${page}`)
            ).data.response;
        const gen = result.generalPageData[0];
        //console.log(result);
        this.setState({
            image: gen.image,
            volume: gen.volume,
            chapterName: gen.chapter_name,
            mangaName: gen.manga_name,
            pagesCountChapter: gen.pages_count,
            prevChapter: result.prevChapter,
            nextChapter: result.nextChapter
        });
        console.log(this.state);
    }

    renderPrevChapterButton() {
        if (this.state.prevChapter)
            return (
                <a href={`/manga/${this.props.match.params.id}/chapter${this.state.prevChapter}/page1`}>
                    <div id="prev-chapter" className="chapter-button">
                        <i className="fa fa-arrow-left"/><br/>
                        Previous chapter
                    </div>
                </a>
            );
        else 
            return (
                <div id="prev-chapter" className="chapter-button inactive">
                    <i className="fa fa-arrow-left"/><br/>
                    Previous chapter
                </div>
            )
    }

    renderNextChapterButton() {
        if (this.state.nextChapter)
            return (
                <a href={`/manga/${this.props.match.params.id}/chapter${this.state.nextChapter}/page1`}>
                    <div id="next-chapter" className="chapter-button">
                        <i className="fa fa-arrow-right"/><br/>
                        Next chapter
                    </div>
                </a>
            );
        else 
            return (
                <div id="next-chapter" className="chapter-button inactive">
                    <i className="fa fa-arrow-right"/><br/>
                    Next chapter
                </div>
            )
    }

    render() {
        return (
            <>
                <div className="header page-head">
                    <h3><Link to={`/manga/${this.props.match.params.id}`}>{this.state.mangaName}</Link></h3>
                    <strong>Volume {this.state.volume}. Chapter {this.props.match.params.ch} - {this.state.chapterName}</strong>
                </div>
                <main>
                    <div className="chapter-buttons">
                        {this.renderPrevChapterButton()}
                        {this.renderNextChapterButton()}
                    </div>
                    <div className="manga-page">
                        <div className="page-body">
                            <div className="square">
                                <img className="page-image" src={`http://${addresses.serverAddress}/images/manga_pages/${this.state.image}`}/>
                            </div>
                            <div className="pagination">
                                {
                                    Array.apply(null, Array(this.state.pagesCountChapter))
                                        .map(function (_, i) {return i+1})
                                        .map(i => {
                                            if (i === parseInt(this.props.match.params.pg))
                                                return (
                                                    <div className="page-link inactive">{i}</div>
                                                )
                                            else
                                                return (
                                                    <a href={`http://${addresses.clientAddress}/manga/${this.props.match.params.id}/chapter${this.props.match.params.ch}/page${i}`}>
                                                        <div className="page-link">
                                                            {i}
                                                        </div>
                                                    </a>
                                                )
                                        })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="manga-page">
                        <div className="page-body comments">
                            Comments:<br/>
                            <h1>TBA</h1>
                        </div>
                    </div>
                </main>
            </>
        );
    }
}
