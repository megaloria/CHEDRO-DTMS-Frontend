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
import Validator from 'validatorjs';
import Swal from 'sweetalert2';

function DocumentReceive() {
    const [NGAs, setNGAs] = useState([]);
    const [users, setUsers] = useState([]);
    const [ChedOffices, setChedOffices] = useState([]);
    // const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [selectedOption3, setSelectedOption3] = useState('');
    const [selectedOption4, setSelectedOption4] = useState('');
    const [selectedOption5, setSelectedOption5] = useState('');
    // const [selectedOption6, setSelectedOption6] = useState('');
    // const [selectedValue, setSelectedValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [category, setCategory] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [names, setNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [isOptionLoading, setIsOptionLoading] = useState(false); 
    const [isOptionLoading1, setIsOptionLoading1] = useState(false); 

    //Add Receive documents
    const [documentTypes, setDocumentTypes] = useState([]);
    const [data, setData] = useState([]); //data variable

    const [formInputs, setFormInputs] = useState ({
        document_type_id: '',
        attachment: '',
        date_received: '',
        receivable_table: '',
        receivable_id: '',
        province: '',
        municipality: '',
        insti: '',
        ngas: '',
        chedoffices: '',
        description: '',
        category_id: '',
        assignTo: ''
    });

    const[formErrors, setFormErrors] = useState ({
        document_type_id: '',
        attachment: '',
        date_received: '',
        receivable_table: '',
        receivable_id: '',
        province: '',
        municipality: '',
        insti: '',
        ngas: '',
        chedoffices: '',
        description: '',
        category_id: '',
        assignTo: ''
    });

    useEffect(() => {
        apiClient.get('/document').then(response => { //GET ALL function
            setData(response.data.data);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            document_type_id: 'required|integer|min:1',
            attachment: 'file',
            date_received: 'date',
            receivable_table: 'required|in:HEIs,NGAs,Ched Offices,Others',
            receivable_id: 'integer|min:1',
            // receivable_name: '',
            province: 'integer|min:1',
            municipality: 'integer|min:1',
            insti: 'integer|min:1',
            ngas: 'integer|min:1',
            chedoffices: 'integer|min:1',
            description: 'required|string|min:5',
            category_id: 'required|integer|min:1',
            assignTo: 'required|integer|min:1'
        });

        if (validation.fails()){
            setFormErrors({
                document_type_id: validation.errors.first('document_type_id'),
                attachment: validation.errors.first('attachment'),
                date_received: validation.errors.first('date_received'),
                province: validation.errors.first('province'),
                municipality: validation.errors.first('municipality'),
                insti: validation.errors.first('insti'),
                ngas: validation.errors.first('ngas'),
                chedoffices: validation.errors.first('chedoffices'),
                description: validation.errors.first('description'),
                category_id: validation.errors.first('category_id'),
                assignTo: validation.errors.first('assignTo')
            });
            return;
        } else {
            setFormErrors({
                document_type_id: '',
                attachment: '',
                date_received: '',
                receivable_table: '',
                receivable_id: '',
                province: '',
                municipality: '',
                insti: '',
                ngas: '',
                chedoffices: '',
                description: '',
                category_id: '',
                assignTo: ''
            });
        }
        handleAdd();
    };

    const handleAdd = () => {
        apiClient.post('/document', {
            ...formInputs,
        }).then(response => {
            setData({
                ...data,
                data: [
                    ...data.data,
                    response.data.data
                ]
            });
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
        }).catch(error => {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        });
    }

    const handleInputChange = e => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    }

//display document-type code
const [trackingNo, setTrackingNo] = useState('');
const handleChangeDocType = async (event) => {
    setIsOptionLoading1(true);
    const value = event.target.value;
    setFormInputs({
        ...formInputs,
        document_type_id:value,
    });
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

    const handleChange = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                receivable_table:value,
            });
            
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
            setFormInputs({
                ...formInputs,
                province:value,
            }); 
            // console.log(value);
            // setSelectedValue(value);
            {
                const response = await apiClient.get('/settings/heis/municipalities');
                setMunicipalities(response.data.data);
            } 
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
        
      };

      const handleChange3 = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                municipality:value,
            }); 
            // console.log(value);
            // setSelectedValue(value);
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

      const handleChange4 = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                ngas:value,
            });
            // console.log(value);
            // setSelectedValue(value);
        {
          const response = await apiClient.get('/settings/ngas/all');
          setNames(response.data.data);
        }   
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
      }

      const handleChange5 = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                chedoffices:value,
            });
            // console.log(value);
            // setSelectedValue(value);
        {
          const response = await apiClient.get('/settings/ched-offices/all');
          setNames(response.data.data);
        }   
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
      }

    //   const handleChange4 = async (event) => {
    //         const value = event.target.value;
    //         setSelectedOption4(value);
    //         console.log(value);
    //       setSelectedValue(value);
    // };

    // const handleChange5 = async (event) => {
    //     const value = event.target.value;
    //     setSelectedOption5(value);
    //     console.log(value);
    //     setSelectedValue(value);
    // };

    // const handleChange6 = async (event) => {
    //     const value = event.target.value;
    //     setSelectedOption6(value);
    //     console.log(value);
    //     setSelectedValue(value);
    // };

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
    <Form onSubmit={handleSubmit}>
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
                    <Form.Select
                        name='document_type_id' 
                        value={formInputs.document_type_id} 
                        onChange={handleChangeDocType}
                        isInvalid={!!formErrors.document_type_id}
                        disabled={isOptionLoading1}>
                            <option hidden value=''>Select Document Type...</option>
                            {documentTypes.map(item => (
                                <option key={item.id} value={item.id}>{item.description}</option>
                            ))
                            }
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.document_type_id}
                    </Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label>Tracking No. {isOptionLoading1 ? <FontAwesomeIcon icon={faSpinner} spin lg /> : ""}</Form.Label>
                        <Form.Control 
                            type='text'
                            name='trackingNo'
                            placeholder='Tracking Number'
                            value={trackingNo}
                            isInvalid={!!formErrors.trackingNo}
                            disabled
                        />
                </Col>
                <Col>
                    <Form.Label>Attachment (Optional)</Form.Label>
                    <Form.Control 
                        type="file" 
                        name='attachment' 
                        placeholder="Attachment" 
                        onChange={handleInputChange}
                        value={formInputs.attachment} 
                        isInvalid={!!formErrors.attachment}/>
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.attachment}
                    </Form.Control.Feedback>
                </Col>
            </Row>
 
            <Row className="mb-3">
                <Col>
                    <Form.Label>Date Received</Form.Label>
                    <Form.Control
                        type="date" 
                        name='date_received'
                        max={moment().format("YYYY-MM-DD")}
                        defaultValue={moment().format("YYYY-MM-DD")}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.date_received}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.date_received}
                    </Form.Control.Feedback>
                </Col>
                
                <Col>
                    <Form.Label>Receive from {isOptionLoading ? <FontAwesomeIcon icon={faSpinner} spin lg /> : ""} </Form.Label>
                    <Form.Select 
                        name='receivable_table' 
                        value={formInputs.receivable_table} 
                        onChange={handleChange}
                        isInvalid={!!formErrors.receivable_table}
                        disabled={isOptionLoading}>
                            <option hidden value="">Select an option</option>
                            <option value="HEIs">HEIs</option>
                            <option value="NGAs">NGAs</option>
                            <option value="CHED Offices">CHED Offices</option>
                            <option value="Others">Others</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.receivable_table}
                    </Form.Control.Feedback>

                    {(formInputs.receivable_table === 'HEIs' && provinces.length !== 0) &&  (
                        <Form.Select 
                            name= 'province' 
                            value={formInputs.province}
                            onChange={handleChange2} 
                            isInvalid={!!formErrors.province}
                            disabled={isOptionLoading}
                            >
                            <option hidden value="">Select a province</option>
                            {provinces.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.province}
                                </option>
                            ))}
                        </Form.Select>
                    )}

                    {(formInputs.receivable_table === 'HEIs' && selectedOption2 !== '' && municipalities.length !== 0) &&  (
                        <Form.Select 
                            name='municipality' 
                            value={formInputs.municipality} 
                            onChange={handleChange3}  
                            isInvalid={!!formErrors.municipality}
                            disabled={isOptionLoading}
                            >
                            <option hidden value="">Select a municipality</option>
                            {municipalities.map((municipality) => (
                                <option key={municipality.city_municipality} value={municipality.id}>
                                {municipality.city_municipality}
                                </option>
                            ))}
                        </Form.Select>
                    )}

                    {(formInputs.receivable_table === 'HEIs' && selectedOption3 !== '' && names.length !== 0) &&  (
                        <Form.Select 
                        name= 'insti' 
                        value={formInputs.insti}
                        isInvalid={!!formErrors.insti}
                        disabled={isOptionLoading} 
                        >
                            <option hidden value="">Select a name of institution</option>
                            {names.map((names) => (
                                <option key={names.name} value={names.id}>
                                {names.name}
                                </option>
                            ))}
                        </Form.Select>
                    )}
                    {(formInputs.receivable_table === 'NGAs' && NGAs.length !==0) &&  (
                        <Form.Select 
                            name='ngas' 
                            value={formInputs.ngas} 
                            onChange={handleChange4} 
                            isInvalid={!!formErrors.ngas}
                            disabled={isOptionLoading}
                            >
                                <option hidden value=''>Select NGA...</option>
                            {NGAs.map(item => (
                                <option key={item.id} value={item.id}>{item.code} - {item.description}</option>
                            ))}  
                        </Form.Select>
                    )}
                    {(formInputs.receivable_table === 'CHED Offices' && ChedOffices.length !== 0) && (
                            <Form.Select 
                            name='chedoffices'
                            value={formInputs.chedoffices} 
                            onChange={handleChange5} 
                            isInvalid={!!formErrors.chedoffices}
                            disabled={isOptionLoading} 
                            >
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
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        type="text" 
                        name='description' 
                        placeholder="Description" 
                        value={formInputs.description}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.description}/>
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.description}
                    </Form.Control.Feedback>
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
                                style={{ display: 'inline-block', marginRight: '20px' }}
                                key={index}
                                className="mb-3" >
                                <Form.Check
                                    inline
                                    name='category_id'
                                    type='radio'
                                    id={`inline-${category.id}-1`}
                                    value={category.id}
                                    key={category.id}
                                    onChange={() => setSelectedCategory(category)}
                                    style={{ marginRight:'8px' }}
                                    // isInvalid={!!formErrors.category_id}
                                />
                                {category.description}
                                {/* <Form.Control.Feedback type='invalid'>
                                    {formErrors.category_id}
                                </Form.Control.Feedback> */}
                            </div>
                        ))}
                        
                        {/* Conditional rendering */}
                       
                        {selectedCategory && (
                            <div style={{ marginTop: '10px' }}>
                                {selectedCategory.is_assignable &&(
                                    <Row> 
                                        <Col md={'auto'}> 
                                        <Form.Label>Select assign to:</Form.Label>
                                        <Form.Select 
                                            name='assignTo' >
                                        <option hidden value=''>Select assign to...</option>
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
            
                <Row className= "justify-content-end mt-4 mb-4">
                    <Col md="auto" className="p-0 me-2">
                        <Button 
                        variant="outline-danger"
                        as={Link}
                        to='../'>
                            Cancel
                        </Button>
                    </Col>
                    
                    <Col md="auto" className="p-0 me-2">
                        <Button variant="outline-primary">
                            Forward
                        </Button>
                    </Col>
                    <Col md="auto" className="p-0">
                        <Button type='submit' variant="primary">
                            Received
                        </Button>
                    </Col>
                </Row>
        </div>
    </Form>
    );
}

export default DocumentReceive;