import React from 'react';

type MangaPageProps = {};

export default class MangaPageComponent extends React.Component<MangaPageProps> {

    componentDidMount() {
        alert("MangaPageComponent rendered");
    }

    render() {
        return (
            <div id="mangaPage">
                <div id="pageBody">
                    <div id="pageImage">
                        PlanetPletacus_8888
                    </div>
                    <div id="pagination">
                        PlanetRosham!!!!!!!!!!!!!!!!!!!!!!_8888
                    </div>
                </div>
                <div id="comments">

                </div>
            </div>
        )
    }
}
