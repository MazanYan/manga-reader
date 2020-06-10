import React from 'react';
import NavbarComponent from './NavbarComponent';
import '../css/Navbar.css';
import { Switch, Route } from 'react-router-dom';
import MainPageComponent from './MainPageComponent';
import MangaMainComponent from './MangaMainComponent';
import UserPageComponent from './UserPageComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <NavbarComponent loggedIn={false} accName=""/>
            <Switch>
                <Route exact path="/" component={MainPageComponent}/>
                <Route path="/manga" component={MangaMainComponent}/>
                <Route path="/user" component={UserPageComponent}/>
            </Switch>
        </React.Fragment>
    )
}
