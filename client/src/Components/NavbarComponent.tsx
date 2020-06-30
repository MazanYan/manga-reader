import React, { useState, constructor, useEffect } from 'react';
import Search from './Search/SearchComponent';
import { Link } from 'react-router-dom';
import verifyToken from '../helpers/VerifyToken';
 
export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [accName, setAccName] = useState("");
    const [accId, setAccId] = useState("");

    useEffect(() => {
        verifyToken().then(res => {
            if (res) {
                setLoggedIn(true);
                setAccName(res?.accName);
                setAccId(res?.accId);
            }
        }).catch(err => alert(err));
    }, [accName]);

    const renderLoggedIn = () => {
        if (loggedIn)
            return (
                <React.Fragment>
                    <Link to={`/user/${accId}`}>{accName}</Link>
                    <Link to={`/user/${accId}/bookmarks`}>Bookmarks</Link>
                    <Link to="/notifications">Notifications</Link>
                    <a onClick={
                        () => {
                            window.localStorage.removeItem('jwt-token');
                            setLoggedIn(false);
                            setAccName("");
                            setAccId("");
                            window.location.reload();
                        }
                    }>Log Out</a>
                </React.Fragment>
            );
        else
            return (
                <Link to="/auth">Log In/Sign Up</Link>
            );
    }

    return (
        <nav className="navbar-component">
            <div id="site-name"><Link to="/">Manga Reader</Link></div>
            <div id="search"><Search/></div>
            <div id="login">{renderLoggedIn()}</div>
        </nav>
    );
}
