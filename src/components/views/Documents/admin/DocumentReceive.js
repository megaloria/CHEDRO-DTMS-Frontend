import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Button, 
    Form, 
    Row, 
    Col, 
    Breadcrumb
} from 'react-bootstrap';
// import './styles.css';

function DocumentReceive() {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setData([
            {
                id: 1,
                description: 'Regional Director'
            },
            {
                id: 2,
                description: 'Chief Administrative Officer'
            },
            {
                id: 3,
                description: 'Secretary'
            },
            {
                id: 4,
                description: 'Assistant'
            },
        ]);
    }, []);

    //VALIDATION ON ADDING RECORD
    const [validated, setValidated] = useState(false);

    const handleSubmit = event => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            setValidated(true);
    };

    return (
        <div class="container fluid">
            <div className="crud bg-body rounded"> 
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/home/documents">Documents</Breadcrumb.Item>
                            <Breadcrumb.Item href="#" active>Received</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
            </div>
            <Row className="mb-3">
                <Col>
                <Form.Label>Tracking No.</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Tracking Number" 
                    aria-label="Tracking Number"
                    disabled
                    readOnly
                    />
                </Col>
                <Col>
                    <Form.Label>Document Type</Form.Label>
                    <Form.Select 
                        aria-label='Default select example'>
                        <option value=''>Select Document Type...</option>    
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Label>Attachment (Optional)</Form.Label>
                    <Form.Control type="file" placeholder="Attachment" />
                </Col>

               
                
            </Row>
 
                <Row className="mb-3">
                <Col>
                    <Form.Label>Date Received</Form.Label>
                    <Form.Control type="date" placeholder="Date Received" />
                </Col>
                
                <Col>
                    <Form.Label>Receive from</Form.Label>
                    <Form.Select 
                     aria-label='Default select example'>
                    <option value=''> Receive From...</option>
                    </Form.Select>
                </Col>

                <Col> 
                </Col>
            </Row>

            <Row className="mb-3">
            <Row>
            <Col>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5} type="text" placeholder="Description" />
                </Col>
            </Row>
            </Row>
            <Row className="mb-3">
                
                <Row>
                     <Col>
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                        name='category'
                        value={''}
                        onChange={''}
                        isInvalid={''}
                        aria-label='Default select example'>
                            <option value=''>Select Category...</option>  
                                {
                                    categories.map(categories => (
                                        <option key={categories.id} value={categories.id}> {categories.description} </option>
                                    ))
                                }  
                    </Form.Select>
                </Col> 
                </Row>
            </Row>
            <div>
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col md="auto" className="p-0">
                        <Button 
                        variant="secondary"
                        href="/home/documents">
                            Cancel
                        </Button>
                    </Col>
                    <Col md="auto">
                        <Button variant="primary">
                            Send 
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default DocumentReceive;