import { useState } from 'react';
import Validator from 'validatorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  {
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import 
{
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  InputGroup
} from 'react-bootstrap';

import './styles.css';


function Changepassword() {

  const [values, setValues] = useState({
          Currentpass:  '',
          Newpass:      '',
          Confirmpass:  '',
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
///end of eye ivon function
    
    const [errors, setError] = useState({

          Currentpass:  '',
          Newpass:      '',
          Confirmpass:  '',
     
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
          Currentpass:  'present',
          Newpass:      'required|same:Confirmpass|min:8',
          Confirmpass:  'required|same:Newpass|min:8'
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

              <Card className='p-3' style={{borderRadius:'25px', width:'70vh'}}>
                  <Card.Body>
                          
                <Form.Group className="mb-3"
                        value={values.Currentpass}
                        controlId='formGridpassword' 
                        onChange={handleChange}>
                          
                <Form.Label>Current Password</Form.Label>

                      <InputGroup>
                          <Form.Control
                              onChange={handleChange}
                              name='Newpass' 
                              type={passwordType}
                              isInvalid = {!!errors.Currentpass}
                              placeholder="Current password"
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