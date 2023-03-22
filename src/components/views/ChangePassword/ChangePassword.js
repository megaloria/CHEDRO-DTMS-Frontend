import { useState } from 'react';
import Validator from 'validatorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import { useRouteLoaderData, useLocation } from 'react-router-dom';

import {
    faEye,
    faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Card,
    InputGroup,
    FloatingLabel
} from 'react-bootstrap';

import './styles.css';


function Changepassword() {
    
  const[passwordType, setPasswordType] = useState('password')
  const[passwordIcon, setPasswordIcon] = useState(<FaEyeSlash/>);

  

 const handleToggle = () => {
    if (passwordType === 'password'){
      setPasswordType ('text');
      setPasswordIcon (<FaEye/>);
    } else {
      setPasswordType ('password');
      setPasswordIcon (<FaEyeSlash/>);
    }
    
  };

    const [values, setValues] = useState({
        Currentpassword: '',
        Newpassword: '',
        Confirmpassword: '',
        passwordInput: '',


    });

    const [errors, setError] = useState({

        Currentpassword: '',
        Newpassword: '',
        Confirmpassword: '',

    });

    function handleChange(e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }



    function handleSubmit(e) {
        e.preventDefault();


        let validation = new Validator(values, {
            Currentpassword: 'present',
            Newpassword: 'required|same:Confirmpassword|min:8',
            Confirmpassword: 'required|same:Newpassword|min:8'
        });


        if (validation.fails()) {
            setError({
                Currentpassword: validation.errors.first('Currentpassword'),
                Newpassword: validation.errors.first('Newpassword'),
                Confirmpassword: validation.errors.first('Confirmpassword'),
            });

        }

        else {
            setError({
                Currentpassword: '',
                Newpassword: '',
                Confirmpassword: ''

            });
        }
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
                            value={values.currentpassword}
                            controlId='formGridpassword'
                            onChange={handleChange}>
         
                <FloatingLabel controlId="floatingPassword" label="Current Password">
                    <Form.Control
                            type={passwordType} 
                            placeholder="Password"
                            name='Currentpassword' 
                            isInvalid = {!!errors.Currentpassword} />
                            <span className='icon-span' onClick={handleToggle}>
                                {passwordIcon}
                            </span>

                            <Form.Control.Feedback type='invalid'>
                            {errors.Currentpassword}
                            </Form.Control.Feedback> 

                </FloatingLabel>
                 </Form.Group>

                 
                <Form.Group 
                            className='mb-3' 
                            value={values.Newpassword}
                            controlId='formGridpassword'
                            onChange={handleChange}>
         
                <FloatingLabel controlId="floatingPassword" label="New password">
                    <Form.Control
                            type={passwordType} 
                            placeholder="Newpassword"
                            name='Newpassword' 
                            isInvalid = {!!errors.Newpassword} />
                            <span className='icon-span' onClick={handleToggle}>
                                {passwordIcon}
                            </span>

                            <Form.Control.Feedback type='invalid'>
                            {errors.Newpassword}
                            </Form.Control.Feedback> 

                </FloatingLabel>
                </Form.Group>
                <Form.Group 
                            className='mb-3' 
                            value={values.Confirmpassword}
                            controlId='formGridpassword'
                            onChange={handleChange}>
         
                <FloatingLabel controlId="floatingPassword" label="Confirm password">
                    <Form.Control
                            type={passwordType} 
                            placeholder="Confirmpassword"
                            name='Confirmpassword' 
                            isInvalid = {!!errors.Confirmpassword} />
                            <span className='icon-span' onClick={handleToggle}>
                                {passwordIcon}
                            </span>

                            <Form.Control.Feedback type='invalid'>
                            {errors.Confirmpassword}
                            </Form.Control.Feedback> 

                </FloatingLabel>
                </Form.Group>





                                 


                                    <div className='d-grid gap-2'>
                                        <Button
                                            type='submit'
                                            variant='primary'> Save
                                        </Button>

                                        <Button
                                            type=''
                                            variant='dark'> Cancel
                                        </Button>
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