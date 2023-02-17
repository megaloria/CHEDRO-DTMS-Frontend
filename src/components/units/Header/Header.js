import React from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faDoorOpen,
  faKey,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';

import './styles.css';
import apiClient from '../../../helpers/apiClient';

function Header() {

  const loaderData = useRouteLoaderData('user');
  
  console.log(loaderData);

  const navigate = useNavigate();
  
  const handleLogout = e => {

    apiClient.delete('/user').then(response => {

      Swal.fire({
        title: "Successful Logout",
        text: response.data.message,
        icon: 'success',
        timer: 1500
      })

      navigate('/')

    }).catch(error => {

      Swal.fire({
        title: "Unable to Logout",
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
              CHED Document Tracking Management System
            </span>
            <span className='d-inline-block d-md-none'>
              CHED DTMS
            </span>
          </Navbar.Brand>
        </OverlayTrigger>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ms-auto'>
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faBell} /> Notifications
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
            </NavDropdown>
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faUser} /> {loaderData.profile.name}
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
              <NavDropdown.Item href=' '>
                <FontAwesomeIcon
                  icon={faKey}
                  fixedWidth /> Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  fixedWidth /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
