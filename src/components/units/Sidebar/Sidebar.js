import React  from 'react';
import {
    Nav,
    NavDropdown
} from 'react-bootstrap';
import {
    faGear,
    faFileLines,
    faUserGroup
    // faCaretRight
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
                        <NavDropdown.Item href="/settings/HEIs" eventKey='4.1'> <FontAwesomeIcon className='me-2' /> 
                            HEIs </NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/NGA" eventKey='4.2'> <FontAwesomeIcon className='me-2' /> 
                            NGAs </NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/CHED" eventKey='4.3'> <FontAwesomeIcon className='me-2' /> 
                            CHED Offices </NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider/>

                    {/* <h6 class="dropdown-header">Document</h6> */}
                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/DocumentTypes" eventKey='4.4'> <FontAwesomeIcon className='me-2' />
                            Document Types</NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="" eventKey='4.4'> <FontAwesomeIcon className='me-2' />
                            Category</NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/roles" eventKey='4.5'> <FontAwesomeIcon className='me-2' />
                            Roles</NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/divisions" eventKey='4.6'> <FontAwesomeIcon className='me-2' />
                            Divisions</NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item href="/settings/category" eventKey='4.7'> <FontAwesomeIcon icon={faCaretRight} className='me-2' />
                            Category</NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />
                </NavDropdown>
            </Nav>
        </div>
    );
}

export default Sidebar