import React, { useState, useEffect } from 'react';
import Search from './Search/SearchComponent';
import { Link } from 'react-router-dom';
//import verifyToken from '../helpers/VerifyToken';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import '../css/Navbar.css';
const addresses = require('../config');

interface LoggedInNavbarProps {
    userName: string;
    userId: string;
    notifications?: Array<any>;
    logoutFunction: () => void;
}

interface NotificationsDropdownProps {
    userId: string;
    notifications?: Array<any>;
}

function NotificationsDropdown(props: NotificationsDropdownProps) {
    return (
        <>
            <div className="notifications-header">
                <span>Notifications</span>
                <Link className="view-all" to={`/notifications?user=${props.userId}`}>
                    View all
                </Link>
            </div>
            <ul className="notifications-list">
                {
                    props.notifications?.map(notif => (
                        <li className="notification">
                            <a href={notif.link} onClick={() => 
                                // mark notification as read
                                axios.post(`http://${addresses.serverAddress}/update/notification/${notif.id}`)
                                    .then(response => console.log('Comment is marked as read'))
                            }>
                                <div className="notification-author">
                                    {notif.author}
                                </div>
                                <div className="notification-message">
                                    {notif.text}
                                </div>
                            </a>
                        </li>
                    ))
                }
            </ul>
        </>
    );
}

function LoggedInNavbar(props: LoggedInNavbarProps) {

    const [notificationsVisible, setNotificationsVisible] = useState(false);

    const notificationsCount = props.notifications?.length ? (
        <span className="unread-count">
            {props.notifications!.length < 100 ? props.notifications!.length : '99+'}
        </span>
    ) : (<></>);

    return (
        <>
            <Link to={`/user/${props.userId}`}>{props.userName}</Link>
            <Link to={`/user/${props.userId}/bookmarks?page=1`}>Bookmarks</Link>
            <a className="dropdown" onClick={() => setNotificationsVisible(!notificationsVisible)}>
                <span>Notifications {notificationsCount}</span>
                {notificationsVisible ? (
                    <div className="dropdown-content notifications">
                        <NotificationsDropdown userId={props.userId} notifications={props.notifications} />
                    </div>
                ) : (<></>)}
            </a>
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

    //const [loggedIn, setLoggedIn] = useState(false);
    //const [accName, setAccName] = useState("");
    //const [accId, setAccId] = useState("");
    const [notifications, setNotifications] = useState<Array<any>>();
    const { userId, userName, logout } = useAuth();

    useEffect(() => {
        if (userId)
            axios.get(`http://${addresses.serverAddress}/users/notifications/${userId}?quantity=unread&select=true`)
                .then(response => {
                    console.log('All notifications navbar');
                    console.log(response.data);
                    setNotifications(response.data.notificationsList);
                }).catch(err => console.error(err));
        /*verifyToken().then(res => {
            if (res) {
                setLoggedIn(true);
                setAccName(res!.accName);
                setAccId(res!.accId);
            }
            else
                throw Error('Unable to log in');
            return res;
        }).then(res => {
            axios.get(`http://${addresses.serverAddress}/users/notifications/${res!.accId}?quantity=unread&select=true`)
                .then(response => {
                    console.log('Notifications');
                    console.log(response.data);
                    setNotifications(response.data.notificationsList);
                });
        }).catch(err => console.log(err));*/
    }, [userId]);

    const renderLoggedIn = () => {
        if (!!userId)
            return (
                <LoggedInNavbar 
                    userId={userId}
                    userName={userName}
                    notifications={notifications}
                    logoutFunction={logout/*() => {
                        setLoggedIn(false);
                        setAccName("");
                        setAccId("");
                    }*/}
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
