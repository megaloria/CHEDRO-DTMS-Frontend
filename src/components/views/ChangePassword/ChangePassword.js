import React, { useState } from 'react';
import Validator from 'validatorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import { 
    useNavigate, 
    Link,
    useLoaderData, } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../../../helpers/apiClient';
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Card,
    FloatingLabel
} from 'react-bootstrap';
import './styles.css';

function Changepassword() {

const loaderData = useLoaderData();
    
const[passwordType, setPasswordType] = useState('password')
const[passwordType1, setPasswordType1] = useState('password')
const[passwordIcon, setPasswordIcon] = useState(<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);
const[passwordIcon1, setPasswordIcon1] = useState(<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);
const navigate = useNavigate();
    
 const handleToggleCurrentpassword = () => {
    if (passwordType1 === 'password'){
      setPasswordType1 ('text');
      setPasswordIcon1 (<FontAwesomeIcon icon={faEye} className='fa-fw' />);
    } else {
      setPasswordType1 ('password');
      setPasswordIcon1 (<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);
    }
  };
  
 const handleToggleNewpassword = () => {
    if (passwordType === 'password'){
      setPasswordType ('text');
      setPasswordIcon (<FontAwesomeIcon icon={faEye} className='fa-fw' />);
    } else {
      setPasswordType ('password');
      setPasswordIcon (<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);
    }
  };
  
 const handleToggleConfPassword = () => {
    if (passwordType === 'password'){
      setPasswordType ('text');
      setPasswordIcon (<FontAwesomeIcon icon={faEye} className='fa-fw' />);
    } else {
      setPasswordType ('password');
      setPasswordIcon (<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);
    }
  };

    const [values, setValues] = useState({
        password: '',
        new_password: '',
        confirm_password: ''
    });

    const [errors, setError] = useState({
        password: '',
        new_password: '',
        confirm_password: ''
    });

    function handleChange(e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'password') {
            setValues({
                ...values,
                password: e.target.value
            });
        } else if (e.target.name === 'new_password') {
            setValues({
                ...values,
                new_password: e.target.value
            });      
        } else if (e.target.name === 'confirm_password') {
            setValues({
                ...values,
                confirm_password: e.target.value
            });
        } 
    }

    function handleSubmit(e) {
        e.preventDefault();
        let validation = new Validator(values, {
            password: 'present|required',
            new_password: 'required|same:confirm_password|min:8',
            confirm_password: 'required|same:new_password|min:8'
        });

        if (validation.fails()) {
            setError({
                password: validation.errors.first('password'),
                new_password: validation.errors.first('new_password'),
                confirm_password: validation.errors.first('confirm_password'),
            });
        }

        else {
            setError({
                password: '',
                new_password: '',
                confirm_password: ''
            });
            handleChangePass();
        }
    }

    const handleChangePass = () => {
        apiClient.post('/users/change-password', {
            password: values.password,
            new_password: values.new_password
        }).then(response => {
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            }).then(() => {
                navigate('/')
            })
        }).catch(error => {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        });
    }

    return (
        <div className='maindiv'>
            <Container className='container1'>
                <Row style={{ height: '100%', alignItems: 'center' }}>
                    <Col style={{ margin: 'auto' }} md={{ span: 4 }}>
                        <Form onSubmit={handleSubmit}>
                            <Card className='p-3' style={{ borderRadius: '25px', width: '70vh' }}>
                                <Card.Body>
                                    <Form.Group 
                                        className='mb-3' 
                                        value={values.password}
                                        controlId='formGridpassword'
                                        onChange={handleChange}>
                                    <FloatingLabel controlId="floatingPassword" label="Current Password">
                                    <Form.Control
                                            type={passwordType1} 
                                            placeholder="Password"
                                            name='password' 
                                            isInvalid = {!!errors.password} />
                                        <span className='icon-span' onClick={handleToggleCurrentpassword}>
                                            {passwordIcon1}
                                        </span>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.password}
                                    </Form.Control.Feedback> 
                                    </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group 
                                        className='mb-3' 
                                        value={values.new_password}
                                        controlId='formGridpassword'
                                        onChange={handleChange}>
                                    <FloatingLabel controlId="floatingPassword" label="New password">
                                    <Form.Control
                                        type={passwordType} 
                                        placeholder="New Password"
                                        name='new_password' 
                                        isInvalid = {!!errors.new_password} />
                                        <span className='icon-span' onClick={handleToggleNewpassword}>
                                            {passwordIcon}
                                        </span>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.new_password}
                                    </Form.Control.Feedback> 
                                    </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group 
                                        className='mb-3' 
                                        value={values.confirm_password}
                                        controlId='formGridpassword'
                                        onChange={handleChange}>
                                    <FloatingLabel controlId="floatingPassword" label="Confirm password">
                                    <Form.Control
                                        type={passwordType} 
                                        placeholder="Confirm Password"
                                        name='confirm_password' 
                                        isInvalid = {!!errors.confirm_password} />
                                        <span className='icon-span' onClick={handleToggleConfPassword}>
                                            {passwordIcon}
                                        </span>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.confirm_password}
                                    </Form.Control.Feedback> 
                                    </FloatingLabel>
                                    </Form.Group>

                                    <div className='d-grid gap-2'>
                                        <Button
                                            type='submit'
                                            variant='primary'> Save
                                        </Button>
                                       
                                        {loaderData.is_first_login ? null : (
                                        <Button
                                            variant="dark"
                                            as={Link}
                                            to='../'>
                                            Cancel
                                        </Button>
                                    )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Changepassword;