import React, { useEffect, useState } from 'react';
import QueryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';
import axios from 'axios';
import '../../css/NotificationsPage.css';

const addresses = require('../../config');

interface NotificationPageProps extends RouteComponentProps<any> {
    
};

export default function NotificationPage(props: NotificationPageProps) {

    const [allowed, setAllowed] = useState(false);
    const [newNotifications, setNewNotifications] = useState<Array<any>>();
    const [readNotifications, setReadNotifications] = useState<Array<any>>();

    useEffect(() => {
        const userId = QueryString.parse(props.location.search).user;
        verifyToken().then(response => {
            if (response?.accId === userId) {
                setAllowed(true);
                return true;
            }
            return false;
        }).then(renderNotifications => {
            if (renderNotifications) {
                axios.get(`http://${addresses.serverAddress}/users/notifications/${userId}?quantity=all`)
                    .then(response => {
                        console.log(response);
                        setNewNotifications(response.data.unread);
                        setReadNotifications(response.data.read);
                    });
            }
        });
    }, []);

    const renderNotifications = (notifications: Array<any>) => {
        return notifications.map(notif => (
            <a href={notif.link}>
                <div className="page-notification">
                    <div className="notification-page-from">
                        From: '{notif.author}'
                    </div>
                    <div className="notification-page-message">
                        {notif.text}
                    </div>
                </div>
            </a>
        ));
    }

    if (allowed)
        return (
            <>
                <div className="header">
                    <p>Notifications</p>
                </div>
                <main>
                    <div className="notifications-page">
                        <h3 className="notifications-type">New notifications</h3>
                        <hr className="notifications-break"/>
                        <div className="notifications">
                            { newNotifications?.length ?
                                renderNotifications(newNotifications) : (
                                    <p>You don't have any new notifications</p>
                                )
                            }
                        </div>
                        <h3 className="notifications-type">Read notifications</h3>
                        <hr className="notifications-break"/>
                        <div className="notifications">
                            { readNotifications?.length ?
                                renderNotifications(readNotifications) : (
                                    <p>You don't have any read notifications</p>
                                )
                            }
                        </div>
                    </div>
                </main>
            </>
        );
    else
        return (
            <>Error 403: Forbidden</>
        );
}
