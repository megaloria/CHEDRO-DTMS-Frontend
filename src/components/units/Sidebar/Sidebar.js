import React  from 'react';
import {
    Nav,
    NavDropdown
} from 'react-bootstrap';
import {
    faGear,
    faFileLines,
    faUserGroup,
    faBuildingColumns,
    faLandmarkFlag,
    faSchoolFlag,
    faFile,
    faTag,
    faUserTie,
    faUsersLine
    // faCaretRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Link
} from 'react-router-dom';

import './styles.css';

function Sidebar() {
    return(
        <div>
            <Nav defaultActiveKey='/home' className='flex'>
                <Nav.Link as={Link} to='documents' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faFileLines} className='me-2' />Documents
                    </span>
                </Nav.Link>
                <Nav.Link as={Link} to='settings/users' className='flex1'>
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
                        <NavDropdown.Item as={Link} to='settings/heis' > 
                        <FontAwesomeIcon className='me-2' icon={faBuildingColumns} /> 
                            HEIs </NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item as={Link} to='settings/ngas' > 
                        <FontAwesomeIcon className='me-2' icon={faLandmarkFlag}/> 
                            NGAs </NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item as={Link} to='settings/ched-offices' > 
                        <FontAwesomeIcon className='me-2' icon={faSchoolFlag}/> 
                            CHED Offices </NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider/>

                    {/* <h6 class="dropdown-header">Document</h6> */}
                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item as={Link} to='settings/document-types'> 
                        <FontAwesomeIcon className='me-2' icon={faFile}/>
                            Document Types</NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item as={Link} to='settings/categories' > 
                        <FontAwesomeIcon className='me-2' icon={faTag}/>
                            Categories</NavDropdown.Item>
                    </span>
                        <NavDropdown.Divider />

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item as={Link} to='settings/roles'> 
                        <FontAwesomeIcon className='me-2' icon={faUserTie} />
                            Roles</NavDropdown.Item>
                    </span>

                    <span style={{ color: 'black', fontSize: '15px', display:'flex'}}>
                        <NavDropdown.Item as={Link} to='settings/divisions' > <FontAwesomeIcon className='me-2' icon={faUsersLine}/>
                            Divisions</NavDropdown.Item>
                    </span>

                </NavDropdown>
            </Nav>
        </div>
    );
}

export default Sidebar