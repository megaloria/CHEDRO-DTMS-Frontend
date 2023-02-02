import React from "react";
import './Header.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircleExclamation, faCoffee, faDoorOpen, faGear, faGears, faHouseChimney, faHouseChimneyWindow, faKey } from '@fortawesome/free-solid-svg-icons';


function Header() {
    return (

        
        
        <Navbar collapseOnSelect expand="lg" bg="white" variant="light" sticky="top">
        <Container className ="cont1">
        <Navbar.Brand className="title" href="#home">CHED Document Tracking Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav"> 
          <Nav className="ms-auto">  
          
          <NavDropdown title={<span> <FontAwesomeIcon icon={faBell}/> Notifications</span>} id="collasible-nav-dropdown">
                <NavDropdown.Item href=" "> <FontAwesomeIcon icon={faCircleExclamation} fixedWidth/> Notifications here </NavDropdown.Item>
                <NavDropdown.Divider />
                
              </NavDropdown>
        <span>&nbsp;</span>
           <NavDropdown title={<span> <FontAwesomeIcon icon={faGear}/> Settings</span>} id="collasible-nav-dropdown">
                <NavDropdown.Item href=" "> <FontAwesomeIcon icon={faKey} fixedWidth/> Change Password </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href=" ">
                <FontAwesomeIcon icon={faDoorOpen} fixedWidth/> Logout
                </NavDropdown.Item>
              </NavDropdown>
              
            </Nav>
           
          </Navbar.Collapse>

          
        </Container>
      </Navbar>
      
    );
  

}
export default Header;
