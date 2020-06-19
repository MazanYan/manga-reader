import React from 'react';
import '../css/ContributionPage.css';
import { getThumbnailName, getMangaPageName } from '../helpers/generateImageName';
import axios from 'axios';
import { MangaStatus } from '../helpers/MangaResponse';

interface ContributionProps {

};

interface ContributionState {
    pageSelected: number,
    responseReceived: boolean,

    isMangaOngoing: boolean,

    name?: string,
    author?: string,
    year?: number | string,
    yearCompleted?: number | string,
    description?: string,
    thumbnail?: File,

    mangaName?: string,
    chapterName?: string,
    chapterNumber?: number,
    chapterVolume?: number,
    imagesChapterUploaded: boolean,
    imagesChapter?: Array<File>
    //imagesChapterNames?: Array<string>
}

export default class ContributionComponent extends React.Component<ContributionProps, ContributionState> {

    constructor(props: ContributionProps) {
        super(props);
        this.state = {
            pageSelected: 1,
            responseReceived: false,

            isMangaOngoing: false,

            name: undefined,
            author: undefined,
            year: undefined,
            description: undefined,
            thumbnail: undefined,

            mangaName: undefined,
            chapterName: undefined,
            chapterNumber: undefined,
            chapterVolume: undefined,
            imagesChapterUploaded: false
        };

        this.handleSubmitManga = this.handleSubmitManga.bind(this);
        this.handleSubmitChapter = this.handleSubmitChapter.bind(this);
        this.AddMangaComponent = this.AddMangaComponent.bind(this);
        this.AddChapterComponent = this.AddChapterComponent.bind(this);
        this.AddPagesComponent = this.AddPagesComponent.bind(this);
        this.RenderAddComponent = this.RenderAddComponent.bind(this);
        this.renderNamesUploadedImages = this.renderNamesUploadedImages.bind(this);
        this.switchOngoing = this.switchOngoing.bind(this);
        this.renderYearCompleted = this.renderYearCompleted.bind(this);
    }

    handleSubmitManga(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.name || !this.state.author || !this.state.year || !this.state.description || !this.state.thumbnail) {
            alert(`'${this.state.name}' in form is not entered!`);
            return;
        }
        /*for (const [property, value] of Object.entries(this.state))
            if (!value) {
                alert(`'${property}' in form is not entered!`);
                return;
            }*/
        //alert('form can be submitted!');
        
        // render new filename on client side
        const newFileName = getThumbnailName(this.state.name, this.state.thumbnail!.type.slice(6));
        const file = new File([this.state.thumbnail!], newFileName);

        const toSubmit = {
            name: this.state.name,
            author: this.state.author,
            descr: this.state.description,
            time: this.state.year,
            fileName: newFileName
        }
        //file.name = 
        const data = new FormData();
        data.append('file', file);
        data.append('name', file.name);
        //console.log(file);
        
        const fileSendPromise = axios.post('http://localhost:3000/upload/thumb', data);
        const dataSendPromise = axios.post('http://localhost:3000/add/manga', toSubmit);
        
        Promise.all([fileSendPromise, dataSendPromise])
            .then((response: any) => {
                this.setState({responseReceived: true});
                if (response[0].data.result)
                    alert(response[0].data.result)
            });
    }

    handleSubmitChapter(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.mangaName || 
            !this.state.chapterName || 
            !this.state.chapterNumber || !
            this.state.chapterVolume || 
            !this.state.imagesChapter ||
            (!this.state.isMangaOngoing && !this.state.yearCompleted)) {
                alert('Property is undefined!');
                return;
        }
        //alert('Alles ist gut!');
        
        /* Set new names for files on client side */
        const newFileNames = this.state.imagesChapter.map((img, index) => 
            getMangaPageName(this.state.mangaName, 
                this.state.chapterVolume, 
                this.state.chapterNumber,
                index+1,
                img.type.slice(6)));
        
        let filesWithNewNames: Array<File> = [];
        for (let i = 0; i < newFileNames.length; i++)
            filesWithNewNames.push(new File([this.state.imagesChapter[i]], newFileNames[i]));
        
        const fileSendPromises = [];
        for (let i = 0; i < newFileNames.length; i++) {
            const data = new FormData();
            data.append('file', filesWithNewNames[i]);
            data.append('name', filesWithNewNames[i].name);
            fileSendPromises.push(axios.post('http://localhost:3000/upload/manga_pages', data));
        }

        const generalChapterData = {
            mangaName: this.state.mangaName!,
            chapterName: this.state.chapterName!,
            chapterNumber: this.state.chapterNumber!,
            chapterVolume: this.state.chapterVolume!,
            status: this.state.isMangaOngoing ? MangaStatus.ongoing : MangaStatus.finished,
            yearCompleted: this.state.yearCompleted,
            images: newFileNames
        };
        
        console.log(generalChapterData);
        fileSendPromises.push(axios.post('http://localhost:3000/add/chapter', generalChapterData));

        Promise.all(fileSendPromises)
            .then((response: any) => {
                if (response[0].data.result)
                    alert(response[0].data.result)
            });
    }

    switchOngoing() {
        this.setState({isMangaOngoing: !this.state.isMangaOngoing});
        
    }

    renderYearCompleted() {
        if(!this.state.isMangaOngoing)
            return (
                <>
                    <label htmlFor="yearEnd">Year when manga was completed:</label>
                    <input type="number" min="1930" max="2020" name="yearEnd" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({yearCompleted: e.currentTarget.value })}/>
                </>
            );
        else return (<></>);
    }

    AddMangaComponent() {
        return (
            <div className="card card-contrib">
                <h2>Add new manga:</h2>
                <form onSubmit={this.handleSubmitManga}>
                    <label htmlFor="name">Add name:</label>
                    <input type="text" name="name" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({name: e.currentTarget.value})}/>
                    <label htmlFor="author">Add author:</label>
                    <input type="text" name="author" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({author: e.currentTarget.value })}/>
                    <label htmlFor="year">Year when manga was started:</label>
                    <input type="number" min="1930" max="2020" name="year" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({year: e.currentTarget.value })}/>
                    <label htmlFor="ongoing">Is manga currently ongoing?</label>
                    <input type="checkbox" checked={this.state.isMangaOngoing} onChange={this.switchOngoing} />
                    {this.renderYearCompleted()}
                    <label htmlFor="descr">Add description:<br/>(max 1500 symbols)</label>
                    <textarea name="descr" maxLength={1500} rows={4} onChange={
                    (e: React.FormEvent<HTMLTextAreaElement>) =>
                    this.setState({description: e.currentTarget.value })}/>
                    <label htmlFor="thumbnail">Upload thumbnail</label>
                    <input name="thumbnail" type="file" accept="image/*" onChange={
                        (e: any) => {
                            const uploaded = e.target.files[0];
                            if (uploaded.type.match("image/*"))
                                this.setState({thumbnail: uploaded });
                            else {
                                alert('You are attempting to submit not image for thumbnail!');
                            }
                        }
                    }/>
                    <input className="btn" type="submit" value="Send"/>
                </form>
            </div>
        );
    }

    renderNamesUploadedImages() {
        if (this.state.imagesChapterUploaded) {
            const imagesNames = this.state.imagesChapter!.map(img => img.name);
            console.log(imagesNames);
            if (this.state.imagesChapterUploaded)
                return imagesNames.map((image:string) => (
                    <>
                    <br/>{image}
                    </>
                ));
        }
    }

    AddChapterComponent() {
        return (
            <div className="card card-contrib">
                <h2>Add new chapter:</h2>
                <form onSubmit={this.handleSubmitChapter} className="card-form">
                    <label htmlFor="manga">For manga (by name):</label>
                    <input type="text" name="manga" onChange={
                        (e: any) =>
                        this.setState({mangaName: e.currentTarget.value}/*oldState => { 
                            console.log(oldState);
                            const value = e.currentTarget.value;
                            let addChapter = Object.assign({}, oldState.addChapter);
                            addChapter.mangaName = value;
                            return { addChapter }
                        }*/)}/>
                    <label htmlFor="name">Add name:</label>
                    <input type="text" name="name" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({chapterName: e.currentTarget.value}/*oldState => {
                            const value = e.currentTarget.value;
                            let addChapter = Object.assign({}, oldState.addChapter);
                            addChapter.chapterName = value;
                            return { addChapter }
                        }*/)}/>
                    <label htmlFor="volume">Add volume:</label>
                    <input type="number" min="0" name="volume" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({chapterVolume: parseInt(e.currentTarget.value)}/*oldState => {
                            const value = e.currentTarget.value;
                            let addChapter = Object.assign({}, oldState.addChapter);
                            addChapter.number = parseInt(value);
                            return { addChapter }
                        }*/)}/>
                    <label htmlFor="chapter">Add chapter number</label>
                    <input type="number" min="0" name="chapter" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({chapterNumber: parseInt(e.currentTarget.value)}/*oldState => {
                            const value = e.currentTarget.value;
                            let addChapter = Object.assign({}, oldState.addChapter);
                            addChapter.volume = parseInt(value);
                            return { addChapter }
                        }*/)}/>
                    <label htmlFor="pages">Upload pages</label>
                    <input name="pages" multiple type="file" accept="image/*" onChange={
                        (e: any) => {
                            const uploaded = [...e.target.files];
                            if (uploaded.every((el: File) => el.type.match("image/*")))
                                this.setState({imagesChapter: uploaded/*uploaded.map((el: File) => el.name)*/, imagesChapterUploaded: true}/*oldState => { 
                                    let addChapter = Object.assign({}, oldState.addChapter);
                                    addChapter.imagesChapterUploaded = true;
                                    addChapter.imagesChapterNames = uploaded.map((el: File) => el.name);
                                    return { addChapter };
                                    /*imagesChapterUploaded: true,
                                    imagesChapterNames: uploaded.map((el: File) => el.name)*/
                                /*}*/);
                            else {
                                alert('You are attempting to submit not image for thumbnail!');
                            }
                        }
                    }/>
                    <div id="images-order">
                        <h4>Images will be added in this order:</h4>
                        <p>{this.renderNamesUploadedImages()}</p>
                    </div>
                    <input type="submit" value="Send"/>
                </form>
            </div>
        );
    }

    AddPagesComponent() {
        return (
            <div className="card card-contrib">
                <h2>Add/Edit/Delete pages of chapter:</h2>
                <form onSubmit={this.handleSubmitManga}>
                    TBA
                </form>
            </div>
        )
    }

    RenderAddComponent() {
        switch (this.state.pageSelected) {
            case 1: return this.AddMangaComponent();
            case 2: return this.AddChapterComponent();
            case 3: return this.AddPagesComponent();
        }
    }

    render() {
        return (
            <>
                <div className="header">
                    <p>A page where you can make your contribution into manga reader</p>
                </div>
                <main className="contributions-main">
                    <div className="btn-group">
                        <button className="btn-contrib" onClick={() => this.setState({pageSelected: 1})}>Add manga</button>
                        <button className="btn-contrib" onClick={() => this.setState({pageSelected: 2})}>Add chapter</button>
                        <button className="btn-contrib" onClick={() => this.setState({pageSelected: 3})}>Add pages to chapter</button>
                    </div>
                        {this.RenderAddComponent()}
                </main>
            </>
        )
    }
}
