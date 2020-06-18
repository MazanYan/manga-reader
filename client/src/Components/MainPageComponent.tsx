import React from 'react';
import '../css/MainPage.css';
import { MangaResponse } from '../helpers/MangaResponse';
import { convertPostgresTimestampDate, getYear } from '../helpers/ConvertTimestamp';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface MainPageState {
    popular?: Array<MangaResponse>,
    recent?: Array<MangaResponse>,
    random?: Array<MangaResponse>
};

/*interface MangaCardMainProps {
    image?: string,
    name?: string,
    author?: string,
    description?: string,
    timeAdded?: string,
    //className?: any
}*/

function RenderMangaCard(props?: MangaResponse) {
    return (
        <Link to={`/manga/${props?.manga_key}`}>
            <div className="card main-page-card">
                <img src={`http://localhost:3000/images/thumb/${props?.thumbnail}`}/>
                <div className="container">
                    <div>
                        <h4><b>{props?.name}</b></h4>
                        <p>{props?.author}</p>
                        <p>Written at: {convertPostgresTimestampDate(props?.create_time.toString())?.getFullYear()}</p>
                        <p>Bookmarks added: {props?.bookmarks_count}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default class MainPageComponent extends React.Component<any, MainPageState> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    /*async getLoginPage() {
        const result = await fetch('http:/localhost:3000/login');
        alert(result);
        return (
            <div>
                {result.text}
            </div>
        )
    }*/

    async componentDidMount() {
        const request = {
            limit: 6
        };
        const mangaData = await (await axios.post(`http://localhost:3000/search/main_page`, request)).data.response;
        //console.log("Manga Data:");
        //console.log(mangaData);
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
