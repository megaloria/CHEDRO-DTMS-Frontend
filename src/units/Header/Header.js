// import React, { useState } from "react";
import "./Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircleExclamation,
  faDoorOpen,
  faKey,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function Header() {


  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Home
    </Tooltip>
  );

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="white"
      variant="light"
      sticky="top">
      <Container className="cont1">
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 200 }}
          overlay={renderTooltip}
        >
          <Navbar.Brand className="title" href="#home">
            CHED Document Tracking Management System
          </Navbar.Brand>
        </OverlayTrigger>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon
                    icon={faBell}
                  /> Notifications
                </span>
              }
              id="collasible-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item className="ms-auto" href=" "
              >
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  fixedWidth
                /> Notifications here
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon
                    icon={faUser}
                  /> Username
                </span>
              }
              id="collasible-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item href=" ">
                <FontAwesomeIcon
                  icon={faKey}
                  fixedWidth
                /> Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href=" ">
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  fixedWidth
                /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;
