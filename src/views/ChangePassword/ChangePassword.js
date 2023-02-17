import { useState } from 'react';
import Validator from 'validatorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  {
  faEye,
  faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  InputGroup} from 'react-bootstrap';

import './styles.css';


function Changepassword() {

  const [values, setValues] = useState({
          Currentpassword:  '',
          Newpassword:      '',
          Confirmpassword:  '',
          passwordInput: '',


  });

  ///eye icon function
  const [passwordType, setPasswordType] = useState("password");
  
  const togglePassword =()=>{
    if(passwordType === "password"){

    setPasswordType("text")
    return;
    }
    setPasswordType("password")

  }
///end of eye icon function
    
    const [errors, setError] = useState({

          Currentpassword:  '',
          Newpassword:      '',
          Confirmpassword:  '',
     
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
          Currentpassword:  'present',
          Newpassword:      'required|same:Confirmpassword|min:8',
          Confirmpassword:  'required|same:Newpassword|min:8'
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
             Confirmpassword:''

          });
        }
      }
    
          return (    
          
          <div className='maindiv'>

            <Container className='container1'>

            <Row style={{ height: '100%', alignItems: 'center'}}>

            <Col style={{margin:'auto'}}md={{ span: 4 }}>

              <Form onSubmit={handleSubmit}>

              <Card className='p-3' style={{borderRadius:'25px', width:'70vh'}}>
                  <Card.Body>
                          
                <Form.Group className="mb-3"
                        value={values.Currentpassword}
                        controlId='formGridpassword' 
                        onChange={handleChange}>
                          
                <Form.Label>Current Password</Form.Label>

                      <InputGroup>
                          <Form.Control
                              onChange={handleChange}
                              name='Currentpassword' 
                              type={passwordType}
                              isInvalid = {!!errors.Currentpassword}
                              placeholder="Current password"
                              aria-describedby="basic-addon"
                              required
                            />

                          <Button style={{borderRadius:'5px'}} id="button-addon" variant="outline-secondary" 
                              onClick={togglePassword}>
                              {passwordType==="password"? 
                              <FontAwesomeIcon icon={faEye} className='fa-fw'/> 
                              :<FontAwesomeIcon icon={faEyeSlash} className='fa-fw'/>

                              }
                            
                                
                                </Button>
                            <Form.Control.Feedback type='invalid'>
                                {errors.Currentpassword}
                            </Form.Control.Feedback>  
                           
                      </InputGroup>
                </Form.Group>


                <Form.Group className="mb-3"
                          value={values.Newpassword}
                          controlId='formGridpassword' 
                          onChange={handleChange}>
                <Form.Label>New Password</Form.Label>

                    <InputGroup>
                        <Form.Control
                            onChange={handleChange}
                            name='Newpassword' 
                            type={passwordType}
                            isInvalid = {!!errors.Newpassword}
                            placeholder="New Password"
                            aria-describedby="basic-addon"
                            required

                          />

                        <Button  style={{borderRadius:'5px'}}  id="button-addon" variant="outline-secondary" 
                            onClick={togglePassword}>
                            {passwordType==="password"? 
                            <FontAwesomeIcon icon={faEye} className='fa-fw'/> 
                            :<FontAwesomeIcon icon={faEyeSlash} className='fa-fw'/>

                            }

                        </Button>

                      <Form.Control.Feedback type='invalid'>
                            {errors.Newpassword}
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
                        name='Confirmpassword' 
                        type={passwordType}
                        isInvalid = {!!errors.Confirmpassword}
                        placeholder="Confirm Password"
                        aria-describedby="basic-addon"
                        required
                  />
                      <Button style={{borderRadius:'5px'}} id="button-addon" variant="outline-secondary" 
                        onClick={togglePassword}>
                        {passwordType==="password"? 
                        <FontAwesomeIcon icon={faEye} className='fa-fw'/> 
                        :<FontAwesomeIcon icon={faEyeSlash} className='fa-fw'/>

                          }
                      </Button>
             
              <Form.Control.Feedback type='invalid'>
                        {errors.Confirmpassword}
              </Form.Control.Feedback>  
                      
              </InputGroup>

              </Form.Group>
                      <div  className='d-grid gap-2'>
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