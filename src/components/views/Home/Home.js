import React from 'react';
import {
  Col
} from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
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
        <Outlet />
      </Col>
    </>
  );
}