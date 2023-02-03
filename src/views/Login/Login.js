import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import './loginform.css';
//import Image from 'react-bootstrap/Image'



function loginform() {
  return (
    <div>

      <div className='con1'>
      <Container fluid="md" style={{ height: '50vh', width: '29rem'}}>
      <Card className='loginform' body style={{ marginTop: 'auto'}}>
          <Form.Group className="mb-2" controlId="formGridEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Username" />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control placeholder="Password" />
        </Form.Group>
            <Form.Group className="mb-3" id="formGridCheckbox">
            <Form.Check type="checkbox" label="Remember password" />
            </Form.Group>

            <Form.Group className="mb-3" id="formGridCheckbox">
              <div className="d-grid gap-2">
              <Button variant="primary" size="lg">Login Now</Button>
              </div>
        </Form.Group>
        </Card>
      </Container>
      </div>
    </div>

    
    
  );
  
}

export default loginform;