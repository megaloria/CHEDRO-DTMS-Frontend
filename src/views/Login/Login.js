import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import pic from '../../assets/CHEDL.png'

import './loginform.css'



function loginform() {
  return (    
  
    <div style={{ height: '100vh', backgroundColor:'#0C2245'  }}>

    <Container style={{ height: '100%'}}>
      <Row style={{ height: '100%', alignItems: 'center'}}>
        <Col style={{margin:'auto'}}md={{ span: 4 }}>
        <Card className='p-3' style={{backgroundColor:'white',}}>
        <Card.Body>
      <div style={{ textAlign: 'center' }}>
        <img src={pic} width='190' />
      </div>

      <Form.Group  className="Email" controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control  placeholder="Username" required />
     </Form.Group>

      <Form.Group className="Pass" controlId="formGridPassword">
      <Form.Label>Password</Form.Label>
            <Form.Control pill type ='password' placeholder="Password" required />
      </Form.Group>
      <Form.Group className= "cb" id="formGridCheckbox">
            <Form.Check pill type="checkbox" label="Remember password" />
      </Form.Group>
      <br></br>
      <div  className="d-grid gap-2">
             <Button  variant="dark">Login Now</Button>
      </div>

      </Card.Body>
      </Card>
        </Col>
        

      </Row>
    </Container>
</div>
  );
}

export default loginform;