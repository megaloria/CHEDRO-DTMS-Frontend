import React, { useEffect, useState } from 'react';
import apiClient from '../../../helpers/apiClient';
import { Alert, ListGroup, Spinner } from 'react-bootstrap';

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

    if (isLoading) {
        return (
            <Spinner />
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
        <ListGroup variant='flush'>
            {
                notifications.data.map(notification => (
                    <ListGroup.Item key={notification.id} action>
                        The document {notification.data.document.tracking_no} has been forwarded to you.
                    </ListGroup.Item>
                ))
            }
        </ListGroup>
    );
}