import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Table,
    Pagination,
    Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import {
    useNavigate
} from 'react-router-dom';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';
import './styles.css';


function Roles() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]); //data variable
    const [divisions, setDivisions] = useState([]); //division variable

    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable

    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        division: '',
        description: '',
        level: 0
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        division: '',
        description: '',
        level: 0
    });

    useEffect(() => {
        apiClient.get('/settings/roles', {
            params: {
                query: ''
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.roles);
            setDivisions(response.data.data.divisions);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        apiClient.get(`/settings/roles?page=${pageNumber}`, {
            params: {
                query: ''
            }
        }).then(response => {
            setData(response.data.data.roles);
            setDivisions(response.data.data.divisions);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            division: 'present|integer|min:1',
            description: 'required|min:2',
            level: 'required|integer|min:1'
        });

        if (validation.fails()) {
            setFormErrors({
                division: validation.errors.first('division'),
                description: validation.errors.first('description'),
                level: validation.errors.first('level')
            });
            return;
        } else {
            setFormErrors({
                division: '',
                description: '',
                level: ''
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
        apiClient.post('/settings/roles', {
            ...formInputs,
            division_id: formInputs.division
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
        apiClient.post(`/settings/roles/${modal.data?.id}`, {
            ...formInputs,
            division_id: formInputs.division
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
        apiClient.get('/settings/roles', {
            params: {
                query: searchQuery
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.roles);
            setDivisions(response.data.data.divisions);
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
                division: data.division_id ?? '',
                description: data.description,
                level: data.level
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
            division: '',
            description: '',
            level: 0
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const getDivisionDescription = (divisionId) => {
        let division = divisions.find(div => div.id === divisionId);
        return division?.description;
    }

    const showDeleteAlert = role => {
        Swal.fire({
            title: `Are you sure you want to delete "${role.description}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/roles/${role.id}`).then(response => {
                    let newData = data.data.filter(d => d.id !== role.id);
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
                        <h1>Roles</h1>
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
            {
                data.data.length === 0 ? (
                    <Alert variant='primary'>
                        No Role found.
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
                                    <th>Division</th>
                                    <th>Description</th>
                                    <th>Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.data.map((row, index) => (
                                        <tr key={index}>
                                            <td className='table-primary'>{row.id}</td>
                                            <td>{getDivisionDescription(row.division_id)}</td>
                                            <td>{row.description}</td>
                                            <td>{row.level}</td>
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



            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} role</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className='mb-2'>
                            <Form.Label>Division</Form.Label>
                            <Form.Select name='division' value={formInputs.division} onChange={handleInputChange}>
                                <option value=''>Select division...</option>
                                {
                                    divisions.map(division => (
                                        <option key={division.id} value={division.id}>{division.description}</option>
                                    ))
                                }
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.division}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                name='description'
                                placeholder='Enter description'
                                value={formInputs.description}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.description} />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Label>Level</Form.Label>
                            <Form.Control
                                type='number'
                                name='level'
                                value={formInputs.level}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.level} />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.level}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            variant='primary'
                            disabled={modal.isLoading || isDisabled}>
                            {modal.data ? 'Edit' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default Roles;