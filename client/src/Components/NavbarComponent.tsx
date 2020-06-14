import React from 'react';
import LoginSignupComponent from './LoginSignupComponent';
import SearchComponent from './SearchComponent';

interface NavbarProps {
    loggedIn: boolean,
    accName: string
};

interface NavbarState {
    loginMenuOpened: boolean
    searchOpened: boolean
};
 
export default class NavbarComponent extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);

        this.state = {
            loginMenuOpened: false,
            searchOpened: false
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

    renderSearchMenu() {
        if(this.state.searchOpened)
            return (
                <SearchComponent/>
            );
    }

    render() {
        return (
            <nav className="NavbarComponent">
                <a href="index.html">Manga Reader</a>
                <a className="dropbtn" onMouseEnter={() => 
                    this.setState({searchOpened: !this.state.searchOpened})}><i className="fa fa-search"></i>
                </a>
                {this.renderSearchMenu()}
                {this.renderLoggedIn()}
            </nav>
        );
    }
}
