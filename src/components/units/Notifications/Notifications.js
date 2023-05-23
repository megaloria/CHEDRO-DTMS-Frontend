import React, { useEffect, useState } from 'react';
import apiClient from '../../../helpers/apiClient';
import { Alert, ListGroup, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import './styles.css';

export default function Notifications() {
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
                        The document <b>{notification.data.document.tracking_no}</b> has been <span className='forwarded-text'>forwarded</span> to you.
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
                    <ListGroup.Item key={notification.id} action className={`d-flex justify-content-center align-items-center ${notification.read_at ? 'opacity-50' : ''}`}>
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