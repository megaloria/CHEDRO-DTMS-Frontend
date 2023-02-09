import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
// import pic from '../../assets/CHEDL.png'
import './/Changepassword.css'
import { useState } from 'react';
import Validator from 'validatorjs';



function Changepassword() {
  const [values, setValues] = useState({
          Currentpass:  '',
          Newpass:      '',
          Confirmpass:  ''
  });
    
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
          Currentpass:  'required',
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
            {/* <div className='logo'>
              <img src={pic} width='150' />
            </div> */}

            
          <Form.Group 
              className='mb-3' 
              value={values.Curentpassword}
              controlId='formGridpassword'
              onChange={handleChange}>

          <Form.Label>Current password</Form.Label>
          <Form.Control 
          type='password'
              placeholder='Current password'
              name='Currentpass' 
              isInvalid = {!!errors.Currentpass} />
              <Form.Control.Feedback type='invalid'>
              {errors.Currentpass}
          </Form.Control.Feedback>  
          </Form.Group>

         
         
<Form.Group 
              className='mb-3' 
              value={values.Newpass}
              controlId='formGridpassword'
              onChange={handleChange}>

          <Form.Label>New password</Form.Label>
          <Form.Control 
          type='password'
              placeholder='New Password'
              name='Newpass' 
              isInvalid = {!!errors.Newpass} />
              <Form.Control.Feedback type='invalid'>
              {errors.Newpass}
          </Form.Control.Feedback>  
          </Form.Group>

          
          <Form.Group 
              className='mb-3' 
              value={values.Confirmpass}
              controlId='formGridpassword'
              onChange={handleChange}>

          <Form.Label>Confirm password</Form.Label>
          <Form.Control 
          type='password'
              placeholder='Confirm password'
              name='Confirm password' 
              isInvalid = {!!errors.Confirmpass}/>
              <Form.Control.Feedback type='invalid'>
              {errors.Confirmpass}
          </Form.Control.Feedback>  
          </Form.Group>


            
              <div  className='d-grid gap-2'>
              <Button
                type='submit' 
                variant='dark'> save
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