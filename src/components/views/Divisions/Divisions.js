import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faAdd
} from '@fortawesome/free-solid-svg-icons'
import {
    Button,
    Modal,
    Form,
    Table,
    Row,
    Col,
    Alert,
    Spinner
} from 'react-bootstrap';
import {
    useNavigate
} from 'react-router-dom';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';


function Division() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        description: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        description: ''
    });

    useEffect(() => {
        apiClient.get('/settings/divisions').then(response => { //GET ALL function
            setData(response.data.data);
            // setDivisions(response.data.data.divisions);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            description: 'required|min:2',
        });

        if (validation.fails()) {
            setFormErrors({
                description: validation.errors.first('description')
            });
            return;
        } else {
            setFormErrors({
                description: ''
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
        apiClient.post('/settings/divisions', {
            ...formInputs,
            division_id: formInputs.division
        }).then(response => {
            setData([
                ...data,
                response.data.data
            ]);
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
        apiClient.post(`/settings/divisions/${modal.data?.id}`, {
            ...formInputs,
            division_id: formInputs.division
        }).then(response => {
            let newData = data.map(d => {
                if (d.id === response.data.data.id) {
                    return { ...response.data.data };
                }

                return { ...d };
            })
            setData(newData);
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

    const handleShowModal = (data = null) => {
        if (data !== null) {
            setFormInputs({
                ...formInputs,
                description: data.description
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
            description: ''
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const showDeleteAlert = division => {
        Swal.fire({
            title: `Are you sure you want to delete "${division.description}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/divisions/${division.id}`).then(response => {
                    let newData = data.filter(d => d.id !== division.id);
                    setData(newData);
                    navigate('../')
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
        <div className="container fluid">
            <div className="crud bg-body rounded">
                <Row className="justify-content-end mt-4 mb-3">
                    <Col>
                        <h1>Divisions</h1>
                    </Col>
                </Row>

                <div>
                    <div className='d-flex mb-3 justify-content-end'>
                        <div className='search'>
                            <Form className="d-flex">
                                {/* <Form.Control 
                                        type="search" 
                                        placeholder="Search" 
                                        className="me-2"
                                        // value={searchQuery}
                                        // onChange={handleSearchInputChange}
                                    />
                                    <Button type='submit'>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button> */}

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

            <div className="row">
                <div className="table-responsive " >
                    <Table bordered hover responsive size="md">
                        <thead className='table-primary'>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td className='table-primary'>{row.id}</td>
                                        <td>{row.description}</td>
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
                </div>
            </div>

            {/* <!--- Model Box ADD ---> */}
            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} division</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="margin: 40px">
                            <Col>
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

    );
}

export default Division;