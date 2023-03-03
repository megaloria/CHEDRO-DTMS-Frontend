import React, { useEffect, useState } from 'react';
import {
    Nav
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
    Link,
    useLocation
} from 'react-router-dom';

import './styles.css';

function Sidebar() {
    const [activeKey, setActiveKey] = useState('documents');
    const location = useLocation();

    useEffect(() => {
        let split = location.pathname.split('/');
        if (split.length > 1) {
            setActiveKey(split[1]);
        }
    }, [location]);

    return(
        <div>
            <Nav defaultActiveKey='documents' className='flex' activeKey={activeKey}>
                <Nav.Link eventKey='documents' as={Link} to='documents' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faFileLines} className='me-2' />Documents
                    </span>
                </Nav.Link>
                <Nav.Link eventKey='users' as={Link} to='users' className='flex1'>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faUserGroup} className='me-2' />Users
                    </span>
                </Nav.Link>
                <Nav.Link eventKey='settings' className='flex1' onClick={e => setActiveKey('settings')}>
                    <span style={{ color: 'white', fontSize: '15px' }}>
                        <FontAwesomeIcon icon={faGear} className='me-2' />Settings
                    </span>
                </Nav.Link>
                <Nav className={`dropdown-menu-container ${activeKey === 'settings' ? 'open' : ''} flex-column`}>
                    <Nav.Link eventKey='heis' as={Link} to='settings/heis' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faBuildingColumns} />
                        HEIs
                    </Nav.Link>
                    <Nav.Link eventKey='ngas' as={Link} to='settings/ngas' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faLandmarkFlag} />
                        NGAs
                    </Nav.Link>
                    <Nav.Link eventKey='ched-offices' as={Link} to='settings/ched-offices' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faSchoolFlag} />
                        CHED Offices
                    </Nav.Link>
                    {/* <NavDropdown.Divider /> */}
                    <hr style={{ color: 'white', margin: '0 0 0 -1rem' }}/>
                    <Nav.Link eventKey='document-types' as={Link} to='settings/document-types' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faFile} />
                        Document Types
                    </Nav.Link>
                    <Nav.Link eventKey='categories' as={Link} to='settings/categories' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faTag} />
                        Categories
                    </Nav.Link>
                    <hr style={{ color: 'white', margin: '0 0 0 -1rem' }} />
                    <Nav.Link eventKey='roles' as={Link} to='settings/roles' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faUserTie} />
                        Roles
                    </Nav.Link>
                    <Nav.Link eventKey='divisions' as={Link} to='settings/divisions' className='flex2'>
                        <FontAwesomeIcon className='me-2' icon={faUsersLine} />
                        Divisions
                    </Nav.Link>
                </Nav>
            </Nav>
        </div>
    );
}

export default Sidebar