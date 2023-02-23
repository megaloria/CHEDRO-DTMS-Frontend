import React, { useEffect, useState }  from 'react';
import {
    Alert,
    Button, 
    Modal, 
    Form, 
    Table, 
    Row, 
    Container,
    Col
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faAdd,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function CHED() {
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); //loading variable

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        code: '',
        description: '',
        email: ''
    });

    const [formErrors, setFormErrors] = useState({ // input inside the modal
        code: '',
        description: '',
        email: ''
    });

    useEffect(() => {
        apiClient.get('/settings/ched-offices').then(response => { //GET ALL function
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
            code: 'required|string',
            description: 'required|string|min:5',
            email: 'required|email',    
        });

        if (validation.fails()) {
            setFormErrors({
                code: validation.errors.first('code'),
                description: validation.errors.first('description'),
                email: validation.errors.first('email')
            });
            return;
        } else {
            setFormErrors({
                code: '',
                description: '',
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
        apiClient.post('/settings/ched-offices', {
            ...formInputs
        }).then(response => {
            setData([
                ...data,
                response.data.data
            ]);
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            }).then(() => {
                handleHideModal();
            });
        }).catch(error => {
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
        apiClient.post(`/settings/ched-offices/${modal.data?.id}`, {
            ...formInputs
        }).then(response => {
            let newData = data.map(c => {
                if (c.id === response.data.data.id) {
                    return {...response.data.data};
                }

                return {...c};
            })
            setData(newData);
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            }).then(() => {
                handleHideModal();
            });
        }).catch(error => {
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
                code: data.code,
                description: data.description,
                email: data.email,
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
            code: '',
            description: '',
            email: '',
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const showDeleteAlert = Ched => {
        Swal.fire({
            title: `Are you sure you want to delete "${Ched.description}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/ched-offices/${Ched.id}`).then(response => {
                    let newData = data.filter(d => d.id !== Ched.id);
                    setData(newData);
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
        <Container fluid>
            <div className='crud bg-body rounded'> 

                <Row className= 'justify-content-end mt-4 mb-3'>
                    <Col>
                        <h1>CHED Offices</h1>
                    </Col>
                    <Col md='auto'>
                        <div className='search'>
                                <Form className='mb-3' controlId=''>
                                    <Form.Control type='search' placeholder='Search' />
                                </Form>
                        </div>
                    </Col>
                    <Col md='auto'>
                        <Button variant='primary' onClick={e => handleShowModal()}>
                            <FontAwesomeIcon icon={faAdd} /> Add
                        </Button>
                    </Col>  
                </Row>
            </div>
                <div class='table-responsive'>
                    <Table striped bordered hover size='md'>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Email</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.id}</td>
                                        <td>{row.code}</td>
                                        <td>{row.description}</td>
                                        <td>{row.email}</td>
                                        <td>
                                            <Button onClick={e => handleShowModal(row)} variant='link'>
                                                <FontAwesomeIcon icon={faEdit} className='text-primary'/>
                                            </Button>
                                            <Button onClick={e => showDeleteAlert(row)} variant='link'>
                                                <FontAwesomeIcon icon={faTrash} className='text-danger'/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>

            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} Ched Offices</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>

                        <Form.Group className='mb-2'>
                            <Form.Label>Code</Form.Label>
                            <Form.Control type='text' 
                                placeholder='Enter Code' 
                                name='code'
                                required
                                value={formInputs.code}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.code} />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.code}
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
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='text'
                                name='email'
                                placeholder='Enter email'
                                value={formInputs.email}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.email} />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                                Cancel
                            </Button>
                            <Button type='submit' variant='primary' disabled={modal.isLoading}>
                                {modal.data ? 'Edit' : 'Add'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>

    );
}

export default CHED;