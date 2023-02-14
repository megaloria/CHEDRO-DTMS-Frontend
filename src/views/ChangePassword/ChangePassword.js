import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup'
import './/styles.css'
import Validator from 'validatorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  {

  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'



function Changepassword() {

  const [values, setValues] = useState({
          Currentpass:  '',
          Newpass:      '',
          Confirmpass:  '',
          passwordInput: '',


  });

  ///Validation
  const [passwordType, setPasswordType] = useState("password");
  
  const togglePassword =()=>{
    if(passwordType === "password"){

    setPasswordType("text")
    return;
    }
    setPasswordType("password")

  }

    
    const [errors, setError] = useState({

         Currentpass:  '',
          Newpass:      '',
          Confirmpass:  ''
     
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
          Currentpass:  '',
          Newpass:      'required|min:8',
          Confirmpass:  'required|min:8'
        });
       
        if (validation.fails()) {
          setError({
            Currentpass: validation.errors.first('Currentpass'),
            Newpass: validation.errors.first('Newpass'),
            Confirmpass: validation.errors.first('Confirmpass'),
              });
        } else {
          setError({
            Currentpass: '',
             Newpassword: '',
             Confirmpass:''

          });
        }
      }

          return (    
          
          <div className='maindiv'>

            <Container className='container1'>

            <Row style={{ height: '100%', alignItems: 'center'}}>

            <Col style={{margin:'auto'}}md={{ span: 4 }}>

              <Form onSubmit={handleSubmit}>

              <Card className='p-3' style={{borderRadius:'25px'}}>
                  <Card.Body>
                          
                <Form.Group className="mb-3"
                        value={values.Currentpass}
                        controlId='formGridpassword' 
                        onChange={handleChange}>
                          
                      <Form.Label>New Password</Form.Label>

                      <InputGroup>
                          <Form.Control
                              onChange={handleChange}
                              name='Newpass' 
                              type={passwordType}
                              isInvalid = {!!errors.Currentpass}
                              placeholder="New Password"
                              aria-describedby="basic-addon"
                              required
                            />

                          <Button id="button-addon" variant="outline-secondary" 
                              onClick={togglePassword}>
                              {passwordType==="password"? 
                              <FontAwesomeIcon icon={faEye} className='fa-fw'/> 
                              :<FontAwesomeIcon icon={faEyeSlash} className='fa-fw'/>

                              }

                                </Button>
                            <Form.Control.Feedback type='invalid'>
                                {errors.Currentpass}
                            </Form.Control.Feedback>  
                                
                        </InputGroup>
                        </Form.Group>


                    <Form.Group className="mb-3"
                    value={values.Newpass}
                    controlId='formGridpassword' 
                    onChange={handleChange}>
                      
                  <Form.Label>New Password</Form.Label>

                  <InputGroup>
                      <Form.Control
                          onChange={handleChange}
                          name='Newpass' 
                          type={passwordType}
                          isInvalid = {!!errors.Newpass}
                          placeholder="New Password"
                          aria-describedby="basic-addon"
                          required

                        />

                      <Button id="button-addon" variant="outline-secondary" 
                          onClick={togglePassword}>
                          {passwordType==="password"? 
                          <FontAwesomeIcon icon={faEye} className='fa-fw'/> 
                          :<FontAwesomeIcon icon={faEyeSlash} className='fa-fw'/>

                          }

                            </Button>
                    <Form.Control.Feedback type='invalid'>
                                      {errors.Newpass}
                                  </Form.Control.Feedback>  
                            
                    </InputGroup>
                    </Form.Group>


                <Form.Group className="mb-3"
                value={values.passwordInput}
                controlId='formGridpassword' 
                onChange={handleChange}>
                  
                <Form.Label>Confirm Password</Form.Label>

                <InputGroup>
                  <Form.Control
                      onChange={handleChange}
                      name='Confirmpass' 
                      type={passwordType}
                      isInvalid = {!!errors.Confirmpass}
                      placeholder="Confirm Password"
                      aria-describedby="basic-addon"
                      required
                    />
                        <Button id="button-addon" variant="outline-secondary" 
                            onClick={togglePassword}>
                            {passwordType==="password"? 
                            <FontAwesomeIcon icon={faEye} className='fa-fw'/> 
                            :<FontAwesomeIcon icon={faEyeSlash} className='fa-fw'/>

                            }

                        </Button>
                <Form.Control.Feedback type='invalid'>
                                  {errors.Confirmpass}
                              </Form.Control.Feedback>  
                        
                </InputGroup>

                </Form.Group>
                      <div  className='d-grid gap-2'>
                      <Button
                        type='submit' 
                        variant='primary'> save
                    </Button>
                    <Button
                        type='' 
                        variant='danger'> cancel
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