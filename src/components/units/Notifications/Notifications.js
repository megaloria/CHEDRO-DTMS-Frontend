import React, { useEffect, useState } from 'react';
import apiClient from '../../../helpers/apiClient';
import { Alert, ListGroup, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import {
    useRouteLoaderData, Link
} from 'react-router-dom';
import './styles.css';

export default function Notifications({ onChangeNotificationsCount }) {
    const currentUser = useRouteLoaderData('user');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notifications, setNotifications] = useState({ data: [] });

    const [isNextPageLoading, setIsNextPageLoading] = useState(false);
    const [nextPageError, setNextPageError] = useState('');

    useEffect(() => {
        apiClient.get('/notifications').then(response => {
            setNotifications(response.data.data);
            onChangeNotificationsCount(response.data.data.unread_notifications_count);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleShowMore = () => {
        setIsNextPageLoading(true);
        setNextPageError('');
        apiClient.get(`/notifications?page=${notifications.current_page+1}`).then(response => {
            setNotifications({
                ...response.data.data,
                data: [
                    ...notifications.data,
                    ...response.data.data.data
                ],
            });
        }).catch(error => {
            setNextPageError(error);
        }).finally(() => {
            setIsNextPageLoading(false);
        });
    }

    const renderNotification = notification => {
        return (
            <>
                <div>
                    <div>
                    {   ((notification.type === "App\\Notifications\\DocumentForwarded") && (notification.data?.from?.id === currentUser?.id || (currentUser.role.level <= 2 && notification.data?.to?.id !== currentUser?.id))) ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='forwarded-text'>forwarded to</span> <b>{notification.data.to?.name}</b>.</>
                        ) : ((notification.type === "App\\Notifications\\DocumentForwarded" && notification.data?.to?.id === currentUser?.id)) ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='forwarded-text'>forwarded from </span><b> {notification.data.from.name}</b>.</>
                        ) : notification.type === "App\\Notifications\\DocumentForwardedTo"  ? ( 
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='forwarded-text'>forwarded to </span><b>{notification.data.to.name}</b>.</>
                        ) : notification.type === "App\\Notifications\\DocumentAcknowledged"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='ack-text'>acknowledged </span>by<b> {notification.data.by.name}</b>.</>
                        ) : notification.type === "App\\Notifications\\DocumentActedOn" ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='act-approve-releasing-text'>acted </span>by <b> {notification.data.by.name}</b>.</>
                        ) : notification.type === "App\\Notifications\\DocumentApproved"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='act-approve-releasing-text'>approved </span> by <b> {notification.data.by.name}</b>.</>
                        ) : notification.type === "App\\Notifications\\DocumentRejected"  ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='reject-text'>rejected </span>by <b> {notification.data.by.name}</b>.</>
                        ) : notification.type === "App\\Notifications\\DocumentReleased" ? (
                            <>The document <b>{notification.data.document.tracking_no}</b> has been <span className='act-approve-releasing-text'>released</span>.</>
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
            <Alert variant='primary' className='mx-3 mb-0'>
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
                    <ListGroup.Item as={Link} to={`/documents/view/${notification.data.document?.id}`} key={notification?.id} action className={`d-flex justify-content-center align-items-center ${notification.read_at ? 'opacity-50' : ''}`}>
                        {renderNotification(notification)}
                    </ListGroup.Item>
                ))
            }
            {
                notifications.next_page_url && (
                    <ListGroup.Item action style={{ textAlign: 'center' }} onClick={handleShowMore} disabled={isNextPageLoading}>
                        {
                            nextPageError && (
                                <Alert variant='danger'>
                                    {nextPageError}
                                </Alert>
                            )
                        }
                        <div>
                            <span>
                                {
                                    isNextPageLoading && (
                                        <Spinner size='sm' />
                                    )
                                }
                            </span> Show more...
                        </div>
                    </ListGroup.Item>
                )
            }
        </ListGroup>
    );
}