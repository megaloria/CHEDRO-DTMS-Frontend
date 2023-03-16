// import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Form, 
    Row, 
    Col
} from 'react-bootstrap';
import {
    Link
} from 'react-router-dom';
import moment from 'moment';

function DocumentEdit() {
    
    return (
        <div class="container fluid">
            <div className="crud bg-body rounded"> 
                <Row className= "justify-content-end mt-4 mb-3">
                    <h1>Edit Document</h1>
                </Row>
            </div>
            <Row className="mb-3">
                 <Col>
                <Form.Label>Document Type</Form.Label>
                    <Form.Select 
                        aria-label='Default select example'>
                        <option value=''>Select Document Type...</option>    
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Label>Tracking No.</Form.Label>
                    <Form.Control 
                    type='text'
                    placeholder='Tracking Number'
                    value=''
                    disabled
                    />
                </Col>
                <Col>
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control type="file" placeholder="Attachment" />
                </Col>
            </Row>
            
            <Row className="mb-3">
                <Col>
                    <Form.Label>Date Received</Form.Label>
                    <Form.Control 
                    type="date" 
                    max={moment().format("YYYY-MM-DD")}
                    defaultValue={moment().format("YYYY-MM-DD")}
                    />
                </Col>
                
                <Col>
                <Form.Label>Receive from</Form.Label>
                    <Form.Select >
                    <option hidden value=""> Select an option</option>
                    <option value="HEIs">HEIs</option>
                    <option value="NGAs">NGAs</option>
                    <option value="CHED Offices">CHED Offices</option>
                    </Form.Select>
                </Col>  
            </Row>

            <Row className="mb-3">
                <Col>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5} type="text" placeholder="Description" />
                </Col>
            </Row>

            <Row className="mb-3"> 
            <Form.Group>
                <div> 
                <Form.Label>Category</Form.Label>
                </div>
                </Form.Group>
                </Row>

            <div>
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col md="auto" className="p-0">
                        <Button 
                        variant="secondary"
                        as={Link}
                        to='../'>
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