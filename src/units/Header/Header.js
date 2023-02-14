// import React, { useState } from "react";
import "./Header.css";
import React, { useState } from 'react';
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    Nav,
    Navbar,
    NavDropdown,
    OverlayTrigger,
    Tooltip,
    Modal,
    Button
    } from "react-bootstrap";
import {
    faBell,
    faCircleExclamation,
    faDoorOpen,
    faKey,
    faUser
    } from "@fortawesome/free-solid-svg-icons";

function Header() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
              <NavDropdown.Item href="#">
                <FontAwesomeIcon
                  icon={faKey}
                  fixedWidth
                /> Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">
                <Button variant="outline" onClick={handleShow}>
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  fixedWidth
                /> Logout
                </Button>

                <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                    <Modal.Title>Logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to logout?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="outline-danger" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Logout
                    </Button>
                    </Modal.Footer>
                </Modal>

              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


  );
}
export default Header;
