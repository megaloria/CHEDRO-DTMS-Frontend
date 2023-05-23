import React, { useEffect, useState } from 'react';
import apiClient from '../../../helpers/apiClient';
import { Alert, ListGroup, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import {
    useRouteLoaderData, Link
} from 'react-router-dom';
import './styles.css';

export default function Notifications() {
    const currentUser = useRouteLoaderData('user');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notifications, setNotifications] = useState({ data: [] });

    useEffect(() => {
        apiClient.get('/notifications').then(response => {
            setNotifications(response.data.data);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const renderNotification = notification => {
        return (
            <>
                <div>
                    <div>
                    {   notification.type === "App\\Notifications\\DocumentForwarded" && (notification.data.from.id === currentUser.id || (currentUser.role.level === 2 && (notification.data.to.name !== currentUser.profile.name))) ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='forwarded-text'>forwarded to</span> {notification.data.to.name}.</>
                        ) : notification.type === "App\\Notifications\\DocumentForwarded" && notification.data.to.id === currentUser.id ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='forwarded-text'>forwarded from</span> {notification.data.from.name}.</>
                        ) : notification.type === "App\\Notifications\\DocumentAcknowledged"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <b>acknowledged</b> by {notification.data.by.name}.</>
                        )  : notification.type === "App\\Notifications\\DocumentActedOn"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <b>acted</b> by {notification.data.by.name}.</>
                        ) : notification.type === "App\\Notifications\\DocumentApproved"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <b>approved</b> by {notification.data.by.name}.</>
                        ) : notification.type === "App\\Notifications\\DocumentRejected"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <b>rejected</b> by {notification.data.by.name}.</>
                        ) : notification.type === "App\\Notifications\\DocumentReleased"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <b>released</b>.</>
                        ) : null
                    }   
                    </div>
                    <div className={`${notifications.read_at ? '' : ''}`}>
                        <span className='time-notif'>
                            {moment(notification.created_at).format('MMM DD, YYYY hh:mm A')} &bull;<i> {moment(notification.created_at).fromNow()}</i>
                        </span> 
                    </div>
                </div>
                {
                    !notification.read_at && (
                        <div className='mx-2'>
                            <FontAwesomeIcon icon={faCircle} size='xs' className='text-primary' />
                        </div>
                    )
                }
            </>
        )
    }

    if (isLoading) {
        return (
            <div className='mx-3'>
                <Spinner size='sm' />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <Alert variant='danger'>
                {errorMessage}
            </Alert>
        );
    }

    if (notifications.data.length === 0) {
        return (
            <Alert variant='primary'>
                No notifications found.
            </Alert>
        );
    }

    return (
        <ListGroup variant='flush'
            style={{
                marginTop: '-1rem',
                marginBottom: '-1rem',
                borderBottomLeftRadius: '.5rem',
                borderBottomRightRadius: '.5rem'
            }}>
            {
                notifications.data.map(notification => (
                    <ListGroup.Item as={Link} to={`/documents/view/${notification.data.document.id}`} key={notification.id} action className={`d-flex justify-content-center align-items-center ${notification.read_at ? 'opacity-50' : ''}`}>
                        {renderNotification(notification)}
                    </ListGroup.Item>
                ))
            }
            {
                notifications.next_page_url && (
                    <ListGroup.Item action style={{ textAlign: 'center' }}>
                        Show more...
                    </ListGroup.Item>
                )
            }
        </ListGroup>
    );
}