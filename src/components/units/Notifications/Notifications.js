import React, { useEffect, useState } from 'react';
import apiClient from '../../../helpers/apiClient';
import { Spinner } from 'react-bootstrap';

export default function Notifications() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        apiClient.get('notifications')
    }, []);

    if (isLoading) {
        return (
            <Spinner />
        );
    }
    

    return (
        <div>
            Hello 
        </div>
    );
}