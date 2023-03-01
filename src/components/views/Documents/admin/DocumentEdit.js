// import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Form, 
    Row, 
    Col
} from 'react-bootstrap';
import{
    Link
} from 'react-router-dom';

function DocumentEdit() {
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     setData([
    //         {
    //             id: 1,
    //             description: 'Regional Director'
    //         },
    //         {
    //             id: 2,
    //             description: 'Chief Administrative Officer'
    //         },
    //         {
    //             id: 3,
    //             description: 'Secretary'
    //         },
    //         {
    //             id: 4,
    //             description: 'Assistant'
    //         },
    //     ]);
    // }, []);

    // VALIDATION ON ADDING RECORD
    // const [validated, setValidated] = useState(false);

    // const handleSubmit = event => {
    //     const form = event.currentTarget;
    //         if (form.checkValidity() === false) {
    //             event.preventDefault();
    //             event.stopPropagation();
    //         }
    //         setValidated(true);
    // };

    return (
        <div class="container fluid">
            <div className="crud bg-body rounded"> 
                <Row className= "justify-content-end mt-4 mb-3">
                    <h1>Edit Document</h1>
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
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                        aria-label='Default select example'>
                        <option value=''>Select Category...</option>    
                    </Form.Select>
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
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control type="file" placeholder="Attachment" />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5} type="text" placeholder="Description" />
                </Col>
            </Row>
            <div>
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col md="auto" className="p-0">
                        <Button 
                        variant="secondary"
                        as={Link}
                        to={'../'}>
                            Cancel
                        </Button>
                    </Col>
                    <Col md="auto">
                        <Button variant="primary">
                            Save 
                        </Button>
                    </Col>
                </Row>  
            </div>
        </div>
    );
}

export default DocumentEdit;