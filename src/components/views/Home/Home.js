import React from 'react';
import {
  Col
} from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from '../../units/Header/Header';
import MastHeader from '../../units/MastHeader/MastHeader';
import Sidebar from '../../units/Sidebar/Sidebar';
import Footer from '../../units/Footer/Footer';
export default function Home () {
  return (
    <>
      <div>
        <Header />
      </div>
      <MastHeader />
      <Col md={2} style={{ backgroundColor: '#0c2245' }}>
        <Sidebar />
      </Col>
      <Col>
        <Outlet />
      </Col>
      <div>
        <Footer/>
      </div>
    </>
  );
}