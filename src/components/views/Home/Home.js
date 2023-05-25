import React from 'react';
import {
  Col,
  Container,
  Row
} from 'react-bootstrap';
import { Outlet, useRouteLoaderData, Navigate } from 'react-router-dom';
import Header from '../../units/Header/Header';
import MastHeader from '../../units/MastHeader/MastHeader';
import Sidebar from '../../units/Sidebar/Sidebar';
import Footer from '../../units/Footer/Footer';

export default function Home() {

  const loaderData = useRouteLoaderData('user');

  if (loaderData.is_first_login) {
    return <Navigate to='/change-password' />
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