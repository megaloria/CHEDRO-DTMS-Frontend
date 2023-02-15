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

import './styles.css';

function Header() {
  
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
      sticky='top'>
      <Container className='cont1'>
        <OverlayTrigger
          placement='right'
          delay={{ show: 250, hide: 200 }}
          overlay={renderTooltip}>
          <Navbar.Brand className='title' href='#home'>
            <span className='d-none d-md-inline-block'>
              CHEDRO4 Document Tracking Management System
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
                  <FontAwesomeIcon icon={faUser} /> Username
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
              <NavDropdown.Item href=' '>
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
