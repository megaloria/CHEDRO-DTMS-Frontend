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
    faSpinner,
    faRotate
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function Users() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]); //data variable
    const [roles, setRoles] = useState([]); //user variable
    // const [profiles, setProfile] = useState([]); //user variable

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        username: '',
        password: '',
        roles: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        prefix: '',
        suffix: '',
        position_designation: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        username: '',
        password: '',
        roles: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        prefix: '',
        suffix: '',
        position_designation: '',
    });

    useEffect(() => {
        apiClient.get('/users').then(response => { //GET ALL function
            setData(response.data.data.users);
            setRoles(response.data.data.roles);
            // setProfile(response.data.data.profiles);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            username: 'required|string|min:1',
            password: 'required|string|min:4',
            roles: '',
            first_name: 'required|string|min:1',
            middle_name: 'string|min:4',
            last_name: 'required|string|min:4',
            prefix: 'string|min:2',
            suffix: 'string|min:2',
            position_designation: 'required|string|min:2'
        });

        if (validation.fails()) {
            setFormErrors({
                username: validation.errors.first('username'),
                password: validation.errors.first('password'),
                roles: validation.errors.first(''),
                first_name: validation.errors.first('first_name'),
                middle_name: validation.errors.first('middle_name'),
                last_name: validation.errors.first('last_name'),
                prefix: validation.errors.first('prefix'),
                suffix: validation.errors.first('suffix'),
                position_designation: validation.errors.first('position_designation'),
                division_id: validation.errors.first('division_id')
            });
            return;
        } else {
            setFormErrors({
                username: '',
                password: '',
                roles: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                prefix: '',
                suffix: '',
                position_designation: '',
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
        apiClient.post('/users', {
            ...formInputs,
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
        apiClient.post(`/users/${modal.data?.id}`, {
            ...formInputs,
        }).then(response => {
            let newData = data.map(d => {
                if (d.id === response.data.data.id) {
                    return {...response.data.data};
                }

                return {...d};
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
                username: data.username,
                roles: data.role_id,
                first_name: data.profile.first_name,
                middle_name: data.profile.middle_name,
                last_name: data.profile.last_name,
                prefix: data.profile.prefix,
                suffix: data.profile.suffix,
                position: data.profile.position_designation
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
            user: '',
            description: '',
            level: 0
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const getRoleDescription = (role_id) => {
        let role = roles.find(roles => roles.id === role_id);
        return role?.description;
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
                return apiClient.delete(`/users/${role.id}`).then(response => {
                    let newData = data.filter(d => d.id !== role.id);
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
            <div className='bg-body rounded'> 
                <Row className= 'justify-content-end mt-4 mb-3'>
                    <Col>
                        <h1>Users</h1>
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
                        <th>Username</th>
                        <th>Name</th>
                        <th>Position/Designation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.username}</td>
                                <td>{getRoleDescription(row.role_id)}</td>
                                <td>{row.profile.position_designation}</td>
                                <td>
                                    <Button onClick={e => handleShowModal(row)} variant='link'>
                                        <FontAwesomeIcon icon={faEdit} className='text-primary'/>
                                    </Button>
                                    <Button onClick={''} variant='link'>
                                        <FontAwesomeIcon icon={faRotate} className='text-success'/>
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

            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title> {modal.data ? 'Edit' : 'Add'} Users</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                    <Row className='margin: 40px'>
                        <Col>
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Username'
                                    name='username'
                                    value={formInputs.username} 
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.username}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.username}
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {
                            !modal.data && (
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control 
                                            type='password' 
                                            placeholder='Enter Password'
                                            name='password'
                                            value={formInputs.password}/>
                                    </Form.Group>
                                </Col>
                            )
                        }
                        <Col>
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Role</Form.Label>
                                <Form.Select 
                                aria-label='Default select example'
                                name='roles'
                                value={formInputs.roles} 
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.roles}>
                                    <option value=''>Select role...</option>
                                    {
                                        roles.map(roles => (
                                            <option key={roles.id} value={roles.id}>{roles.description}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter First Name'
                                    name='first_name'
                                    value={formInputs.first_name}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.first_name}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.first_name}
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter Middle Name' 
                                name='middle_name'
                                value={formInputs.middle_name}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.middle_name}/>
                                <Form.Control.Feedback type='invalid'>
                                    {formErrors.middle_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Last Name'
                                    name='last_name'
                                    value={formInputs.last_name}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.last_name}/>
                                <Form.Control.Feedback type='invalid'>
                                    {formErrors.last_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='justify-content-md'>
                        <Col >
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Prefix</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Prefix'
                                    name='prefix'
                                    value={formInputs.prefix}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.prefix}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.prefix}
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col >
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Suffix</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Suffix'
                                    name='suffix'
                                    value={formInputs.suffix} 
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.suffix}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.suffix}
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col >
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Position/Designation</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Position'
                                    name='position'
                                    value={formInputs.position}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.position}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.position}
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                                Cancel
                            </Button>
                            <Button 
                            type='submit'
                            variant='primary' 
                            disabled={modal.isLoading}>
                                {modal.data ? 'Edit' : 'Add'}
                            </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>
        </Container>
    );
}

export default Users;