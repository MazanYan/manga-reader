import React from 'react';
import '../css/MangaPage.css';
import { RouteComponentProps } from 'react-router-dom';

interface MangaPageRouterProps {
    manga: string,
    id: string,
    chapter: string,
    ch: string,
    page: string,
    pg: string
};

interface MangaPageProps extends RouteComponentProps<MangaPageRouterProps> {};

export default class MangaPageComponent extends React.Component<MangaPageProps> {

    componentDidMount() {
        const toSearch = {
            manga: parseInt(this.props.match.params.id),
            chapter: parseInt(this.props.match.params.ch),
            page: parseInt(this.props.match.params.pg)
        };

        console.log(toSearch);
    }

    render() {
        return (
            <>
                <div className="header page-head">
                    <h3>Fullmetal Alchemist</h3>
                    <strong>Vol. 1. Chapter 1 - The Two Alchemists</strong>
                </div>
                <main>
                    <div className="chapter-buttons">
                        <div id="prev-chapter" className="chapter-button">
                            <i className="fa fa-arrow-left"/><br/>
                            Previous chapter
                            </div>
                        <div id="next-chapter" className="chapter-button">
                            <i className="fa fa-arrow-right"/><br/>
                            Next chapter
                        </div>
                    </div>
                    <div className="manga-page">
                        <div className="page-body">
                            <div className="square">
                                <img className="page-image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/800px-Juvenile_Ragdoll.jpg"/>
                            </div>
                            <div className="pagination">
                                <div className="page-link">1</div>
                                <div className="page-link">2</div>
                                <div className="page-link">3</div>
                                <div className="page-link">4</div>
                                <div className="page-link">5</div>
                                <div className="page-link">6</div>
                                <div className="page-link">7</div>
                                <div className="page-link">8</div>
                                <div className="page-link">9</div>
                                <div className="page-link">10</div>
                                <div className="page-link">11</div>
                                <div className="page-link">12</div>
                                <div className="page-link">13</div>
                                <div className="page-link">14</div>
                                <div className="page-link">15</div>
                                <div className="page-link">16</div>
                                <div className="page-link">17</div>
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
