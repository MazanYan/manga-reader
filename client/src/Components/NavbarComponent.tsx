import React, { useState, useEffect } from 'react';
import Search from './Search/SearchComponent';
import { Link } from 'react-router-dom';
import verifyToken from '../helpers/VerifyToken';
import axios from 'axios';
const addresses = require('../config');

interface LoggedInNavbarProps {
    userName: string;
    userId: string;
    notifications?: Array<any>;
    logoutFunction: () => void;
}

function LoggedInNavbar(props: LoggedInNavbarProps) {
    return (
        <>
            <Link to={`/user/${props.userId}`}>{props.userName}</Link>
            <Link to={`/user/${props.userId}/bookmarks`}>Bookmarks</Link>
            <Link to={`/user/${props.userId}/notifications`}>Notifications</Link>
            <a onClick={
                () => {
                    window.localStorage.removeItem('jwt-token');
                    props.logoutFunction();
                    window.location.reload();
                }
            }>Log Out</a>
        </>
    );
}

export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [accName, setAccName] = useState("");
    const [accId, setAccId] = useState("");
    const [notifications, setNotifications] = useState<Array<any>>();

    useEffect(() => {
        verifyToken().then(res => {
            if (res) {
                setLoggedIn(true);
                setAccName(res?.accName);
                setAccId(res?.accId);
            }
        }).then(_ => {
            axios.get(`http://${addresses.serverAddress}/users/notifications/${accId}`)
                .then(response => setNotifications(response.data));
        }).catch(err => alert(err));
    }, [accName]);

    const renderLoggedIn = () => {
        if (loggedIn)
            return (
                <LoggedInNavbar 
                    userId={accId}
                    userName={accName}
                    notifications={notifications}
                    logoutFunction={() => {
                        setLoggedIn(false);
                        setAccName("");
                        setAccId("");
                    }}
                />
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
