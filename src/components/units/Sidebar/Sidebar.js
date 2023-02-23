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
        <div>
            <Nav defaultActiveKey='/home' className='flex'>
                <Nav.Link  href='/home/documents' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faFileLines} className='me-2' />Documents
                    </span>
                </Nav.Link>
                <Nav.Link href='/home/users' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faUserGroup} className='me-2' />Users
                    </span>
                </Nav.Link>

                <NavDropdown
                    title={
                            <span style={{ color:'white', fontSize:'15px' }}>
                                <FontAwesomeIcon icon={faGear} className='me-2' />Settings
                            </span>
                        }
                    id='nav-dropdown'
                    className='flex1'>
                                      
                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/HEIs" eventKey='4.1'> <FontAwesomeIcon icon={faCaretRight} className='me-2' /> 
                            HEIs </NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="" eventKey='4.1'> <FontAwesomeIcon icon={faCaretRight} className='me-2' /> 
                            NGA </NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="" eventKey='4.1'> <FontAwesomeIcon icon={faCaretRight} className='me-2' /> 
                            CHED Offices </NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />
               

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/DocumentTypes" eventKey='4.2'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Document Types</NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/roles" eventKey='4.3'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Roles</NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/divisions" eventKey='4.4'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Divisions</NavDropdown.Item>
                    </span>
                </NavDropdown>
            </Nav>
        </div>
    );
}

export default Sidebar