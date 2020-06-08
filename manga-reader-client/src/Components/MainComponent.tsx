import React from 'react';
import NavbarComponent from './NavbarComponent';
import '../css/Navbar.css';
import { Switch, Route } from 'react-router-dom';
import MainPageComponent from './MainPageComponent';
import MangaMainComponent from './MangaMainComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <NavbarComponent className="NavbarComponent" field1="1" field2="2"/>
            <Switch>
                <Route exact path="/" component={MainPageComponent}/>
                <Route path="/manga" component={MangaMainComponent}/>
            </Switch>
        </React.Fragment>
    )
}
