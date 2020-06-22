import React from 'react';
import LoginSignupComponent from './LoginSignupComponent';
import SearchComponent from './SearchComponent';
import { Link } from 'react-router-dom';

interface NavbarProps {
    loggedIn: boolean,
    accName: string
};
 
export default class NavbarComponent extends React.Component<NavbarProps> {
    constructor(props: NavbarProps) {
        super(props);
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
                <Link to="/auth">Log In/Sign Up</Link>
            );
    }

    render() {
        return (
            <nav className="navbar-component">
                <a id="site-name"><Link to="/">Manga Reader</Link></a>
                <div id="search"><SearchComponent/></div>
                <div id="login">{this.renderLoggedIn()}</div>
            </nav>
        );
    }
}
