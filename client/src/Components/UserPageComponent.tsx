import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import '../css/UserPage.css';

import axios from 'axios';

const addresses = require('../config');

interface UserPageRouter {
    id: string
}

interface UserPageProps extends RouteComponentProps<UserPageRouter> {

};

export default function UserPageComponent(props: UserPageProps) {

    const [userFound, setUserFound] = useState(true);
    const [profilePhoto, setProfilePhoto] = useState("");
    const [userName, setUserName] = useState("");
    const [userDescr, setUserDescr] = useState("");
    const [userOnline, setUserOnline] = useState("");

    useEffect(() => {
        const userId = props.match.params.id;
        axios.get(`http://${addresses.serverAddress}/users/${userId}`)
            .then(response => {
                if (response.status >= 400) {
                    setUserFound(false);
                }
                setUserName(response.data.username);
                setUserOnline(response.data.online);
                setProfilePhoto(response.data.photo);
                setUserDescr(response.data.description)
            });
    });

    if (!userFound)
        return (
            <main>
                <h1>User not found!</h1>
            </main>
        )
    else return (
        <main>
            <div id="user-page">
                <img id="image-placeholder" src={`http://${addresses.serverAddress}/images/profile_photos/${profilePhoto}`}/>
                <div id="user-data">
                    <div id="namePlaceholder"><strong>User: </strong>{userName}</div>
                    <div id="userDescrPlaceholder"><strong>Description: </strong>{userDescr ? userDescr : 'no description'}</div>
                    <div id="isOnline"><strong>Status: </strong>{userOnline ? 'online' : 'offline'}</div>
                </div>
            </div>
        </main>
    );
}
