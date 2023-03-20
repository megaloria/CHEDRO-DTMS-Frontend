import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Form, 
    Row, 
    Col,
    Alert,
    Breadcrumb
} from 'react-bootstrap';
import {
    Link, useLoaderData, useNavigate
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import apiClient from '../../../../helpers/apiClient';
import Validator from 'validatorjs';
import Swal from 'sweetalert2';
import Select from 'react-select';

function DocumentEdit() {
    const document = useLoaderData();

    const navigate = useNavigate();

    const [NGAs, setNGAs] = useState([]);
    const [users, setUsers] = useState([]);
    const [ChedOffices, setChedOffices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [names, setNames] = useState([]);
    const [trackingNo, setTrackingNo] = useState(document.tracking_no);
    const [docType, setDocType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isOptionLoading, setIsOptionLoading] = useState(false);
    const [isOptionLoading1, setIsOptionLoading1] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [dateReceived, setDateReceived] = useState(moment().format('YYYY-MM-DD'));

    const [documentTypes, setDocumentTypes] = useState([]);

    const [formInputs, setFormInputs] = useState({
        document_type_id: document.document_type_id,
        attachment: document.attachment,
        date_received: document.date_received,
        receivable_type: document.sender.receivable_type === 'App\\Models\\Nga' ? 'NGAs' :
            document.sender.receivable_type === 'App\\Models\\ChedOffice' ? 'CHED Offices' :
                document.sender.receivable_type,
        receivable_id: document.sender.receivable_id,
        receivable_name: document.sender.receivable_name,
        province: document.sender.receivable.province,
        municipality: document.sender.receivable.city_municipality,
        insti: document.sender.receivable.description,
        ngas: document.sender.receivable.description,
        chedoffices: document.sender.receivable.description,
        description: document.description,
        category_id: document.category_id,
        assignTo: ''
    });

    console.log(formInputs.receivable_type);

    const [formErrors, setFormErrors] = useState({
        document_type_id: '',
        attachment: '',
        date_received: '',
        receivable_type: '',
        receivable_id: '',
        receivable_name: '',
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
    if (formInputs.receivable_type === 'NGAs') {
      setIsOptionLoading(true);
      apiClient.get('/settings/ngas/all')
        .then(response => {
          setNGAs(response.data.data);
        })
        .catch(error => {
          setErrorMessage(error);
        })
        .finally(() => {
          setIsOptionLoading(false);
        });
    }
       else if (formInputs.receivable_type === 'CHED Offices') {
             setIsOptionLoading(true);
             apiClient.get('/settings/ched-offices/all')
                 .then(response => {
                     setChedOffices(response.data.data);
                 })
                 .catch(error => {
                     setErrorMessage(error);
                 })
                 .finally(() => {
                     setIsOptionLoading(false);
                 });
         }
    }, []);

    //For assigning multiple users 
    //yarn add react-select
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
    };

    const options = users.map(user => ({
        value: user.id,
        label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
    }));

    const handleInputChange = e => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'date_received') {
            setDateReceived(e.target.value)
        } else if (e.target.name === 'category_id') {
            setSelectedCategory(categories.find(c => c.id === +e.target.value));
        }
    }

    useEffect(() => {
        if (docType) {
            setIsOptionLoading1(true);
            let docTypeFind = documentTypes.find(d => d.id === +docType);
            let temp = docTypeFind ? docTypeFind.code : '';
            apiClient.get(`/document/series/${docType}`)
                .then(response => {
                    setTrackingNo(moment(dateReceived).format('YY') + '-' + temp + '-' + response.data.data.toString().padStart(4, '0'));
                })
                .catch(error => {
                    setErrorMessage(error);
                }).finally(() => {
                    setIsOptionLoading1(false);
                });
        }
    }, [docType, documentTypes, dateReceived])

    const handleChangeDocType = async (event) => {
        const value = event.target.value;
        setFormInputs({
            ...formInputs,
            document_type_id: value,
        });
        setDocType(value)
    }

    const handleChange = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                receivable_type: value,
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


    const handleChangeProvince = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                province: value,
            });
            const response = await apiClient.get(`/settings/heis/municipalities/${value}`);
            setMunicipalities(response.data.data);
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
    };

    const handleChangeMunicipality = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                municipality: value,
            });
            const response = await apiClient.get(`/settings/heis/names/${value}`);
            setNames(response.data.data);
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
    }

    const handleChangeInstitution = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                insti: value,
            });
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
    }

    const handleChangeNGA = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                ngas: value,
            });
            const response = await apiClient.get('/settings/ngas/all');
            setNames(response.data.data);
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsOptionLoading(false);
        }
    }

    const handleChangeCO = async (event) => {
        try {
            setIsOptionLoading(true);
            const value = event.target.value;
            setFormInputs({
                ...formInputs,
                chedoffices: value,
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

    const handleFileInputChange = e => {
        if (e.target.files.length > 0) {
            setAttachment(e.target.files[0]);
        } else {
            setAttachment(null);
        }
    }

    useEffect(() => {
        apiClient.get('/document/receive')
            .then(response => {
                setUsers(response.data.data.users);
                setDocumentTypes(response.data.data.documentTypes);
                setCategories(response.data.data.categories);
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
        <Form>
            <div className="container fluid">
                <div className="crud bg-body rounded">
                    <Row className="justify-content-end mt-4 mb-3">
                        <Col>
                            <Breadcrumb>
                                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '../' }}>Documents</Breadcrumb.Item>
                                <Breadcrumb.Item href="#" active>Edit</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                </div>
            <Row className="mb-3">
                 <Col>
                <Form.Label>Document Type</Form.Label>
                        <Form.Select
                            name='document_type_id'
                            value={formInputs.document_type_id}
                            onChange={handleChangeDocType}
                            isInvalid={!!formErrors.document_type_id}
                            disabled={isOptionLoading1}>
                            <option hidden value=''>Select Document Type...</option>
                            {
                                documentTypes.map(item => (
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
                        <Form.Label>Attachment <span className='text-muted text-italic'>(Optional)</span></Form.Label>
                    <Form.Control 
                            type="file"
                            name='attachment'
                            placeholder="Attachment"
                            onChange={handleFileInputChange} />
                </Col>
            </Row>
            
            <Row className="mb-3">
                <Col>
                    <Form.Label>Date Received</Form.Label>
                    <Form.Control 
                            type='date'
                            name='date_received'
                            max={moment().format("YYYY-MM-DD")}
                            value={formInputs.date_received}
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
                            name='receivable_type'
                            value={formInputs.receivable_type}
                            onChange={handleChange}
                            isInvalid={!!formErrors.receivable_type}
                            disabled={isOptionLoading}>
                            <option hidden value="">Select an option</option>
                            <option value="HEIs">HEIs</option>
                            <option value="NGAs">NGAs</option>
                            <option value="CHED Offices">CHED Offices</option>
                            <option value="Others">Others</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.receivable_type}
                    </Form.Control.Feedback>

                        {
                            (formInputs.receivable_type === 'HEIs' && provinces.length !== 0) && (
                                <Form.Select
                                    name='province'
                                    value={formInputs.province}
                                    onChange={handleChangeProvince}
                                    isInvalid={!!formErrors.province}
                                    disabled={isOptionLoading}
                                >
                                    <option hidden value="">Select a province</option>
                                    {
                                        provinces.map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.province}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            )
                        }

                        {
                            (formInputs.receivable_type === 'HEIs' && formInputs.province !== '' && municipalities.length !== 0) && (
                                <Form.Select
                                    name='municipality'
                                    value={formInputs.municipality}
                                    onChange={handleChangeMunicipality}
                                    isInvalid={!!formErrors.municipality}
                                    disabled={isOptionLoading}
                                >
                                    <option hidden value="">Select a municipality</option>
                                    {
                                        municipalities.map((municipality) => (
                                            <option key={municipality.city_municipality} value={municipality.id}>
                                                {municipality.city_municipality}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            )
                        }

                        {
                            (formInputs.receivable_type === 'HEIs' && formInputs.municipality !== '' && names.length !== 0) && (
                                <Form.Select
                                    name='insti'
                                    value={formInputs.insti}
                                    onChange={handleChangeInstitution}
                                    isInvalid={!!formErrors.insti}
                                    disabled={isOptionLoading}
                                >
                                    <option hidden value="">Select a name of institution</option>
                                    {
                                        names.map((names) => (
                                            <option key={names.name} value={names.id}>
                                                {names.name}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            )
                        }
                        {
                            (formInputs.receivable_type === 'NGAs' && NGAs.length !== 0) && (
                                <Form.Select
                                    name='ngas'
                                    value={formInputs.receivable_id}
                                    onChange={handleChangeNGA}
                                    isInvalid={!!formErrors.ngas}
                                    disabled={isOptionLoading}
                                >
                                    <option hidden value=''>Select NGA...</option>
                                    {
                                        NGAs.map(item => (
                                            <option key={item.id} value={item.id}>{item.code} - {item.description}</option>
                                        ))
                                    }
                                </Form.Select>
                            )
                        }
                        {
                            (formInputs.receivable_type === 'CHED Offices' && ChedOffices.length !== 0) && (
                                <Form.Select
                                    name='chedoffices'
                                    value={formInputs.receivable_id}
                                    onChange={handleChangeCO}
                                    isInvalid={!!formErrors.chedoffices}
                                    disabled={isOptionLoading}
                                >
                                    <option hidden value=''>Select Ched Office...</option>
                                    {
                                        ChedOffices.map(item => (
                                            <option key={item.id} value={item.id}>{item.code} - {item.description}</option>
                                        ))
                                    }
                                </Form.Select>
                            )
                        }
                        {
                            formInputs.receivable_type === 'Others' && (
                                <Form.Control
                                    type='text'
                                    name='receivable_name'
                                    value={formInputs.receivable_name}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.receivable_name}
                                    disabled={isOptionLoading}
                                />
                            )
                        }
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.receivable_name}
                        </Form.Control.Feedback>
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
                            isInvalid={!!formErrors.description} />
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.description}
                        </Form.Control.Feedback>
                </Col>
            </Row>

            <Row className="mb-3"> 
            <Form.Group>
                <div> 
                <Form.Label>Category</Form.Label>
                </div>
                <div>
                            {
                                categories.map((category, index) => (
                                    <Form.Check key={category.id} type='radio' id={`inline-${category.id}-1`} inline className={formErrors.category_id ? 'is-invalid' : ''}>
                                        <Form.Check.Input
                                            type='radio'
                                            name='category_id'
                                            onChange={handleInputChange}
                                            value={category.id}
                                            isInvalid={!!formErrors.category_id} />
                                        <Form.Check.Label>
                                            {category.description}
                                        </Form.Check.Label>
                                    </Form.Check>
                                ))
                            }
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.category_id}
                            </Form.Control.Feedback>
                            
                            {/* Conditional rendering */}
                        
                            {
                                selectedCategory && (
                                    <div style={{ marginTop: '10px' }}>
                                        {selectedCategory.is_assignable &&(
                                            <Row> 
                                                <Col md={'auto'}> 
                                                    <Form.Label>Select assign to:</Form.Label>
                                                    <Select 
                                                        isMulti
                                                        name='assignTo' 
                                                        options={options}
                                                        value={options.filter(option => selectedUsers.includes(option.value))}
                                                        onChange={handleUserSelection} />
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                )
                            }
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
        </Form>
    );
}

export default DocumentEdit;