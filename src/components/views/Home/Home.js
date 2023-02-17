import React from 'react';
import {
  Col,
  Container,
  Row
} from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from '../../units/Header/Header';
import MastHeader from '../../units/MastHeader/MastHeader';
import Sidebar from '../../units/Sidebar/Sidebar';

export default function Home () {
  return (
    <>
      <Header />
      <MastHeader />
      <Container fluid>
        <Row>
          <Col md={2} className='p-0' style={{ backgroundColor: '#13336d' }}>
            <Sidebar />
          </Col>
          <Col md={10} className='p-3'>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
}