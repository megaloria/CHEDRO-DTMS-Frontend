import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import pic from '../../assets/CHEDL.png'
import './Loginform.css'
import { useState } from 'react';
import Validator from 'validatorjs';



function Loginform() {
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
          username: 'required|min:3',
          password: 'required|min:8'
        });

        if (validation.fails()) {
          setError({
            username: validation.errors.first('username'),
            password: validation.errors.first('password'),
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
            <div className='logo'>
              <img src={pic} width='150' />
            </div>

              <Form.Group className="mb-3"  value={values.username} name="username" controlId="formGridEmail" onChange={handleChange}>
                    <Form.Label> Username</Form.Label>
                    <Form.Control  placeholder="Username" />
                    {
                      errors.username && (
                        <p style={{color:'red', fontSize:'13px' }}> {errors.username}</p>
                      )
                    }
              </Form.Group>

              <Form.Group className="mb-3" value={values.password} name="password" controlId="formGridPassword" onChange={handleChange} >
                    <Form.Label>Password</Form.Label>
                    <Form.Control pill type='password' placeholder="Password" />
                    {
                      errors.password && (
                        <p style={{color:'red', fontSize:'13px' }}> {errors.password}</p>
                      )
                    }
              </Form.Group>
              <Form.Group className= "mb-3" id="formGridCheckbox">
                    <Form.Check pill type="checkbox" label="Remember password"/>
              </Form.Group>
              <div  className="d-grid gap-2">
                     <Button type='submit' variant="primary">Login</Button>
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

export default Loginform;