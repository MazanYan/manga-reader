import React from 'react';
//import LoginSignupComponent from './LoginSignupComponent';
import SearchComponent from './SearchComponent';
import { Link } from 'react-router-dom';
import axios from 'axios';

const addresses = require('../config');

interface NavbarState {
    loggedIn: boolean,
    accName?: string,
    accId?: string
};
 
export default class NavbarComponent extends React.Component<{}, NavbarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loggedIn: false
        }
    }

    componentDidMount() {
        const hasToken = window.localStorage.getItem('jwt-token');
        if (!hasToken)
            return;
        const tokenVerify = {
            token: window.localStorage.getItem('jwt-token')
        };
        console.log("User has token");
        axios.post(`http://${addresses.serverAddress}/login/verify`, tokenVerify)
            .then(res => {
                if (res.status === 200) {
                    console.log("Account confirmed");
                    this.setState({ loggedIn: true, accName: res.data.name, accId: res.data.id });
                }
            });
    }

    renderLoggedIn() {
        if (this.state.loggedIn)
            return (
                <React.Fragment>
                    <Link to={`/user/${this.state.accId}`}>{this.state.accName}</Link>
                    <Link to="/boormarks">Bookmarks</Link>
                    <Link to="/notifications">Notifications</Link>
                    <a onClick={
                        () => {
                            window.localStorage.removeItem('jwt-token');
                            this.setState({loggedIn: false, accName: undefined, accId: undefined});
                        }
                    }>Log Out</a>
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
