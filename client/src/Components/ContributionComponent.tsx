import React, { useState, useEffect } from 'react';
import '../css/ContributionPage.css';
import { getThumbnailName, getMangaPageName } from '../helpers/generateImageName';
import axios from 'axios';
import verifyToken from '../helpers/VerifyToken';
const config = require('../config');

function AddMangaComponent() {

    const [mangaName, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [yearStarted, setYearStarted] = useState(0);
    const [yearCompleted, setYearCompleted] = useState(0);
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState<File>();
    const [isOngoing, setIsOngoing] = useState(true);

    const switchOngoing = () => {
        setIsOngoing(!isOngoing);
    }  

    const renderYearCompleted = () => {
        if(!isOngoing)
            return (
                <>
                    <label htmlFor="yearEnd">Year when manga was completed:</label>
                    <input type="number" min="1930" max="2020" name="yearEnd" onChange={
                        (e: React.FormEvent<HTMLInputElement>) =>
                        setYearCompleted(parseInt(e.currentTarget.value))
                    }/>
                </>
            );
        else return (<></>);
    }
    
    const handleSubmitManga = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // render new filename on client side
        const newFileName = getThumbnailName(mangaName, thumbnail?.type.slice(6));
        const file = new File([thumbnail!], newFileName);
        
        const toSubmit = {
            name: mangaName,
            author: author,
            descr: description,
            yearStarted: yearStarted,
            fileName: newFileName,
            status: isOngoing ? 'ongoing' : 'finished',
            yearEnd: yearCompleted
        }
        
        const {status, yearEnd, ...checkNull} = toSubmit;
        for (const [property, value] of Object.entries(checkNull))
            if (!value) {
                alert(`'${property}' in form is not entered!`);
                return;
            }
        
        if (status === 'finished' && !yearEnd) {
            alert(`Manga is finished but end year is not defined!`);
                return;
        }
        

        console.log(toSubmit);
        const data = new FormData();
        data.append('file', file);
        data.append('name', file.name);
        
        const fileSendPromise = axios.post(`http://${config.serverAddress}/upload/thumb`, data);
        const dataSendPromise = axios.post(`http://${config.serverAddress}/add/manga`, toSubmit);
        
        Promise.all([fileSendPromise, dataSendPromise])
            .then((response: any) => {
                if (response[0].data.result)
                    alert(response[0].data.result)
            });
    }

    return (
        <div className="card card-contrib">
            <h2>Add new manga:</h2>
            <form onSubmit={handleSubmitManga} className="form-contrib">
                <label htmlFor="name">Add name:</label>
                <input type="text" name="name" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                    setName(e.currentTarget.value)}
                />
                <label htmlFor="author">Add author:</label>
                <input type="text" name="author" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                    setAuthor(e.currentTarget.value)}
                />
                <label htmlFor="year">Year when manga was started:</label>
                <input type="number" min="1930" max="2020" name="year" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                    setYearStarted(parseInt(e.currentTarget.value))}
                />
                <label htmlFor="ongoing">Is manga currently ongoing?</label>
                <input type="checkbox" checked={isOngoing} onChange={switchOngoing} />
                {renderYearCompleted()}
                <label htmlFor="descr">Add description:<br/>(max 1500 symbols)</label>
                <textarea name="descr" maxLength={1500} rows={4} onChange={
                    (e: React.FormEvent<HTMLTextAreaElement>) =>
                    setDescription(e.currentTarget.value)
                }/>
                <label htmlFor="thumbnail">Upload thumbnail</label>
                <input name="thumbnail" type="file" accept="image/*" onChange={
                    (e: any) => {
                        const uploaded = e.target.files[0];
                        if (uploaded.type.match("image/*"))
                            setThumbnail(uploaded);
                        else {
                            alert('You are attempting to submit not an image for thumbnail!');
                        }
                    }
                }/>
                <input className="btn" type="submit" value="Send"/>
            </form>
        </div>
    );
}

function AddChapterComponent() {

    const [mangaName, setMangaName] = useState("");
    const [chapterName, setChapterName] = useState("");
    const [chapterNumber, setChapterNumber] = useState(0);
    const [chapterVolume, setChapterVolume] = useState(0);
    const [imagesChapter, setImagesChapter] = useState<Array<File>>();

    const handleSubmitChapter = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // render new filenames on client side
        const newFileNames = imagesChapter!.map((img, index) => 
            getMangaPageName(mangaName, chapterVolume, chapterNumber, index+1, img.type.slice(6)));
        
        let filesWithNewNames: Array<File> = [];
        for (let i = 0; i < newFileNames.length; i++)
            filesWithNewNames.push(new File([imagesChapter![i]], newFileNames[i]));

        const generalChapterData = {
            mangaName: mangaName!,
            chapterName: chapterName!,
            chapterNumber: chapterNumber!,
            chapterVolume: chapterVolume!,
            images: newFileNames
        };

        for (const [property, value] of Object.entries(generalChapterData))
            if (!value) {
                alert(`'${property}' in form is not entered!`);
                return;
            }
        
        const fileSendPromises = [];
        for (let i = 0; i < filesWithNewNames.length; i++) {
            const data = new FormData();
            data.append('file', filesWithNewNames[i]);
            data.append('name', filesWithNewNames[i].name);
            fileSendPromises.push(axios.post(`http://${config.serverAddress}/upload/manga_pages`, data));
        }
        
        console.log(generalChapterData);
        fileSendPromises.push(axios.post(`http://${config.serverAddress}/add/chapter`, generalChapterData));

        Promise.all(fileSendPromises)
            .then((response: any) => {
                if (response[0].data.result)
                    alert(response[0].data.result)
            });
    }

    const renderNamesUploadedImages = () => {
        if (imagesChapter) {
            const imagesNames = imagesChapter!.map(img => img.name);
            console.log(imagesNames);
            const imagesNamesDisplay = imagesNames.map((image:string) => (
                    <>
                        {image}<br/>
                    </>
                ));
            return (
                <div id="images-order">
                        <h4>Images will be added in this order:</h4>
                        <p>{imagesNamesDisplay}</p>
                </div>
            )
        }
    }

    return (
        <div className="card card-contrib">
            <h2>Add new chapter:</h2>
            <form onSubmit={handleSubmitChapter}  className="form-contrib">
                <label htmlFor="manga">For manga (by name):</label>
                <input type="text" name="manga" onChange={
                    (e: any) => setMangaName(e.currentTarget.value)
                }/>
                <label htmlFor="name">Add name:</label>
                <input type="text" name="name" onChange={
                    (e: React.FormEvent<HTMLInputElement>) => setChapterName(e.currentTarget.value)
                }/>
                <label htmlFor="volume">Add volume:</label>
                <input type="number" min="0" name="volume" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                    setChapterVolume(parseInt(e.currentTarget.value))}/>
                <label htmlFor="chapter">Add chapter number</label>
                <input type="number" min="0" name="chapter" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                    setChapterNumber(parseInt(e.currentTarget.value))
                }/>
                <label htmlFor="pages">Upload pages</label>
                <input name="pages" multiple type="file" accept="image/*" onChange={
                    (e: any) => {
                        const uploaded = [...e.target.files];
                        if (uploaded.every((el: File) => el.type.match("image/*")))
                            setImagesChapter(uploaded);
                        else {
                            alert('You are attempting to submit not image for thumbnail!');
                        }
                    }
                }/>
                {renderNamesUploadedImages()}
                <input className="btn" type="submit" value="Send"/>
            </form>
        </div>
    );
}

function AddPagesComponent() {
    return (
        <div className="card card-contrib">
            <h2>Add/Edit/Delete pages of chapter:</h2>
            <form className="form-contrib">
                TBA
            </form>
        </div>
    )
}

export default function ContributionComponent() {
    const [pageSelected, setPageSelected] = useState(1);
    const [authenticated, setAuthenticated] = useState(true);

    useEffect(() => {
        verifyToken().then(res => {
            if (!res)
                setAuthenticated(false);
        });
    })

    const RenderComponent = () => {
        switch (pageSelected) {
            case 1: return <AddMangaComponent />;
            case 2: return <AddChapterComponent />;
            case 3: return <AddPagesComponent />;
        }
    }

    if (authenticated)
        return (
            <>
                <div className="header">
                    <p>A page where you can make your contribution into manga reader</p>
                </div>
                <main className="contributions-main">
                    <div className="btn-group">
                        <button className="btn-contrib" onClick={() => setPageSelected(1)}>Add manga</button>
                        <button className="btn-contrib" onClick={() => setPageSelected(2)}>Add chapter</button>
                        <button className="btn-contrib" onClick={() => setPageSelected(3)}>Add pages to chapter</button>
                    </div>
                    {RenderComponent()}
                </main>
            </>
        )
    else
        return (
            <main>
                <h1>You don't have permission to add new content on manga-reader</h1>
            </main>
        )
}
