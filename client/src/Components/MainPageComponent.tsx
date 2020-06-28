import React from 'react';
import '../css/MainPage.css';
import { MangaResponse } from '../helpers/MangaResponse';
import { postgresToDate, getYear } from '../helpers/ConvertTimestamp';
import axios from 'axios';
import { Link } from 'react-router-dom';
const addresses = require('../config');

interface MainPageState {
    popular?: Array<MangaResponse>,
    recent?: Array<MangaResponse>,
    random?: Array<MangaResponse>
};

function RenderMangaCard(props?: MangaResponse) {
    return (
        <Link to={`/manga/${props?.manga_key}`}>
            <div className="card main-page-card">
                <img src={`http://${addresses.serverAddress}/images/thumb/${props?.thumbnail}`}/>
                <div className="container">
                    <div>
                        <h4><b>{props?.name}</b></h4>
                        <p>{props?.author}</p>
                        <p>Written at: {postgresToDate(props?.create_time)?.getFullYear()}</p>
                        <p>Bookmarks added: {props?.bookmarks_count}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default class MainPageComponent extends React.Component<{}, MainPageState> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const request = {
            limit: 6
        };
        const mangaData = await (await axios.get(`http://${addresses.serverAddress}/search/main_page&lim=${request.limit}`)).data.response;
        this.setState({
            popular: mangaData.popular,
            recent: mangaData.recent,
            random: mangaData.random
        });
    }
    
    render() {
        const { popular, recent, random } = this.state;
        return (
            <React.Fragment>
                <div className="header">
                    <p>Welcome to Manga Reader!</p>
                </div>
                <main id="main-page">
                        <div className="main-page-row">
                            <div className="main-page-row-head">
                                <h2>Top popular manga:</h2>
                            </div>
                            <div className="main-page-row-content">
                                {popular?.map((manga: MangaResponse) => <RenderMangaCard {...manga}/>)}
                            </div>
                        </div>
                        <div className="main-page-row">
                            <div className="main-page-row-head">
                                <h2>Top new manga:</h2>
                            </div>
                            <div className="main-page-row-content">
                                {recent?.map((manga: MangaResponse) => <RenderMangaCard {...manga}/>)}
                            </div>
                        </div>
                        <div className="main-page-row">
                            <div className="main-page-row-head">
                                <h2>Random manga:</h2>
                            </div>
                            <div className="main-page-row-content">
                                {random?.map((manga: MangaResponse) => <RenderMangaCard {...manga}/>)}
                            </div>
                        </div>
                </main>
            </React.Fragment>
        )
    }
}
