import React  from 'react';
import {
    Nav,
    NavDropdown
} from 'react-bootstrap';
import {
    faGear,
    faFileLines,
    faUserGroup,
    faCaretRight
   
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

function Sidebar() {
    return(
        <div className='Sidebar'>
            <Nav defaultActiveKey='/home' className='flex'>
                <Nav.Link a href='/document' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faFileLines} className='me-2' />Documents
                    </span>
                </Nav.Link>
                <Nav.Link href='/users' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faUserGroup} className='me-2' />Users
                    </span>
                </Nav.Link>

                <NavDropdown
                    title=
                        {
                            <span style={{ color:'white', fontSize:'15px' }}>
                                <FontAwesomeIcon icon={faGear} className='me-2' />Settings
                            </span>
                        }
                        id='nav-dropdown'
                        className='flex1'>
                        <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item eventKey='4.1'> <FontAwesomeIcon icon={faCaretRight} className='me-2' /> 
                            HEIs</NavDropdown.Item>
                        </span>
                        <NavDropdown.Divider />

                        <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item eventKey='4.2'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Document Types</NavDropdown.Item>
                        </span>
                        <NavDropdown.Divider />

                        <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item eventKey='4.3'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Roles</NavDropdown.Item>
                        </span>
                        <NavDropdown.Divider />

                        <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item eventKey='4.4'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Divisions</NavDropdown.Item>
                        </span>
                </NavDropdown>
               
            </Nav>
        </div>
    );
}

export default Sidebar