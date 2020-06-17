import React from 'react';
import '../css/MainPage.css';
import MangaPageComponent from './MangaPageComponent';
import { Link } from 'react-router-dom';

interface MainPageProps {

};

interface MangaCardMainProps {
    image?: any,
    name?: string,
    author?: string,
    description?: string,
    timeAdded?: string,
    //className?: any
}

function RenderMangaCard(props: MangaCardMainProps) {
    return (
        <Link to="/manga/4">
            <div className="card">
                <img src="http://placekitten.com/g/300/200"/>
                <div className="container">
                    <div className="mangaName">
                        <h4><b>Naruto</b></h4>
                    </div>
                    <div className="mangaAuthor">
                        <p>Masashi Kishimoto</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default class MainPageComponent extends React.Component<MainPageProps> {

    async getLoginPage() {
        const result = await fetch('http:/localhost:3000/login');
        alert(result);
        return (
            <div>
                {result.text}
            </div>
        )}

    render() {
        return (
            <React.Fragment>
                <div className="header">
                    <p>Welcome to Manga Reader!</p>
                </div>
                <main id="main-page">
                        <div className="main-page-row">
                            <div className="main-page-row-head">
                                <h2>Top five popular manga:</h2>
                            </div>
                            <div className="main-page-row-content">
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                            </div>
                        </div>
                        <div className="main-page-row">
                            <div className="main-page-row-head">
                                <h2>Top five new manga:</h2>
                            </div>
                            <div className="main-page-row-content">
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                            </div>
                        </div>
                        <div className="main-page-row">
                            <div className="main-page-row-head">
                                <h2>Five random manga:</h2>
                            </div>
                            <div className="main-page-row-content">
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                                {RenderMangaCard({})}
                            </div>
                        </div>
                </main>
            </React.Fragment>
        )
    }
}
