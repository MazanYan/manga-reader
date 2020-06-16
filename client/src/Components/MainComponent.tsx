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
                <Route path="/manga" component={MangaMainComponent}/>
                <Route path="/user" component={UserPageComponent}/>
                <Route path="/search/:query" component={SearchPageComponent}/> 
            </Switch>
        </React.Fragment>
    )
}
