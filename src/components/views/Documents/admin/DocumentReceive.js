import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Form, 
    Row, 
    Col, 
    Breadcrumb
} from 'react-bootstrap';
import {
    Link
} from 'react-router-dom';
import apiClient from '../../../../helpers/apiClient';
// import './styles.css';

function DocumentReceive() {
    const [documentTypes, setDocumentTypes] = useState([]);

    useEffect(() => {
        apiClient.get('/settings/all-document-types')
            .then(response => {
                setDocumentTypes(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //Category
    const [category, setCategory] = useState([]);

    useEffect(() => {
        apiClient.get('/settings/categories')
            .then(response => {
                setCategory(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div class="container fluid">
            <div className="crud bg-body rounded"> 
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item linkAs={Link} linkProps={{  to: '../' }}>Documents</Breadcrumb.Item>
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
                        {documentTypes.map(item => (
                            <option key={item.id} value={item.id}>{item.description}</option>
                        ))}    
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
            </Row>

            <Row className="mb-3">
            <Col>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5} type="text" placeholder="Description" />
                </Col>
            </Row>
            <Row className="mb-3"> 
            <Form.Group>
                <Form.Label>Category</Form.Label>
                    {category.map(category => (
                        <div key={`inline-${category}`} className="mb-3">
                            <Form.Check
                                inline
                                name='category'
                                type='radio'
                                id={`inline-${category}-1`}
                                value={category.id}
                                key={category.id}
                            />      
                            {category.description}
                        </div>
                    ))}
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
                        <Button variant="outline-primary">
                            Received
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default DocumentReceive;