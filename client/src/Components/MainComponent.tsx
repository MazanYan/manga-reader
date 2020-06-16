import React from 'react';
import NavbarComponent from './NavbarComponent';
import '../css/Navbar.css';
import '../css/DefaultClasses.css';
import { Switch, Route } from 'react-router-dom';
import MainPageComponent from './MainPageComponent';
import MangaMainComponent from './MangaMainComponent';
import UserPageComponent from './UserPageComponent';
import SearchComponent from './SearchComponent';
import SearchPageComponent from './SearchPageComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <NavbarComponent loggedIn={false} accName=""/>
            <Switch>
                <Route exact path="/" component={MainPageComponent}/>
                <Route path="/manga/:id" component={MangaMainComponent}/>
                <Route path="/user" component={UserPageComponent}/>
                <Route path="/search/:query" component={SearchPageComponent}/> 
            </Switch>
            <footer>
                <div id="descr">
                Simple Manga-Reading Website<br/>Created by: Yan Mazan, Group (ukr) ІВ-71
                </div>
                <div id="links">
                    <a>For Right Holders</a>
                </div>
            </footer>
        </React.Fragment>
    )
}
