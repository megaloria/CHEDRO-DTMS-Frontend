import React from 'react';
import {
  Col,
  Row
} from 'react-bootstrap';
import Header from '../../units/Header/Header';
import MastHeader from '../../units/MastHeader/MastHeader';
import Sidebar from '../../units/Sidebar/Sidebar';

export default function Home () {
  return (
    <>
      <div>
        <Header />
      </div>
      <MastHeader />
      <Col md={2}>
        <Sidebar />
      </Col>
      <Col>
      </Col>
    </>
  );
}