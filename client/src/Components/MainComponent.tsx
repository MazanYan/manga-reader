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
import MangaPageComponent from './MangaPageComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <NavbarComponent loggedIn={false} accName=""/>
            <main>
                <Switch>
                    <Route exact path="/" component={MainPageComponent}/>
                    <Route path="/manga/:id" component={MangaMainComponent}/>
                    <Route path="/manga/:id/:ch/:p" component={MangaPageComponent}/>
                    <Route path="/user" component={UserPageComponent}/>
                    <Route path="/search/:query" component={SearchPageComponent}/> 
                </Switch>
            </main>
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

/*
<Route path="/manga" children={() => (
    <Switch>
        <Route path="/:id" component={MangaMainComponent}/>
        <Route path="/:id/:ch/:p" component={MangaPageComponent}/>
    </Switch>
)}/>
*/


/*<Route path="/manga/:id" children={() => (
                        <Switch>
                            <Route path="/" component={MangaMainComponent}/>
                            <Route path="/:chapter:page" component={MangaPageComponent}/>
                        </Switch>
                    )}/>*/