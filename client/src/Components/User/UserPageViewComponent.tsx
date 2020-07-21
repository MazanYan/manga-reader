import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';
import '../../css/UserPage.css';

import axios from 'axios';

const addresses = require('../../config');

interface UserPageRouter {
    id: string
}

interface UserPageProps extends RouteComponentProps<UserPageRouter> {

};

export default function UserPageView(props: UserPageProps) {

    const [userFound, setUserFound] = useState(true);
    const [profilePhoto, setProfilePhoto] = useState("");
    const [userName, setUserName] = useState("");
    const [userDescr, setUserDescr] = useState("");
    const [userOnline, setUserOnline] = useState("");
    const [isPageOfCurrentUser, setIsPageOfCurrentUser] = useState(false);

    useEffect(() => {
        const userId = props.match.params.id;
        console.log(userId);
        axios.get(`http://${addresses.serverAddress}/users/${userId}`)
            .then(response => {
                setUserName(response.data.username);
                setUserOnline(response.data.online);
                setProfilePhoto(response.data.photo);
                setUserDescr(response.data.description);
            })
            .catch(err => {
                console.log("User not found");
                setUserFound(false);
                return;
            })
        verifyToken()
            .then(res => {
                setIsPageOfCurrentUser(res?.accId === props.match.params.id);
            });
    }, [props, userName]);

    const renderUserDataChangeButton = () => {
        console.log(isPageOfCurrentUser);
        if (isPageOfCurrentUser)        //{`/user/${props.match.params.id}/edit`}
            return (
                <Link className="btn" to={`/user/${props.match.params.id}/edit`}>
                    Edit your user data
                </Link>
            );
        else return (<></>);
    }

    if (!userFound)
        return (
            <main>
                <h1>User not found!</h1>
            </main>
        )
    else return (
        <main>
            <div id="user-page">
                <div id="image-and-edit">
                    <img alt={userName} id="image" src={`http://${addresses.serverAddress}/images/profile_photos/${profilePhoto}`}/>
                    {renderUserDataChangeButton()}
                </div>
                <div id="user-data">
                    <div id="namePlaceholder"><strong>User: </strong>{userName}</div>
                    <div id="userDescrPlaceholder"><strong>Description: </strong>{userDescr ? userDescr : 'no description'}</div>
                    <div id="isOnline"><strong>Status: </strong>{userOnline ? 'online' : 'offline'}</div>
                </div>
            </div>
        </main>
    );
}
