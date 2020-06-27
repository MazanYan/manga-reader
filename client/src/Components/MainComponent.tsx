import React from 'react';
import NavbarComponent from './NavbarComponent';
import '../css/Navbar.css';
import '../css/DefaultClassesTags.css';
import { Switch, Route, Link } from 'react-router-dom';
import MainPageComponent from './MainPageComponent';
import UserPageComponent from './User/UserPageComponent';
import SearchPageComponent from './Search/SearchPageComponent';
import ContributionComponent from './ContributionComponent';
import { CopyrightClaimComponent } from './CopyrightClaimComponent';
import MangaComponent from './Manga/MangaComponent';
import LoginSignupComponent from './User/LoginSignupComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <NavbarComponent/>
            <Switch>
                <Route exact path="/" component={MainPageComponent}/>
                <Route path="/manga" component={MangaComponent}/>
                <Route path="/auth" component={LoginSignupComponent}/>
                <Route path="/user" component={UserPageComponent}/>
                <Route path="/search/:query" component={SearchPageComponent}/>
                <Route path="/contribute" component={ContributionComponent}/> 
                <Route path="/right_holders" component={CopyrightClaimComponent}/>
            </Switch>
            <footer>
                <div id="descr">
                Simple Manga-Reading Website<br/>Created by: Yan Mazan, Group (ukr) ІВ-71
                </div>
                <div id="links">
                    <a><Link to="/contribute">Make a contribution</Link></a><br/>
                    <a><Link to="/right_holders">For right holders</Link></a>
                </div>
            </footer>
        </React.Fragment>
    )
}
