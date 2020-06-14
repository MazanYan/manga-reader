import React from 'react';
import '../css/MainManga.css';

type MangaMainProps = {};
type TableOfContentsProps = {};
type MangaMainPageState = {
    tableOfContentsOpened: boolean
}

function RenderTableOfContents(props: TableOfContentsProps) {
    return (
        <table id="tableOfContents">
            <tr>
                <th>Volume</th>
                <th>Chapter</th>
            </tr>
            <tr>
                <td>1</td>
                <td>1 - Simple Chapter</td>
            </tr>
        </table>
    )
}

export default class MangaMainComponent extends React.Component<MangaMainProps, MangaMainPageState> {
    constructor(props: MangaMainProps) {
        super(props);
        this.state = {
            tableOfContentsOpened: false
        };

        this.renderTableOfContents = this.renderTableOfContents.bind(this);
    }

    renderTableOfContents() {
        if (this.state.tableOfContentsOpened)
            return (
                <RenderTableOfContents/>
            );
    }

    render() {
        return (
            <main>
                <div id="mangaMainPage">
                    <div id="imagePlaceholder">
                        <img src="http://placekitten.com/g/300/200"/>
                    </div>
                    <div id="namePlaceholder">Sample Manga Name</div>
                    <div id="authorPlaceholder">Sample Manga Author</div>
                    <div id="descriptionPlaceholder">Sample (very short) description</div>
                    <button id="openTableOfContents" onClick={() => this.setState({tableOfContentsOpened: !this.state.tableOfContentsOpened})}>Table of Contents</button>
                    {this.renderTableOfContents()}
                </div>
            </main>
        )
    }
}
