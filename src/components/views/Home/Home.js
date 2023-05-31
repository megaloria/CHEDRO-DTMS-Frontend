import React, { useState } from 'react';
import {
  Alert,
  Col,
  Container,
  Row
} from 'react-bootstrap';
import { Outlet, useRouteLoaderData, Navigate } from 'react-router-dom';
import Header from '../../units/Header/Header';
import MastHeader from '../../units/MastHeader/MastHeader';
import Sidebar from '../../units/Sidebar/Sidebar';
import Footer from '../../units/Footer/Footer';
import axios from 'axios';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env['REACT_APP_PUSHER_KEY'],
  cluster: 'mt1',
  wsHost: process.env['REACT_APP_PUSHER_HOST'],
  wsPort: process.env['REACT_APP_PUSHER_PORT'],
  disableStats: true,
  encrypted: false,
  forceTLS: false,
  authorizer: (channel, options) => {
    return {
        authorize: (socketId, callback) => {
          const formData = new FormData();
          formData.append('socket_id', socketId);
          formData.append('channel_name', channel.name);
            axios.post(`${process.env['REACT_APP_API_URL']}/api/broadcasting/auth`, formData, {
              withCredentials: true
            })
            .then(response => {
                callback(null, response.data);
            })
            .catch(error => {
                callback(error);
            });
        }
    };
  },
});

export default function Home() {

  const loaderData = useRouteLoaderData('user');

  if (loaderData.is_first_login) {
    return <Navigate to='/change-password' />
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  return (
    <>
      <Header />
      <MastHeader />
      <Container fluid>
        <Row>
          <Col md={2} className='p-0' style={{ backgroundColor: '#0c2245' }}>
            <Sidebar />
          </Col>
          <Col md={10} className='p-2'>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}