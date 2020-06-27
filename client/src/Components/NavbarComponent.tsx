import React from 'react';
import SearchComponent from './Search/SearchComponent';
import { Link } from 'react-router-dom';
import verifyToken from '../helpers/VerifyToken';

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
        verifyToken().then(res => {
            this.setState({ loggedIn: true, accName: res?.accName, accId: res?.accId });
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
                <div id="site-name"><Link to="/">Manga Reader</Link></div>
                <div id="search"><SearchComponent/></div>
                <div id="login">{this.renderLoggedIn()}</div>
            </nav>
        );
    }
}
