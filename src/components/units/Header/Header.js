import React, { useState } from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
  Modal,
  Form,
  Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faDoorOpen,
  faKey,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';

import './styles.css';
import apiClient from '../../../helpers/apiClient';

function Header() {

  const loaderData = useRouteLoaderData('user');

  const [data, setData] = useState([]); //data variable
  
  console.log(loaderData);

  const navigate = useNavigate();

  const [modalReset, setmodalReset] = useState({ //modal variables
    show: false,
    data: null,
    isLoading: false
  });

  const [formInputPass, setformInputPass] = useState({ // input inside the modal
    reset_password: ''
  });

  const [formErrorPass, setformErrorPass] = useState({ //errors for the inputs in the modal
    reset_password: ''
  });

  const handleSubmitReset = event => {
    event.preventDefault();
    let validation = new Validator(formInputPass, {
      reset_password: 'required|string|min:8'
    });
    if (validation.fails()) {
      setformErrorPass({
        reset_password: validation.errors.first('reset_password'),
      });
      return;
    } else {
      setformErrorPass({
        reset_password: '',
      });
    }
    setmodalReset({
      ...modalReset,
      isLoading: true
    });
    handleReset();
  };

  const handleReset = () => {
    apiClient.post(`/user/${modalReset.data?.id}/reset`, {
      ...formInputPass,
    }).then(response => {
      let newData = data.data.map(d => {
          if (d.id === response.data.data.id) {
              return {...response.data.data};
          }

          return {...d};
      })
      setData({
        ...data,
        data: newData
    });
      Swal.fire({
        title: 'Success',
        text: response.data.message,
        icon: 'success'
      }).then(() => {
        handleHidemodalReset();
      });
    }).catch(error => {
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error'
      });
    }).finally(() => {
      setmodalReset({
        ...modalReset,
        isLoading: false
      });
    });
  }

  const handleInputChangePass = e => {
    setformInputPass({
      ...formInputPass,
      [e.target.name]: e.target.value
    });
  }

  const handleShowmodalReset = (data = null) => {
    if (data !== null) {
      setformInputPass({
          ...formInputPass,
          reset_password: data.reset_password,
      });
  }
  
    setmodalReset({
      show: true,
      data,
      isLoading: false
    });
  }

  const handleHidemodalReset = () => {
    setformInputPass({
      reset_password: '',
    });
    setmodalReset({
      show: false,
      data: null,
      isLoading: false
    });
  }
  
  const handleLogout = e => {

    apiClient.delete('/user').then(response => {

      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: 'success',
        timer: 1500
      })

      navigate('/')

    }).catch(error => {

      Swal.fire({
        title: "Failed",
        text: error,
        icon: 'error',
        timer: 1500
      })

    })
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Home
    </Tooltip>
  );

  return (
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
          <Navbar.Brand className='title' href='#home'>
            <span className='d-none d-md-inline-block'>
              CHED IV Document Tracking Management System
            </span>
            <span className='d-inline-block d-md-none'>
              CHED IV DTMS
            </span>
          </Navbar.Brand>
        </OverlayTrigger>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ms-auto'>
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faBell} /> Notifications
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
            </NavDropdown>
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faUser} /> {loaderData.profile.name}
                </span>
              }
              id='collasible-nav-dropdown'
              renderMenuOnMount={true}>
              <NavDropdown.Item href=' '>
                <Button onClick={e => handleShowmodalReset(loaderData)} variant='link'>
                  <FontAwesomeIcon icon={faKey} /> Change Password
                </Button>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  fixedWidth /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* <!--- Model Box Reset password ---> */}
      <Modal
        show={modalReset.show}
        onHide={handleHidemodalReset}
        backdrop="static"
        keyboard={false}
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Reset Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitReset}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                name='reset_password'
                value={formInputPass.reset_password}
                onChange={handleInputChangePass}
                isInvalid={!!formErrorPass.reset_password} />
              <Form.Control.Feedback type='invalid'>
                {formErrorPass.reset_password}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleHidemodalReset}
              disabled={modalReset.isLoading}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={modalReset.isLoading}>
              Reset
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Navbar>

    
  );
}

export default Header;
