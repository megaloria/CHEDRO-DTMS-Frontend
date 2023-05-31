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
    Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd,
    faCheck,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import {
    useNavigate
} from 'react-router-dom';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function Category() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]); //data variable
    const [isDisabled, setIsDisabled] = useState(false);

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        description: '',
        is_assignable: false
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        description: '',
        is_assignable: false
    });

    useEffect(() => {
        apiClient.get('/settings/categories').then(response => { //GET ALL function
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
            description: 'required|min:2',
            is_assignable: 'boolean'
        });

        if (validation.fails()) {
            setFormErrors({
                description: validation.errors.first('description'),
                is_assignable: validation.errors.first('is_assignable')
            });
            return;
        } else {
            setFormErrors({
                description: '',
                is_assignable: false
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
        setIsDisabled(true);
        apiClient.post('/settings/categories', {
            ...formInputs,
            description: formInputs.description,
            is_assignable: formInputs.is_assignable
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
        apiClient.post(`/settings/categories/${modal.data?.id}`, {
            ...formInputs
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

    const handleCheckboxChange = e => {
        setFormInputs({
            ...formInputs,
            is_assignable: e.target.checked
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
                description: data.description,
                is_assignable: data.is_assignable
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
            description: '',
            is_assignable: false
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }


    const showDeleteAlert = category => {
        Swal.fire({
            title: `Are you sure you want to delete "${category.description}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/categories/${category.id}`).then(response => {
                    let newData = data.filter(d => d.id !== category.id);
                    setData(newData);
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
                        <h1>Categories</h1>
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

            <Table bordered hover responsive size='md'>
                <thead className='table-primary'>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Assignable</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row, index) => (
                            <tr key={index}>
                                <td className='table-primary'>{row.id}</td>
                                <td>{row.description}</td>
                                <td>{row.is_assignable ? <FontAwesomeIcon icon={faCheck} className='text-success' /> : <FontAwesomeIcon icon={faTimes} className='text-danger' />} </td>
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

            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} Category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className='mb-3'>
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
                        <Form.Group controlId='is_assignable'>
                            <Form.Check
                                type='checkbox'
                                label='is assignable?'
                                checked={formInputs.is_assignable}
                                onChange={handleCheckboxChange}
                                isInvalid={!!formErrors.is_assignable}
                            />
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

export default Category;