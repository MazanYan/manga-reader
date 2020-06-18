import React from 'react';
import NavbarComponent from './NavbarComponent';
import '../css/Navbar.css';
import '../css/DefaultClassesTags.css';
import { Switch, Route, Link } from 'react-router-dom';
import MainPageComponent from './MainPageComponent';
import MangaMainComponent from './MangaMainComponent';
import UserPageComponent from './UserPageComponent';
import SearchPageComponent from './SearchPageComponent';
import MangaPageComponent from './MangaPageComponent';
import ContributionComponent from './ContributionComponent';
import { CopyrightClaimComponent } from './CopyrightClaimComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <NavbarComponent loggedIn={false} accName=""/>
            <Switch>
                <Route exact path="/" component={MainPageComponent}/>
                <Route path="/manga/:id" component={MangaMainComponent}/>
                <Route path="/manga/:id/:ch/:p" component={MangaPageComponent}/>
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