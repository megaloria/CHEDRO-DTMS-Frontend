import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Table,
    Row,
    Container,
    Col,
    Alert,
    Pagination,
    Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faAdd,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import {
    useNavigate
} from 'react-router-dom';
import Swal from 'sweetalert2';
import './styles.css';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';
import './styles.css';

function Heis() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); //error message variable

    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable

    const [searchQuery, setSearchQuery] = useState();

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        uii: '',
        name: '',
        street_barangay: '',
        city_municipality: '',
        province: '',
        head_of_institution: '',
        email: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        uii: '',
        name: '',
        street_barangay: '',
        city_municipality: '',
        province: '',
        head_of_institution: '',
        email: '',
    });

    useEffect(() => {
        apiClient.get('/settings/heis', {
            params: {
                query: ''
            }

        }).then(response => { //GET ALL function
            setData(response.data.data);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        apiClient.get(`/settings/heis?page=${pageNumber}`, {
            params: {
                query: ''
            }
        }).then(response => {
            setData(response.data.data);//GET ALL function
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            uii: 'required|string',
            name: 'required|string|min:5',
            head_of_institution: 'required|string|min:5',
            street_barangay: 'required|string|min:5',
            city_municipality: 'required|string|min:5',
            province: 'required|string|min:5',
            email: 'required|email',
        });

        if (validation.fails()) {
            setFormErrors({
                uii: validation.errors.first('uii'),
                name: validation.errors.first('name'),
                street_barangay: validation.errors.first('street_barangay'),
                city_municipality: validation.errors.first('city_municipality'),
                province: validation.errors.first('province'),
                head_of_institution: validation.errors.first('head_of_institution'),
                email: validation.errors.first('email'),
            });
            return;
        } else {
            setFormErrors({
                uii: '',
                name: '',
                street_barangay: '',
                city_municipality: '',
                province: '',
                head_of_institution: '',
                email: '',
            });
        }

        setModal({
            ...modal,
            isLoading: true
        });
        if (modal.data !== null) {
            handleEdit();
        } else {
            handleAdd();
        }
    };

    const handleAdd = () => {
        setIsDisabled(true)
        apiClient.post('/settings/heis', {
            ...formInputs
        }).then(response => {
            setData({
                ...data,
                data: [
                    ...data.data,
                    response.data.data
                ]
            });
            setIsDisabled(false)
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            }).then(() => {
                handleHideModal();
            });
        }).catch(error => {
            setIsDisabled(false)
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        }).finally(() => {
            setModal({
                ...modal,
                isLoading: false
            });
        });
    }

    const handleEdit = () => {
        setIsDisabled(true)
        apiClient.post(`/settings/heis/${modal.data?.id}`, {
            ...formInputs
        }).then(response => {
            let newData = data.data.map(d => {
                if (d.id === response.data.data.id) {
                    return { ...response.data.data };
                }

                return { ...d };
            })
            setData({
                ...data,
                data: newData
            });
            setIsDisabled(false)
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            }).then(() => {
                handleHideModal();
            });
        }).catch(error => {
            setIsDisabled(false)
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        }).finally(() => {
            setModal({
                ...modal,
                isLoading: false
            });
        });
    }

    const handleInputChange = e => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    }

    const handleSearchInputChange = e => {
        setSearchQuery(e.target.value);
    }

    const handleSearch = e => {
        e.preventDefault();

        setIsTableLoading(true);
        apiClient.get('/settings/heis', {
            params: {
                query: searchQuery
            }
        }).then(response => { //GET ALL function
            setData(response.data.data);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    }

    const handleShowModal = (data = null) => {
        if (data !== null) {
            setFormInputs({
                ...formInputs,
                uii: data.uii,
                name: data.name,
                street_barangay: data.street_barangay,
                city_municipality: data.city_municipality,
                province: data.province,
                head_of_institution: data.head_of_institution,
                email: data.email
            });
        }

        setModal({
            show: true,
            data,
            isLoading: false
        });
    }

    const handleHideModal = () => {
        setFormInputs({
            uii: '',
            name: '',
            street_barangay: '',
            city_municipality: '',
            province: '',
            head_of_institution: '',
            email: '',
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const showDeleteAlert = hei => {
        Swal.fire({
            title: `Are you sure you want to delete "${hei.name}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/heis/${hei.id}`).then(response => {
                    let newData = data.data.filter(d => d.id !== hei.id);
                    setData({
                        ...data,
                        data: newData
                    });
                    navigate('../');
                    Swal.fire({
                        title: 'Success',
                        text: response.data.message,
                        icon: 'success'
                    });
                }).catch(error => {
                    Swal.fire({
                        title: 'Error',
                        text: error,
                        icon: 'error'
                    });
                });
            }
        });
    };

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
        <Container fluid>
            <div className='bg-body rounded'>
                <Row className='justify-content-end mt-4 mb-3'>
                    <Col>
                        <h1>HEIs</h1>
                    </Col>
                </Row>

                <div>
                    <div className='d-md-flex mb-3 justify-content-end'>
                        <div className='search'>
                            <Form className="d-flex" onSubmit={handleSearch}>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />
                                <Button type='submit'>
                                    <FontAwesomeIcon icon={faSearch} />
                                </Button>

                                <div className='ms-2'>
                                    <Button variant='primary' onClick={e => handleShowModal()} style={{ whiteSpace: 'nowrap' }}>
                                        <FontAwesomeIcon icon={faAdd} />
                                        <span className='d-none d-md-inline-block ms-1'> Add </span>
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            {data.data.length === 0 ? (
                <Alert variant='primary'>
                    No HEIs found.
                </Alert>
            ) : (

                <div className='loading-table-container'>
                    <div className={`table-overlay ${isTableLoading ? 'table-loading' : ''}`}>
                        <div className='spinner-icon'>
                            <Spinner animation='border' />
                        </div>
                    </div>
                    <Table bordered hover responsive size='md' className={isTableLoading ? 'table-loading' : ''}>
                        <thead className='table-primary'>
                            <tr>
                                <th>ID</th>
                                <th>UII</th>
                                <th>Name</th>
                                <th>Street/Barangay</th>
                                <th>City/Municipality</th>
                                <th>Province</th>
                                <th>Head of Institution</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.data.map((row, index) => (
                                    <tr key={index}>
                                        <td className='table-primary'>{row.id}</td>
                                        <td>{row.uii}</td>
                                        <td>{row.name}</td>
                                        <td>{row.street_barangay}</td>
                                        <td>{row.city_municipality}</td>
                                        <td>{row.province}</td>
                                        <td>{row.head_of_institution}</td>
                                        <td>{row.email}</td>
                                        <td>
                                            <Button onClick={e => handleShowModal(row)} variant='link'>
                                                <FontAwesomeIcon icon={faEdit} className='text-primary' />
                                            </Button>
                                            <Button onClick={e => showDeleteAlert(row)} variant='link'>
                                                <FontAwesomeIcon icon={faTrash} className='text-danger' />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>

                    <div>
                        {data.data.length > 0 && (
                            <Pagination style={{ float: 'right' }}>
                                <Pagination.First onClick={e => handlePageChange(1)} disabled={data.current_page === 1} />
                                <Pagination.Prev onClick={e => handlePageChange(data.current_page - 1)} disabled={data.current_page === 1} />
                                <Pagination.Item disabled>
                                    {`${data.current_page} / ${data.last_page}`}
                                </Pagination.Item>
                                <Pagination.Next onClick={e => handlePageChange(data.current_page + 1)} disabled={data.current_page === data.last_page} />
                                <Pagination.Last onClick={e => handlePageChange(data.last_page)} disabled={data.current_page === data.last_page} />
                            </Pagination>
                        )}
                    </div>
                </div>
            )
            }
            <div className='model_box'>

                <Modal
                    show={modal.show}
                    onHide={handleHideModal}
                    backdrop='static'
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modal.data ? 'Edit' : 'Add'} HEI</Modal.Title>
                    </Modal.Header>

                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>UII</Form.Label>
                                        <Form.Control
                                            type='text'
                                            name='uii'
                                            placeholder='Enter UII'
                                            value={formInputs.uii}
                                            onChange={handleInputChange}
                                            isInvalid={!!formErrors.uii} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.uii}.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter Institution Name'
                                            name='name'
                                            value={formInputs.name}
                                            isInvalid={!!formErrors.name}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Street/Barangay</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter Street/Barangay'
                                            name='street_barangay'
                                            value={formInputs.street_barangay}
                                            isInvalid={!!formErrors.street_barangay}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.street_barangay}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>City/Municipality</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter City/Municipality'
                                            name='city_municipality'
                                            value={formInputs.city_municipality}
                                            isInvalid={!!formErrors.city_municipality}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.city_municipality}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Province</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter Province'
                                            name='province'
                                            value={formInputs.province}
                                            isInvalid={!!formErrors.province}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.province}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Head of Institution</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter Head of Institution'
                                            name='head_of_institution'
                                            value={formInputs.head_of_institution}
                                            isInvalid={!!formErrors.head_of_institution}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.head_of_institution}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter Email Address'
                                            name='email'
                                            value={formInputs.email}
                                            isInvalid={!!formErrors.email}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                                Cancel
                            </Button>
                            <Button type='submit' variant='primary' disabled={modal.isLoading || isDisabled}>
                                {modal.data ? 'Edit' : 'Add'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </Container>
    );
}

export default Heis;