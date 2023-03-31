import React from 'react';
import { useState } from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faDoorOpen,
  faKey,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useRouteLoaderData, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import './styles.css';
import apiClient from '../../../helpers/apiClient';

function Header(props) {

  let loaderData = useRouteLoaderData('user') ?? props.user;

  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleLogout = e => {

    apiClient.delete('/user').then(response => {

      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: 'success',
        timer: 1500
      })

      navigate('/')

    }).catch(error => {

      Swal.fire({
        title: "Failed",
        text: error,
        icon: 'error',
        timer: 1500
      })

    })
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Home
    </Tooltip>
  );

  return (
   <>
    <Navbar
      collapseOnSelect
      expand='lg'
      variant='light'
      className='bg-white'
      sticky='top'>
      <Container className='cont1'>
        <OverlayTrigger
          placement='right'
          delay={{ show: 250, hide: 200 }}
          overlay={renderTooltip}>
          <Navbar.Brand className='title' href='#home'>
            <span className='d-none d-md-inline-block'>
              CHEDRO IV Document Tracking Management System
            </span>
            <span className='d-inline-block d-md-none'>
              CHEDRO IV DTMS
            </span>
          </Navbar.Brand>
        </OverlayTrigger>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ms-auto'>
            <NavDropdown
              title={ 
                <span className='text'>
                  <FontAwesomeIcon icon={faBell} className="bell-icon" /> Notifications
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
            </NavDropdown>
            <NavDropdown 
              title={
                <span className='text'>
                  <FontAwesomeIcon icon={faUser} className="user-icon" /> {loaderData.profile.name}
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>

              <NavDropdown.Item as={Link} to='update-password'>
                <FontAwesomeIcon
                  icon={faKey}
                  fixedWidth  /> Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleShow}>
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  fixedWidth /> Logout
              </NavDropdown.Item>

            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                  <Modal.Body>Are you sure you want to log out?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Modal.Footer>
              </Modal> 
  </>
  );
}

export default Header;
