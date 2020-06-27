import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';

interface UserPageEditRouter {
    id: string
}

interface UserPageEditProps extends RouteComponentProps<UserPageEditRouter> {
    
}

export default function UserPageEditComponent(props: UserPageEditProps) {

    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        verifyToken().then(res => {
            if (res?.accId === props.match.params.id)
                setIsAllowed(true);
        }).catch(error => {
            setIsAllowed(false);
        })
    });

    if (isAllowed)
        return (
            <main>
                Change User Name<br/>
                Change Profile Photo<br/>
                Change User Description<br/>
            </main>
        )
    else
        return (
            <main>
                <h1>You are not allowed to edit data of this user</h1>
            </main>
        )
}
