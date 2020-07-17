import React, { useEffect, useState } from 'react';
import QueryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';

interface NotificationPageProps extends RouteComponentProps<any> {
    
};

export default function NotificationPage(props: NotificationPageProps) {

    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const userId = QueryString.parse(props.location.search).user;
        verifyToken().then(response => {
            if (response?.accId === userId)
                setAllowed(true);
        });
    }, []);

    if (allowed)
        return (
            <>Notifications Page</>
        );
    else
        return (
            <>Not allowed</>
        );
}
