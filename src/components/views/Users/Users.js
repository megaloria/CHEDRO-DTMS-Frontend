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
    InputGroup,
    Pagination
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd,
    faSpinner,
    faRotate,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function Users() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]); //data variable
    const [roles, setRoles] = useState([]); //user variable

    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable

    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        apiClient.get(`/users?page=${pageNumber}`, {
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

    // ADD AND EDIT INPUT
    const [formInputs, setFormInputs] = useState({ // input inside the modal
        username: '',
        password: '',
        role_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        prefix: '',
        suffix: '',
        position_designation: '',
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        username: '',
        password: '',
        role_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        prefix: '',
        suffix: '',
        position_designation: '',
    });

    useEffect(() => {
        apiClient.get('/users', {
            params: {
                query: ''
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.users);
            setRoles(response.data.data.roles);
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
            ...(modal.data ? {} : { password: 'required|string|min:8' }),
            role_id: 'required|integer|min:1',
            first_name: 'required|string|min:1',
            middle_name: 'string|min:2',
            last_name: 'required|string|min:4',
            prefix: 'string|min:2',
            suffix: 'string|min:2',
            position_designation: 'required|string|min:2',
        });

        if (validation.fails()) {
            setFormErrors({
                username: validation.errors.first('username'),
                ...(modal.data ? {} : { password: validation.errors.first('password') }),
                role_id: validation.errors.first('role_id'),
                first_name: validation.errors.first('first_name'),
                middle_name: validation.errors.first('middle_name'),
                last_name: validation.errors.first('last_name'),
                prefix: validation.errors.first('prefix'),
                suffix: validation.errors.first('suffix'),
                position_designation: validation.errors.first('position_designation'),
            });
            return;
        } else {
            setFormErrors({
                username: '',
                password: '',
                role_id: '',
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
            let newData = data.data.map(d => {
                if (d.id === response.data.data.id) {
                    return {...response.data.data};
                }

                return {...d};
            })
            setData({
                ...data,
                data: newData
            });
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

    const handleSearchInputChange = e => {
        setSearchQuery(e.target.value);
    }

    const handleSearch = e => {
        e.preventDefault();

        setIsTableLoading(true);
        apiClient.get('/users', {
            params: {
                query: searchQuery
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.users);
            setRoles(response.data.data.roles);
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
                username: data.username,
                role_id: data.role_id,
                first_name: data.profile.first_name,
                middle_name: data.profile.middle_name,
                last_name: data.profile.last_name,
                prefix: data.profile.prefix,
                suffix: data.profile.suffix,
                position_designation: data.profile.position_designation,
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
            username: '',
            role_id: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            prefix: '',
            suffix: '',
            position_designation: '',
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    // RESET PASSWORD
    const [modalReset, setmodalReset] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputPass, setformInputPass] = useState({ // input inside the modal
        reset_password: ''
    });

    const [formErrorPass, setformErrorPass] = useState({ //errors for the inputs in the modal
        reset_password: ''
    });

    const handleSubmitReset = event => {
        event.preventDefault();
        let validation = new Validator(formInputPass, {
            reset_password: 'required|string|min:8'
        });
        if (validation.fails()) {
            setformErrorPass({
                reset_password: validation.errors.first('reset_password'),
            });
            return;
        } else {
            setformErrorPass({
                reset_password: '',
            });
        }
        setmodalReset({
            ...modalReset,
            isLoading: true
        });
        handleReset();
    };

    const handleReset = () => {
        apiClient.post(`/users/${modalReset.data?.id}/reset`, {
            ...formInputPass,
        }).then(response => {
            let newData = data.data.map(d => {
                if (d.id === response.data.data.id) {
                    return {...response.data.data};
                }

                return {...d};
            })
            setData({
                ...data,
                data: newData
            });
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            }).then(() => {
                handleHidemodalReset();
            });
        }).catch(error => {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        }).finally(() => {
            setmodalReset({
                ...modalReset,
                isLoading: false
            });
        });
    }

    const handleInputChangePass = e => {
        setformInputPass({
            ...formInputPass,
            [e.target.name]: e.target.value
        });
    }

    const handleShowmodalReset = (data = null) => {
        if (data !== null) {
            setformInputPass({
                ...formInputPass,
                reset_password: data.reset_password,
            });
        }

        setmodalReset({
            show: true,
            data,
            isLoading: false
        });
    }

    const handleHidemodalReset = () => {
        setformInputPass({
            reset_password: '',
        });
        setmodalReset({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const getRoleDescription = (role_id) => {
        let role = roles.find(roles => roles.id === role_id);
        return role?.description;
    }

    const showDeleteAlert = users => {
        Swal.fire({
            title: `Are you sure you want to delete "${users.username}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/users/${users.id}`).then(response => {
                    let newData = data.data.filter(d => d.id !== users.id);
                    setData({
                        ...data,
                        data: newData
                    });
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
                    <Col md="auto">
                        <div className="search">
                            <Form className="d-flex" controlId="" onSubmit={handleSearch}>
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

            {
                data.data.length === 0 ? (
                    <Alert variant='primary'>
                        No User found.
                    </Alert>
                ) : (
                    <div className='loading-table-container'>
                                    <div className={`table-overlay ${isTableLoading ? 'table-loading' : ''}`}>
                                        <div className='spinner-icon'>
                                            <FontAwesomeIcon icon={faSpinner} spin size='lg' />
                                        </div>
                                    </div>
                                <Table striped bordered hover responsive size='md' className={isTableLoading ? 'table-loading' : ''}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Role</th>
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
                                                        <Button onClick={e => handleShowmodalReset(row)} variant='link'>
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
                size='lg'
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
                        </Col> {
                            !modal.data && (
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type='password' 
                                                onChange={handleInputChange}
                                                value={formInputs.password}
                                                name='password'
                                                placeholder='Enter Password'
                                                isInvalid={!!formErrors.password}
                                                 />
                                            <Form.Control.Feedback type='invalid'>
                                                {formErrors.password}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            )
                        }
                        <Col>
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Role</Form.Label>
                                <Form.Select 
                                aria-label='Default select example'
                                name='role_id'
                                value={formInputs.role_id} 
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.role_id}>
                                    <option value=''>Select role...</option>
                                    {
                                        roles.map(roles => (
                                            <option key={roles.id} value={roles.id}>{roles.description}</option>
                                        ))
                                    }
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'>
                                    {formErrors.role_id}
                                </Form.Control.Feedback>
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
                                    name='position_designation'
                                    value={formInputs.position_designation}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.position_designation}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.position_designation}
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>
                   
                        </Modal.Body>
                        <Modal.Footer>
                            <Button 
                                variant='secondary' 
                                onClick={handleHideModal} 
                                disabled={modal.isLoading}>
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

            {/* <!--- Model Box Reset password ---> */}
                <Modal
                    show={modalReset.show}
                    onHide={handleHidemodalReset}
                    backdrop="static"
                    keyboard={false}
                    aria-labelledby="example-custom-modal-styling-title"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">Reset Password</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmitReset}>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type='password'
                                        name='reset_password'
                                        value={formInputPass.reset_password} 
                                        onChange={handleInputChangePass}
                                        isInvalid={!!formErrorPass.reset_password}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrorPass.reset_password}
                                        </Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={handleHidemodalReset}
                                    disabled={modalReset.isLoading}>
                                       Cancel
                                </Button>
                                <Button 
                                    type='submit'
                                    variant='primary'
                                    disabled={modalReset.isLoading}>
                                       Reset
                                </Button>
                            </Modal.Footer>
                    </Form>
                </Modal>
        </Container>
    );
}

export default Users;