import React from 'react';
import Navbar from './NavbarComponent';
import '../css/Navbar.css';
import '../css/DefaultClassesTags.css';
import { Switch, Route, Link } from 'react-router-dom';
import MainPage from './MainPageComponent';
import UserPage from './User/UserPageComponent';
import SearchPage from './Search/SearchPageComponent';
import MakeContribution from './ContributionComponent';
import CopyrightClaimPage from './CopyrightClaimComponent';
import Manga from './Manga/MangaComponent';
import LoginRoute from './User/LoginRouteComponent';
import NotificationPage from './User/NotificationsPageComponent';

export default function MainComponent() {
    return (
        <React.Fragment>
            <Navbar/>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route path="/manga" component={Manga}/>
                <Route path="/auth" component={LoginRoute}/>
                <Route path="/user" component={UserPage}/>
                <Route path="/notifications" component={NotificationPage}/>
                <Route path="/search/:query" component={SearchPage}/>
                <Route path="/contribute" component={MakeContribution}/> 
                <Route path="/right_holders" component={CopyrightClaimPage}/>
            </Switch>
            <footer>
                <div id="descr">
                Simple Manga-Reading Website<br/>Created by: Yan Mazan, Group (ukr) ІВ-71
                </div>
                <div id="links">
                    <Link to="/contribute">Make a contribution</Link><br/>
                    <Link to="/right_holders">For right holders</Link>
                </div>
            </footer>
        </React.Fragment>
    )
}
