import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  FloatingLabel
} from 'react-bootstrap';
import Validator from 'validatorjs';
import Swal from 'sweetalert2';
import apiClient from '../../../helpers/apiClient';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import chedLogo from '../../../assets/ched-logo.png';
import './style.css';


function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const[passwordType, setPasswordType] = useState('password')
  const[passwordIcon, setPasswordIcon] = useState(<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);

 const handleToggle = () => {
    if (passwordType === 'password'){
      setPasswordType ('text');
      setPasswordIcon (<FontAwesomeIcon icon={faEye} className='fa-fw' />);
    } else {
      setPasswordType ('password');
      setPasswordIcon (<FontAwesomeIcon icon={faEyeSlash} className='fa-fw' />);
    }
    
  };

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
      return;
    }else {
      setError({
        username: '',
        password: ''
      });
    }

    setIsLoading(true);

    apiClient.post('/login', values).then(response => {
      
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

    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (    
    <div className='maindiv' style={{backgroundColor:'#0C2245'}}>
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

           <FloatingLabel  size="sm" controlId="floatingusername" label="Username">
             <Form.Control
                  type="text" 
                  placeholder="username"
                  name='username' 
                  isInvalid = {!!errors.username} />
            
            <Form.Control.Feedback type='invalid'>
               {errors.username}
            </Form.Control.Feedback> 

           </FloatingLabel>
              </Form.Group>
                  
              <Form.Group 
                  className='mb-3' 
                  value={values.password}
                  controlId='formGridpassword'
                  onChange={handleChange}>
         
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
                  type={passwordType} 
                  placeholder="Password"
                  name='password' 
                  isInvalid = {!!errors.password} />
            <span className='icon-span' onClick={handleToggle}>
                {passwordIcon}
            </span>
            <Form.Control.Feedback type='invalid'>
              {errors.password}
            </Form.Control.Feedback> 
          </FloatingLabel>
              </Form.Group>


                  <Form.Group 
                    className= 'mb-3'
                    controlId='rememberPassword'>
                    <Form.Check 
                       type='checkbox' 
                      label='Remember password'/>
                  </Form.Group>

                  <div  className='d-grid gap-2'>
                    <Button
                      type='submit' 
                      variant='primary'
                      disabled={isLoading}>
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