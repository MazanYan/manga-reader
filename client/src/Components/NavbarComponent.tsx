import React from 'react';
import LoginSignupComponent from './LoginSignupComponent';
import SearchComponent from './SearchComponent';
import { Link } from 'react-router-dom';

interface NavbarProps {
    loggedIn: boolean,
    accName: string
};

interface NavbarState {
    loginMenuOpened: boolean
};

type MangaResponse = {
    name: string,
    author: string,
    description: string,
    manga_key: string,
    bookmarks_count: Number,
    add_time: Date
}
 
export default class NavbarComponent extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);

        this.state = {
            loginMenuOpened: false,
        };
    }

    renderLoginMenu() {
        if (this.state.loginMenuOpened) {
            return (
                <LoginSignupComponent/>
            );
        }
    }

    renderLoggedIn() {
        if (this.props.loggedIn)
            return (
                <React.Fragment>
                    <a href="index.html">{this.props.accName}</a>
                    <a href="index.html">Bookmarks</a>
                    <a href="index.html">Notifications</a>
                    <a href="index.html">Log Out</a>
                </React.Fragment>
            );
        else
            return (
                <div className="dropdown">
                    <a className="dropbtn" rel="index.html" onMouseEnter={() => 
                        this.setState({loginMenuOpened: !this.state.loginMenuOpened})}>Log In</a>
                    {this.renderLoginMenu()}
                </div>
            );
    }

    render() {
        return (
            <nav className="navbar-component">
                <a id="site-name"><Link to="/">Manga Reader</Link></a>
                <div id="search"><SearchComponent/></div>
                {/*<div id="login">{this.renderLoggedIn()}</div>*/}
            </nav>
        );
    }
}
