import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Form, 
    Row, 
    Col, 
    Breadcrumb,
    Alert
} from 'react-bootstrap';
import {
    Link
} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import apiClient from '../../../../helpers/apiClient';

function DocumentReceive() {
    const [documentTypes, setDocumentTypes] = useState([]);
    const [NGAs, setNGAs] = useState([]);
    const [users, setUsers] = useState([]);
    const [ChedOffices, setChedOffices] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [selectedOption3, setSelectedOption3] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [category, setCategory] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [names, setNames] = useState([]);
    const [trackingNo, setTrackingNo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [isOptionLoading, setIsOptionLoading] = useState(false); 
    const [isOptionLoading1, setIsOptionLoading1] = useState(false); 

    const handleChange = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setSelectedOption(value);

            if (value === 'HEIs') {
                const response = await apiClient.get('/settings/heis/provinces');
                setProvinces(response.data.data);
                // Fetch data for HEIs
            } else if (value === 'NGAs') {
                const response = await apiClient.get('/settings/ngas/all');
                setNGAs(response.data.data);
                // Fetch data for NGAs
            } else if (value === 'CHED Offices') {
                const response = await apiClient.get('/settings/ched-offices/all');
                setChedOffices(response.data.data);
                // Fetch data for Ched Offices
            }
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
    };
        

      const handleChange2 = async (event) => {
        try{
            setIsOptionLoading(true);
            const value = event.target.value;
            setSelectedOption2(value);
            {
                const response = await apiClient.get('/settings/heis/municipalities');
                setMunicipalities(response.data.data);
            } 
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
        
      }

      const handleChange3 = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setSelectedOption3(value); 
        {
          const response = await apiClient.get('/settings/heis/names');
          setNames(response.data.data);
        }   
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
      }

    useEffect(() => {
        apiClient.get('/document/receive')
            .then(response => {
                setUsers(response.data.data.users);
                setDocumentTypes(response.data.data.documentTypes);
                setCategory(response.data.data.categories);
            })
            .catch(error => {
                setErrorMessage(error);
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    //display document-type code
    const [selectedOptionDocType, setSelectedOptionDocType] = useState('');
    
    const handleChangeDocType = async (event) => {
        setIsOptionLoading1(true);
        const value = event.target.value;
        setSelectedOptionDocType(value);
        let docType = documentTypes.find(d => d.id === +value)
        let temp = docType ? docType.code : ''

        apiClient.get(`/document/series/${value}`)
            .then(response => {
                setTrackingNo (temp + '-' + response.data.data.toString().padStart(4, '0'));
            })
            .catch(error => {
                setErrorMessage(error);
            }).finally(() => {
                setIsOptionLoading1(false);
            });
        }

    if (isLoading) {
        return (
            <FontAwesomeIcon icon={faSpinner} spin lg />
        );
    }

    if (errorMessage) {
        return (
            <Alert variant='danger'>
                {errorMessage}
            </Alert>
        );
    }

    return (
        <div className="container fluid">
            <div className="crud bg-body rounded"> 
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '../' }}>Documents</Breadcrumb.Item>
                            <Breadcrumb.Item href="#" active>Received</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
            </div>
            <Row className="mb-3">
                <Col>
                    <Form.Label>Document Type </Form.Label>
                    <Form.Select value={selectedOptionDocType} onChange={handleChangeDocType}>
                        <option hidden value=''>Select Document Type...</option>
                            {documentTypes.map(item => (
                                <option key={item.id} value={item.id}>{item.description}</option>
                            ))}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Label>Tracking No. {isOptionLoading1 ? <FontAwesomeIcon icon={faSpinner} spin lg /> : ""}</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Tracking Number'
                            value={trackingNo}
                            disabled
                        />
                </Col>
                <Col>
                    <Form.Label>Attachment (Optional)</Form.Label>
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
                    <Form.Label>Receive from {isOptionLoading ? <FontAwesomeIcon icon={faSpinner} spin lg /> : ""} </Form.Label>
                    <Form.Select value={selectedOption} onChange={handleChange}>
                        <option hidden value="">Select an option</option>
                        <option value="HEIs">HEIs</option>
                        <option value="NGAs">NGAs</option>
                        <option value="CHED Offices">CHED Offices</option>
                    </Form.Select>

                    {(selectedOption === 'HEIs' && provinces.length !== 0) &&  (
                        <Form.Select value={selectedOption2} onChange={handleChange2}>
                        <option hidden value="">Select a province</option>
                        {provinces.map((province) => (
                            <option key={province.province} value={province.province}>
                                {province.province}
                            </option>
                        ))}
                        </Form.Select>
                    )}

                    {(selectedOption === 'HEIs' && selectedOption2 !== '' && municipalities.length !== 0) &&  (
                        <Form.Select value={selectedOption3} onChange={handleChange3}>
                        <option hidden value="">Select a municipality</option>
                        {municipalities.map((municipality) => (
                            <option key={municipality.city_municipality} value={municipality.city_municipality}>
                            {municipality.city_municipality}
                            </option>
                        ))}
                        </Form.Select>
                    )}

                    {(selectedOption === 'HEIs' && selectedOption3 !== '' && names.length !== 0) &&  (
                        <Form.Select>
                        <option hidden value="">Select a name of institution</option>
                        {names.map((names) => (
                            <option key={names.name} value={names.name}>
                            {names.name}
                            </option>
                        ))}
                        </Form.Select>
                    )}
                    {(selectedOption === 'NGAs' && NGAs.length !==0) &&  (
                        <Form.Select
                        aria-label='Default select example'>
                        <option hidden value=''>Select NGA...</option>
                        {NGAs.map(item => (
                            <option key={item.id} value={item.id}>{item.code} - {item.description}</option>
                        ))}  
                        </Form.Select>
                    )}
                    {(selectedOption === 'CHED Offices' && ChedOffices.length !== 0) && (
                        <Form.Select
                            aria-label='Default select example'>
                            <option hidden value=''>Select Ched Office...</option>
                            {ChedOffices.map(item => (
                                <option key={item.id} value={item.id}>{item.code} - {item.description}</option>
                            ))}
                        </Form.Select>
                    )}
                </Col>
            </Row>

            <Row className="mb-3">
            <Col>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} type="text" placeholder="Description" />
                </Col>
            </Row>
            <Row className="mb-3"> 
            <Form.Group>
                <div> 
                        <Form.Label>Category </Form.Label>
                </div>
                    <div>
                        
                        {category.map((category, index) => (
                            <div
                                style={{ display: 'inline-block', marginRight: '10px' }}
                                key={index}
                                className="mb-3" >
                                <Form.Check
                                    inline
                                    name='category'
                                    type='radio'
                                    id={`inline-${category.id}-1`}
                                    value={category.id}
                                    key={category.id}
                                    onChange={() => setSelectedCategory(category)}
                                />
                                {category.description}
                                
                            </div>
                        ))}
                        
                        {/* Conditional rendering */}
                       
                        {selectedCategory && (
                            <div style={{ marginTop: '10px' }}>
                                {selectedCategory.is_assignable &&(
                                    <Row> 
                                        <Col md={'auto'}> 
                                        <Form.Label>Select assign to:</Form.Label>
                                        <Form.Select>
                                                {users.map(user => (
                                                     <option key={user.id} value={user.id}>
                                                        {` ${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`}
                                            </option>
                                        ))}
                                               
                                        </Form.Select>
                                    </Col>
                                    </Row>
                                )}
                            </div>
                        )}
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