import React  from 'react';
import {
    Nav,
    NavDropdown
} from 'react-bootstrap';
import {
    faGear,
    faNoteSticky,
    faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

function Sidebar() {
    return(
        <div className='Sidebar'>
            <Nav defaultActiveKey='/home' className='flex'>
                <Nav.Link a href='/document' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faNoteSticky} className='me-2' />Documents
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
                    <NavDropdown.Item eventKey='4.1'>Document Type</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item eventKey='4.2'>HEIs</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href='/users' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faUserPlus} className='me-2' />Users
                    </span>
                </Nav.Link>
            </Nav>
        </div>
    );
}

export default Sidebar