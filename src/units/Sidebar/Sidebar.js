import React  from 'react';
import "./Sidebar.css";
import { faGear, faNoteSticky, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

    function Sidebar() {
        return(
            
            <div className="Sidebar">
                <Nav defaultActiveKey="/home" className="flex">
                    <Nav.Link a href="/document" className="flex1"><span style={{color:'white',fontSize:'15px'}}><FontAwesomeIcon icon = {faNoteSticky} />&nbsp;&nbsp;Documents</span></Nav.Link>
                        <NavDropdown title= {<span style={{color:'white',fontSize:'15px'}}><FontAwesomeIcon icon ={faGear} />&nbsp;&nbsp;Settings</span>}  id="nav-dropdown" className="flex1">
                            <NavDropdown.Item eventKey="4.1">Document Type</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item eventKey="4.2">HEIs</NavDropdown.Item>
                        </NavDropdown>
                    <Nav.Link href="/users" className="flex1">{<span style={{color:'white',fontSize:'15px'}}><FontAwesomeIcon icon = {faUserPlus}/>&nbsp;&nbsp;Users</span>}</Nav.Link>
                </Nav>
            </div>
        );
    }

export default Sidebar