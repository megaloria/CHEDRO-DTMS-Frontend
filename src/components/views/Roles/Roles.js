import React, { useEffect, useState }  from 'react';
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Table,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function Roles() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState([]);

    const [modal, setModal] = useState({
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({
        description: ''
    });

    const [formErrors, setFormErrors] = useState({
        description: ''
    });

    useEffect(() => {
        apiClient.get('/settings/roles').then(response => {
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
            description: 'required|min:2'
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
            // handleEdit();
        } else {
            handleAdd();
        }
    };

    const handleAdd = () => {
        apiClient.post('/settings/roles', formInputs).then(response => {
            setData([
                ...data,
                response.data.data
            ]);
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

    // DELETE
    const showAlert = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
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
            <div className='bg-body rounded'> 
                <Row className= 'justify-content-end mt-4 mb-3'>
                    <Col>
                        <h1>Roles</h1>
                    </Col>
                    <Col md='auto'>
                        <div className='search'>
                            <Form className='mb-3'>
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

            <Table striped bordered hover responsive size='md'>
                <thead>
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
                                <td>{row.id}</td>
                                <td>{row.description}</td>
                                <td>
                                    <Button onClick={e => handleShowModal(row)} variant='link'>
                                        <FontAwesomeIcon icon={faEdit} className='text-primary'/>
                                    </Button>
                                    <Button onClick={showAlert} variant='link'>
                                        <FontAwesomeIcon icon={faTrash} className='text-danger'/>
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
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} role</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className='mb-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                name='description'
                                placeholder='Enter Description'
                                value={formInputs.description}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.description} />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.description}
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

export default Roles;