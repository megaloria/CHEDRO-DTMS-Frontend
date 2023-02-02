import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';




function loginform() {
  return (
    
    <Container fluid="md" style={{ height: '100vh' }}>

        <Card body style={{ marginTop: 'auto'}}>
      <Row>

        <Col>
        <Form.Group className="mb-2" controlId="formGridEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control placeholder="Username" />
      </Form.Group>

      <Form.Group className="mb-2" controlId="formGridPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
      </Col>


        <Col></Col>
      </Row>

      </Card>


    </Container>

  );
}

export default loginform;