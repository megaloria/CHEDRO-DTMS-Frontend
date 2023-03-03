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
    const [selectedOption, setSelectedOption] = useState('');
    const [provinces, setProvinces] = useState([]);

    const handleChange = async (event) => {
        const value = event.target.value;
        setSelectedOption(value);
    
        if (value === 'HEIs') {
          const response = await apiClient.get('/settings/heis/provinces');
          setProvinces(response.data.data);
        } else if (value === 'NGAs') {
          // Fetch data for NGAs
        } else if (value === 'Ched Offices') {
          // Fetch data for Ched Offices
        }
      };

    //Document Types
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
        <div className="container fluid">
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
                    <Form.Select value={selectedOption} onChange={handleChange}>
                        <option value="">Select an option</option>
                        <option value="HEIs">HEIs</option>
                        <option value="NGAs">NGAs</option>
                        <option value="Ched Offices">Ched Offices</option>
                    </Form.Select>
                    {(selectedOption === 'HEIs' && provinces.length !== 0) &&  (
                        <Form.Select>
                        <option value="">Select a province</option>
                        {provinces.map((province) => (
                            <option key={province.province} value={province.province}>
                            {province.province}
                            </option>
                        ))}
                        </Form.Select>
                    )}
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
                    {category.map((category, index) => (
                        <div key={index} className="mb-3">
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