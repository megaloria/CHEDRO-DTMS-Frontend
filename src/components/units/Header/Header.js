import React from 'react';
import { useState } from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Popover
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faDoorOpen,
  faKey,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useRouteLoaderData, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import './styles.css';
import apiClient from '../../../helpers/apiClient';
import Notifications from '../Notifications/Notifications';
import chedLogo from '../../../assets/ched-logo.png';

import notifSound from '../../../assets/notification.wav';

function Header(props) {

  let loaderData = useRouteLoaderData('user') ?? props.user;

  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(loaderData.unread_notifications_count);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleLogout = e => {

    apiClient.delete('/user').then(response => {

      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: 'success',
        timer: 1500
      })

      if (window.Pusher) {
        window.Pusher = null;
      }
      if (window.Echo) {
        window.Echo = null;
      }
      navigate('/');

    }).catch(error => {

      Swal.fire({
        title: "Failed",
        text: error,
        icon: 'error',
        timer: 1500
      })

    })
  };

  const handleChangeNotificationsCount = newCount => {
    setNewNotificationsCount(newCount);
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Home
    </Tooltip>
  );

  if (window.Echo) {
    window.Echo.channel(`private-user.${loaderData.id}`)
    .notification((e) => {

      if(!("Notification" in window)) {
        console.log("This browser does not support system notifications!")
      } else if (Notification.permission === "granted") {
        window.document.onvisibilitychange = () => {
          if (window.document.hidden) {
            const notification = new Notification("New notification from DTMS", {
              icon: chedLogo,
              body: `You have a new notification on document ${e.document.tracking_no}`
            });
            notification.onclick = ()=> function() {
              window.open(`${process.env['REACT_APP_URL']}/documents/view/${e.document.id}`);
            }
          }
        }
      } else if (Notification.permission !== "denied") {
         Notification.requestPermission((permission)=> {
            if (permission === "granted") {
              window.document.onvisibilitychange = () => {
                if (window.document.hidden) {
                  const notification = new Notification("New notification from DTMS", {
                    icon: chedLogo,
                    body: `You have a new notification on document ${e.document.tracking_no}`
                  });
                  notification.onclick = ()=> function() {
                    window.open(`${process.env['REACT_APP_URL']}/documents/view/${e.document.id}`);
                  }
                }
              }
            }
         });
      }

      (new Audio(notifSound)).play();
      setNewNotificationsCount(e.unread_notifications_count);
        setNewNotification(true);
        setTimeout(() => {
          setNewNotification(false);
        }, 1000)
    });
  }

  return (
   <>
    <Navbar
      collapseOnSelect
      expand='lg'
      variant='light'
      className='bg-white'
      sticky='top'>
      <Container className='cont1'>
        <OverlayTrigger
          placement='right'
          delay={{ show: 250, hide: 200 }}
          overlay={renderTooltip}>
            <Navbar.Brand className='title' as={Link} to='documents'>
            <span className='d-none d-md-inline-block'>
              CHEDRO IV Document Tracking Management System
            </span>
            <span className='d-inline-block d-md-none'>
              CHEDRO IV DTMS
            </span>
          </Navbar.Brand>
        </OverlayTrigger>

       
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          
            <Nav className='ms-auto'>
            {/* <NavDropdown
              title={ 
                <span className='text'>
                  <FontAwesomeIcon icon={faBell} className="bell-icon" /> Notifications
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
                <NavDropdown.Menu>
                  Hello
                </NavDropdown.Menu>
            </NavDropdown> */}
            {
              !loaderData.is_first_login && (
                <OverlayTrigger
              trigger="click"
              placement='bottom-end'
              rootClose
              overlay={
                <Popover style={{ width: '276px' }} className='notifications'>
                  <Popover.Header className='notif'>
                    Notifications
                  </Popover.Header>
                  <Popover.Body className='px-0' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <Notifications onChangeNotificationsCount={handleChangeNotificationsCount} />
                  </Popover.Body>
                </Popover>
              }
            >
              <Nav.Link>
                <span className={`text ${newNotification ? 'active' : ''}`}>
                  <span className='fa-layers fa-fw'>
                    <FontAwesomeIcon icon={faBell} size='lg' className="bell-icon" />
                    {
                      newNotificationsCount ? (
                        <span className='fa-layers-counter fa-2x' >{newNotificationsCount}</span>
                      ) : null
                    }
                  </span> Notifications
                </span>
              </Nav.Link>
            </OverlayTrigger>
              )
            }
            
            <NavDropdown 
              title={
                <span className='text'>
                  <FontAwesomeIcon icon={faUser} className="user-icon" /> {loaderData.profile.name}
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
              {
                !loaderData.is_first_login && (
                  <>
                    <NavDropdown.Item as={Link} to='update-password'>
                      <FontAwesomeIcon
                        icon={faKey}
                        /> Change Password
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )
              }
              

              <NavDropdown.Item onClick={handleShow}>
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  /> Logout
              </NavDropdown.Item>

            </NavDropdown>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
   
    
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                  <Modal.Body>Are you sure you want to log out?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Modal.Footer>
              </Modal> 
  </>
  );
}

export default Header;
