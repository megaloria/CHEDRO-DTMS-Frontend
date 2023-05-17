import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Row,
    Col,
    Breadcrumb,
    Alert,
    Spinner
} from 'react-bootstrap';
import {
    Link,
    useNavigate
} from 'react-router-dom';
import moment from 'moment';
import apiClient from '../../../../helpers/apiClient';
import Validator from 'validatorjs';
import Swal from 'sweetalert2';
import Select from 'react-select';


function DocumentReceive() {

    const navigate = useNavigate();

    const [NGAs, setNGAs] = useState([]);
    const [users, setUsers] = useState([]);
    const [ChedOffices, setChedOffices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [names, setNames] = useState([]);
    const [trackingNo, setTrackingNo] = useState('');
    const [docType, setDocType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isOptionLoading, setIsOptionLoading] = useState(false);
    const [isOptionLoading1, setIsOptionLoading1] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [dateReceived, setDateReceived] = useState(moment().format('YYYY-MM-DD'));
    const [isDisabled, setIsDisabled] = useState(false);
    const [options, setOptions] = useState([]);

    //Add Receive documents
    const [documentTypes, setDocumentTypes] = useState([]);

    const [formInputs, setFormInputs] = useState({
        document_type_id: '',
        attachment: '',
        date_received: moment().format("YYYY-MM-DD"),
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

    //For assigning multiple users 
    //yarn add react-select
    // const handleUserSelection = (selectedOptions) => {
    //     let toDisable = [];
    //     for (let i = 0; i < selectedOptions.length; i++) {
    //         if (selectedOptions[i].data.id !== selectedOptions[i].data.role.division.role.user.id) {
    //             toDisable.push(selectedOptions[i].data.role.division.role.user.id);
    //         }

    //         if (selectedOptions[i].data.role.level !== selectedOptions[i].data.role.division.role.level+1) {
    //             for (let j = 0; j < users.length; j++) {
    //                 if (
    //                     users[j].role.level === selectedOptions[i].data.role.division.role.level+1 &&
    //                     users[j].role.division_id === selectedOptions[i].data.role.division.role.division_id
    //                 ) {
    //                     toDisable.push(users[j].id);
    //                 }
    //             }
    //         }
    //     }

    //     let newOptions = options.map(opt => {
    //         if (toDisable.includes(opt.value)) {
    //             return {
    //                 ...opt,
    //                 isDisabled: true
    //             };
    //         }

    //         return {
    //             ...opt,
    //             isDisabled: false
    //         };
    //     });
    //     setOptions(newOptions);

    //     let userIds = selectedOptions.map(option => option.value);
    //     userIds = userIds.filter(uid => !toDisable.includes(uid));
    //     setSelectedUsers(userIds);
    // };

    const handleUserSelection = async (selectedOption) => {
        let userId = null;
        if (selectedOption !== null) {
            userId = selectedOption.value;
        }
        setSelectedUsers(userId);
    };

    const handleSubmit = event => {
        event.preventDefault();

        let assignTo = selectedUsers ? [selectedUsers] : [];

        let validation = new Validator({
            ...formInputs,
            assignTo
        }, {
            document_type_id: 'required|integer|min:1',
            attachment: 'file',
            date_received: 'date',
            receivable_type: 'required|in:HEIs,NGAs,CHED Offices,Others',
            receivable_id: 'integer|min:1',
            receivable_name: 'required_if:receivable_type,Others',
            insti: 'integer|min:1',
            ngas: 'integer|min:1',
            chedoffices: 'integer|min:1',
            description: 'required|string|min:5',
            category_id: 'required|integer|min:1',
            assignTo: 'array|max:1',
            'assignTo.*': 'integer|min:1'
        });

        if (validation.fails()) {
            setFormErrors({
                document_type_id: validation.errors.first('document_type_id'),
                attachment: validation.errors.first('attachment'),
                date_received: validation.errors.first('date_received'),
                receivable_type: validation.errors.first('receivable_type'),
                receivable_id: validation.errors.first('receivable_id'),
                receivable_name: validation.errors.first('receivable_name'),
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
        }
        handleAdd();
    };

    const handleAdd = () => {

        setIsDisabled(true);

        let assignTo = [selectedUsers];
        const formData = new FormData();

        if (attachment) {
            formData.append('attachment', attachment, attachment.name);
        }
        formData.append('document_type_id', formInputs.document_type_id);
        formData.append('date_received', formInputs.date_received);
        formData.append('receivable_type', formInputs.receivable_type);

        let receivableId = formInputs.receivable_type === 'HEIs' ? formInputs.insti :
            formInputs.receivable_type === 'NGAs' ? formInputs.ngas :
                formInputs.receivable_type === 'CHED Offices' ? formInputs.chedoffices : '';
        formData.append('receivable_id', receivableId);
        formData.append('receivable_name', formInputs.receivable_name);
        formData.append('description', formInputs.description);
        formData.append('category_id', formInputs.category_id);
        
        for (let i = 0; i < assignTo.length; i++) {
            formData.append(`assign_to[${i}]`, assignTo[i]);
        }

        apiClient.post('/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setIsDisabled(false)
            navigate('../');
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success',
                allowOutsideClick: false
            })
        }).catch(error => {
            setIsDisabled(false)
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error',
                allowOutsideClick: false
            });
        });
    }

    const handleForward = (event) => {
        event.preventDefault();
        setIsDisabled(true);

        let assignTo = selectedUsers ? [selectedUsers] : [];

        let validation = new Validator({
            ...formInputs,
            assignTo
        }, {
            document_type_id: 'required|integer|min:1',
            attachment: 'file',
            date_received: 'date',
            receivable_type: 'required|in:HEIs,NGAs,CHED Offices,Others',
            receivable_id: 'integer|min:1',
            receivable_name: 'required_if:receivable_type,Others',
            insti: 'integer|min:1',
            ngas: 'integer|min:1',
            chedoffices: 'integer|min:1',
            description: 'required|string|min:5',
            category_id: 'required|integer|min:1',
            assignTo: 'array|max:1',
            'assignTo.*': 'integer|min:1'
        });

        if (validation.fails()) {
            setIsDisabled(false)
            setFormErrors({
                document_type_id: validation.errors.first('document_type_id'),
                attachment: validation.errors.first('attachment'),
                date_received: validation.errors.first('date_received'),
                receivable_type: validation.errors.first('receivable_type'),
                receivable_id: validation.errors.first('receivable_id'),
                receivable_name: validation.errors.first('receivable_name'),
                insti: validation.errors.first('insti'),
                ngas: validation.errors.first('ngas'),
                chedoffices: validation.errors.first('chedoffices'),
                description: validation.errors.first('description'),
                category_id: validation.errors.first('category_id'),
                assignTo: validation.errors.first('assignTo')
            });
            console.log(validation.errors, selectedUsers)
            return;
        } else {
            setFormErrors({
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
        }

        const formData = new FormData();

        if (attachment) {
            formData.append('attachment', attachment, attachment.name);
        }
        formData.append('document_type_id', formInputs.document_type_id);
        formData.append('date_received', formInputs.date_received);
        formData.append('receivable_type', formInputs.receivable_type);

        let receivableId = formInputs.receivable_type === 'HEIs' ? formInputs.insti :
            formInputs.receivable_type === 'NGAs' ? formInputs.ngas :
                formInputs.receivable_type === 'CHED Offices' ? formInputs.chedoffices : '';
        formData.append('receivable_id', receivableId);
        formData.append('receivable_name', formInputs.receivable_name);
        formData.append('description', formInputs.description);
        formData.append('category_id', formInputs.category_id);
        for (let i = 0; i < assignTo.length; i++) {
            formData.append(`assign_to[${i}]`, assignTo[i]);
        }

        apiClient.post(`/document/forward`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setIsDisabled(false);
            navigate('../');
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
        }).catch(error => {
            setIsDisabled(false);
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        });
    };

    const handleInputChange = e => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });

        if (e.target.name === 'date_received') {
            setDateReceived(e.target.value)
        } else if (e.target.name === 'category_id') {
            let newSelectedCategory = categories.find(c => c.id === +e.target.value);
            setSelectedCategory(newSelectedCategory);

            if(!newSelectedCategory.is_assignable) {
                let newOptions = users.map(user => ({
                    value: user.id,
                    label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
                }));
                setOptions(newOptions);

                let newSelectedUser = users.find(u => u.role.level === 2)?.id;
                setSelectedUsers(newSelectedUser);
            } else {
                let newOptions = users.filter(u => u.role.level !== 2).map(user => ({
                    value: user.id,
                    label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
                }));
                setOptions(newOptions);
                setSelectedUsers(null)
            }
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
            const response = await apiClient.get(`/settings/heis/municipalities/${value}`);
            setMunicipalities(response.data.data);
            setFormInputs({
                ...formInputs,
                province: value,
            });
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
            const response = await apiClient.get(`/settings/heis/names/${value}`);
            setNames(response.data.data);
            setFormInputs({
                ...formInputs,
                municipality: value,
            });
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
            <Spinner animation='border' />
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
                    <Row className="justify-content-end mt-4 mb-3">
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

                    <Row className='d-md-none mb-3'> </Row>
                    <Col >
                        <Form.Label>Tracking No. {isOptionLoading1 ? <Spinner animation='border' size='sm' /> : ""}</Form.Label>
                        <Form.Control
                            type='text'
                            name='trackingNo'
                            placeholder='Tracking Number'
                            value={trackingNo}
                            isInvalid={!!formErrors.trackingNo}
                            disabled
                        />
                    </Col>

                    <Row className='d-md-none mb-3'> </Row>

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

                    <Row className='d-md-none mb-3'> </Row>

                    <Col>
                        <Form.Label>Receive from {isOptionLoading ? <Spinner animation='border' size='sm' /> : ""} </Form.Label>
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
                                            <option key={municipality.id} value={municipality.id}>
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
                                            <option key={names.id} value={names.id}>
                                                {names.name}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            )
                        }
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.insti}
                        </Form.Control.Feedback>
                        {
                            (formInputs.receivable_type === 'NGAs' && NGAs.length !== 0) && (
                                <Form.Select
                                    name='ngas'
                                    value={formInputs.ngas}
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
                                    value={formInputs.chedoffices}
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
                            <Form.Label>Category </Form.Label>
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
                                        <Row>
                                            <Col md={'auto'}>
                                                <Form.Label>Assign to <span className='text-muted'>(Optional)</span>:</Form.Label>
                                                <Select
                                                    isClearable
                                                    name='assignTo'
                                                    options={options}
                                                    value={options.find(option => option.value === selectedUsers)}
                                                    onChange={handleUserSelection}
                                                    isDisabled={!selectedCategory.is_assignable}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            }
                        </div>


                    </Form.Group>
                </Row>

                <Row>
                    <div className='d-flex justify-content-end mt-4 mb-4'>
                        <Col md="auto" className="me-2">
                            <Button
                                variant="secondary"
                                as={Link}
                                to='../'>
                                Cancel
                            </Button>
                        </Col>

                        <Col md="auto" className="me-2">
                            <Button type='submit' variant="outline-primary" disabled={isDisabled}>
                                Receive
                            </Button>
                        </Col>

                        <Col md="auto">
                            {selectedCategory &&
                                (!selectedCategory.is_assignable || selectedUsers !== null) &&
                                <Button onClick={handleForward} variant="primary" disabled={isDisabled}>
                                    Forward
                                </Button>
                                
                            }
                        </Col>
                    </div>
                </Row>
            </div>
        </Form>
    );
}

export default DocumentReceive;