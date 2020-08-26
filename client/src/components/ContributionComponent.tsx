import React, { useState, useEffect } from 'react';
import '../css/ContributionPage.css';
import { getThumbnailName, getMangaPageName } from '../helpers/generateImageName';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
//import verifyToken from '../helpers/VerifyToken';
import { useForm } from 'react-hook-form';

const addresses = require('../config');

function AddManga() {

    const { register, handleSubmit } = useForm();
    const [isOngoing, setIsOngoing] = useState(true);
    
    const handleSubmitManga = (data: any) => {

        // render new filename on client side
        const newFileName = getThumbnailName(data.name, data.thumbnail[0]?.type.slice(6));
        const file = new File([data.thumbnail[0]!], newFileName);
        
        const toSubmit = {
            name: data.name,
            author: data.author,
            descr: data.descr,
            yearStarted: data.year,
            fileName: newFileName,
            status: isOngoing ? 'ongoing' : 'finished',
            yearEnd: data.yearEnd
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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        
        const fileSendPromise = axios.post(`http://${addresses.serverAddress}/upload/thumb`, formData);
        const dataSendPromise = axios.post(`http://${addresses.serverAddress}/add/manga`, toSubmit);
        
        Promise.all([fileSendPromise, dataSendPromise])
            .then((response: any) => alert('Manga successfully added'))
            .catch(err => alert('Manga not added'));
    }

    return (
        <div className="card card-contrib">
            <h2>Add new manga:</h2>
            <form onSubmit={handleSubmit(handleSubmitManga)} className="form-contrib">
                <label htmlFor="name">
                    Add name:
                </label>
                <input type="text" name="name" ref={register}/>
                <label htmlFor="author">
                    Add author:
                </label>
                <input type="text" name="author" ref={register}/>
                <label htmlFor="year">
                    Year when manga was started:
                </label>
                <input type="number" min="1930" max="2020" name="year" ref={register}/>
                <label htmlFor="ongoing">
                    Is manga currently ongoing?
                </label>
                <input type="checkbox" checked={isOngoing} ref={register} onChange={() => setIsOngoing(!isOngoing)} />
                {!isOngoing ? (
                        <>
                            <label htmlFor="yearEnd">Year when manga was completed:</label>
                            <input type="number" name="yearEnd" ref={register({min: 1920, max: 2020})}/>
                        </>
                    ) : (<></>)
                }
                <label htmlFor="descr">Add description:<br/>(max 1500 symbols)</label>
                <textarea name="descr" rows={4} ref={register({ maxLength: 1500 })}/>
                <label htmlFor="thumbnail">Upload thumbnail</label>
                <input name="thumbnail" type="file" accept="image/*" ref={register} onChange={
                    (e: any) => {
                        const uploaded = e.target.files[0];
                        if (uploaded.type.match("image/*"))
                            return;
                            //setThumbnail(uploaded);
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

function AddChapter() {

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
            fileSendPromises.push(axios.post(`http://${addresses.serverAddress}/upload/manga_pages`, data));
        }
        
        console.log(generalChapterData);
        fileSendPromises.push(axios.post(`http://${addresses.serverAddress}/add/chapter`, generalChapterData));

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

function AddPages() {
    return (
        <div className="card card-contrib">
            <h2>Add/Edit/Delete pages of chapter:</h2>
            <form className="form-contrib">
                TBA
            </form>
        </div>
    )
}

export default function MakeContribution() {
    const [pageSelected, setPageSelected] = useState(1);
    const { userId } = useAuth();
    //const [authorized, setAuthorized] = useState(true);

    /*useEffect(() => {
        verifyToken().then(res => {
            if (!res)
                setAuthorized(false);
        });
    })*/

    const RenderComponent = () => {
        switch (pageSelected) {
            case 1: return <AddManga />;
            case 2: return <AddChapter />;
            case 3: return <AddPages />;
        }
    }

    if (!!userId)
        return (
            <>
                <div className="header">
                    <p>A page where you can make your contribution into manga reader</p>
                </div>
                <main className="contributions-main">
                    <div className="btn-group">
                        <button className="btn btn-contrib" onClick={() => setPageSelected(1)}>Add manga</button>
                        <button className="btn btn-contrib" onClick={() => setPageSelected(2)}>Add chapter</button>
                        <button className="btn btn-contrib" onClick={() => setPageSelected(3)}>Add pages to chapter</button>
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
