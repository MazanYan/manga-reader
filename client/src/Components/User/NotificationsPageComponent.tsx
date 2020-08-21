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

    const readCommentsPageLength = 5;

    const [allowed, setAllowed] = useState(false);
    const [newNotifications, setNewNotifications] = useState<Array<any>>();
    const [readNotifications, setReadNotifications] = useState<Array<any>>();
    const [startReadNotification, setStartReadNotification] = useState(0);
    const [endReadNotification, setEndReadNotification] = useState(readCommentsPageLength);
    const [readNotificationsCount, setReadNotificationsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(Math.floor(startReadNotification / readCommentsPageLength) + 1);

    const pagesTotal = Math.ceil(readNotificationsCount / readCommentsPageLength);

    // count read notifications
    useEffect(() => {
        const userId = QueryString.parse(props.location.search).user;
        axios.get(`http://${addresses.serverAddress}/users/notifications/${userId}?quantity=read&count=true`)
            .then(response => {
                console.log("Count of read notifications");
                console.log(response.data.notificationsCount);
                setReadNotificationsCount(response.data.notificationsCount);
            });
    }, []);

    // get body of all unread notifications and read notifications in range [startReadNotification, endReadNotification]
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
                axios.get(`http://${addresses.serverAddress}/users/notifications/${userId}?quantity=read&from=${startReadNotification}&to=${endReadNotification}&select=true`)
                    .then(response => {
                        setReadNotifications(response.data.notificationsList);
                    });
                axios.get(`http://${addresses.serverAddress}/users/notifications/${userId}?quantity=unread&select=true`)
                .then(response => {
                    setNewNotifications(response.data.notificationsList);
                });
            }
        });
    }, [startReadNotification, endReadNotification]);

    const renderNotifications = (notifications: Array<any>) => {
        return notifications.map(notif => (
            <a id={notif.id} href={notif.link} onClick={() => 
                // mark notification as read
                axios.post(`http://${addresses.serverAddress}/update/notification/${notif.id}`)
                    .then(response => console.log('Comment is marked as read'))
            }>
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
                        <div className="pagination">
                            {
                                Array.apply(null, Array(pagesTotal))
                                    .map((_, i) => i + 1)
                                    .map(i => {
                                        if (i === currentPage)
                                            return (
                                                <div className="page-link inactive">{i}</div>
                                            );
                                        else 
                                            return (
                                                <div className="page-link" onClick={() => {
                                                    setStartReadNotification((i - 1) * readCommentsPageLength);
                                                    setEndReadNotification(i * readCommentsPageLength);
                                                    setCurrentPage(i);
                                                }}>
                                                    {i}
                                                </div>
                                            );
                                    })
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
