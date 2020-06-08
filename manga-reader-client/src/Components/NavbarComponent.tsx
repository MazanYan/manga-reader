import React from 'react';
import LoginSignupComponent from './LoginSignupComponent';

interface MyProps {
    loggedIn: boolean,
    accName: string
};

interface NavbarState {
    loginMenuOpened: boolean
};
 
export default class NavbarComponent extends React.Component<MyProps, NavbarState> {
    constructor(props: MyProps) {
        super(props);

        this.state = {
            loginMenuOpened: false
        };
    }

    renderLoginMenu() {
        if (this.state.loginMenuOpened) {
            return (
                <LoginSignupComponent/>
            );
        }
    }

    render() {
        if (this.props.loggedIn)
            return (
                <nav className="NavbarComponent">
                    <a href="index.html">Manga Reader</a>
                    <a href="index.html">{this.props.accName}</a>
                    <a href="index.html">Bookmarks</a>
                    <a href="index.html">Notifications</a>
                    <a href="index.html">Log Out</a>
                </nav>
            );
        else
            return (
                <React.Fragment>
                    <nav className="NavbarComponent">
                        <a rel="index.html">Manga Reader</a>
                        <div className="dropdown">
                            <a className="dropbtn" rel="index.html" onMouseEnter={() => 
                                this.setState({loginMenuOpened: !this.state.loginMenuOpened})}>Log In</a>
                            {this.renderLoginMenu()}
                        </div>
                    </nav>
                </React.Fragment>
            )
    }
}
