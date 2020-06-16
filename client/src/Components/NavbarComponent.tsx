import React from 'react';
import LoginSignupComponent from './LoginSignupComponent';
import SearchComponent from './SearchComponent';
import axios from 'axios';

interface NavbarProps {
    loggedIn: boolean,
    accName: string
};

interface NavbarState {
    loginMenuOpened: boolean
    /*searchOpened: boolean
    toSearch: string*/
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
            //searchOpened: false,
            //toSearch: ""
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

    /*handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        
        const data = {
            toSearch: this.state.toSearch
        };
        let response: Array<MangaResponse>;
        axios.post(`http://localhost:3000/search`, data)
            .then(function (res) {
                response = res.data.message;
            })
            .catch(function (error) {
                console.log(error);
        });
        event.preventDefault();
    }

    renderSearchMenu() {
        if(this.state.searchOpened)
            return (
                <SearchComponent/>
            );
    }*/

    render() {
        return (
            <nav className="NavbarComponent">
                <a id="siteName" href="index.html">Manga Reader</a>
                <SearchComponent/>
                {this.renderLoggedIn()}
            </nav>
        );
    }
}
