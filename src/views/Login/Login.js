import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row
} from 'react-bootstrap';
import Validator from 'validatorjs';

import chedLogo from '../../assets/ched-logo.png'
import './styles.css'

function Login() {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });
    
  const [errors, setError] = useState({
    username: '',
    password: ''
  });

  function handleChange(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e){
    e.preventDefault();

    let validation = new Validator(values, {
      username: 'required|min:5',
      password: 'required|min:8'
    });

    if (validation.fails()) {
      setError({
        username: validation.errors.first('username'),
        password: validation.errors.first('password'),
      });
    } else {
      setError({
        username: '',
        password: ''
      });
    }
  }

  return (    
    <div className='maindiv'>
      <Container className='container1'>
        <Row style={{ height: '100%', alignItems: 'center' }}>
          <Col style={{ margin: 'auto' }}md={{ span: 4 }}>
            <Form onSubmit={handleSubmit}>
              <Card className='p-3' style={{borderRadius:'25px'}}>
                <Card.Body>
                  <div className='logo'>
                    <img src={chedLogo} width='150' alt='' />
                  </div>

                  <Form.Group 
                      className='mb-3' 
                      value={values.username}
                      controlId='formGridusername'
                      onChange={handleChange}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        placeholder='Username'
                        name='username' 
                        isInvalid = {!!errors.username} />
                        <Form.Control.Feedback type='invalid'>
                        {errors.username}
                    </Form.Control.Feedback>  
                  </Form.Group>
                  <Form.Group 
                      className='mb-3' 
                      value={values.password}
                      controlId='formGridpassword'
                      onChange={handleChange}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                    type='password'
                        placeholder='Password'
                        name='password' 
                        isInvalid = {!!errors.password} />
                        <Form.Control.Feedback type='invalid'>
                        {errors.password}
                    </Form.Control.Feedback>  
                  </Form.Group>
                  <Form.Group 
                    className= 'mb-3'
                    controlId='rememberPassword'>
                    <Form.Check 
                      pill type='checkbox' 
                      label='Remember password'/>
                  </Form.Group>

                  <div  className='d-grid gap-2'>
                    <Button
                      type='submit' 
                      variant='primary'>
                      Login
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

export default Login;