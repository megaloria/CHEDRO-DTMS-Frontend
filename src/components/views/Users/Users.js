import React,{ useEffect, useState }  from 'react';
import {
    Alert,
    Button, 
    Modal, 
    InputGroup, 
    Form, 
    Pagination, 
    Row, 
    Col, 
    Table
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faRotate, 
    faEdit, 
    faAdd,
    faEye,
    faEyeSlash,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './style.css';import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function Users() {
    
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState({ data: [] }); //data variable
    const [roles, setRoles] = useState([]); //division variable
    const [profiles, setProfiles] = useState([]); //division variable

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        role_id: '',
        username: '',
        password: '',
        prefix	: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        position_designation: '',
        division_id: '',
        level: '',
        description: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        role_id: '',
        username: '',
        password: '',
        prefix	: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        position_designation: '',
        division_id: '',
        level: '',
        description: ''
    });

    useEffect(() => {
        apiClient.get('/users').then(response => { //GET ALL function
            setData(response.data.data.users);
            setProfiles(response.data.data.profiles);
            setRoles(response.data.data.roles);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = event => {
        let validation = new Validator(formInputs, {
            username: 'required|string|min:5',
            password: 'required|min:8',
            first_name: 'required|string',
            last_name: 'required|string|min:5',
            prefix: 'nullable|present|string',
            suffix: 'nullable|present|string',
            middle_name: 'nullable|present|string',
            role_id: 'required|integer|exists:roles,id',
            division_id: 'required|integer|exists:divisions,id',
            level: 'required|integer',
            description: 'required|string',
            position_designation: 'nullable|present|string'
        });

        if (validation.fails()) {
            setFormErrors({
                username: validation.errors.first('description'),
                password: validation.errors.first('description'),
                first_name: validation.errors.first('level'),
                last_name: validation.errors.first('description'),
                prefix: validation.errors.first('description'),
                suffix: validation.errors.first('level'),
                middle_name: validation.errors.first('description'),
                division_id: validation.errors.first('description'),
                level: validation.errors.first('level'),
                division: validation.errors.first('description'),
                description: validation.errors.first('description'),
                position_designation: validation.errors.first('level')
            });
            return;
        } else {
            setFormErrors({
                role_id: '',
                username: '',
                password: '',
                prefix	: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                suffix: '',
                position_designation: '',
                division_id: '',
                level: '',
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
        apiClient.post('/users', {
            ...formInputs,
            role_id: formInputs.roles,
            id: formInputs.profiles
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

    // // SHOW PASSWORD
    
    // const [passwordShown, setPasswordShown] = useState(false);

    //     const togglePassword = () => {
       
    //     setPasswordShown(!passwordShown);
    // };

    // // ADD CREATE
    // const [show, setShow] = useState(false);
 
    // const handleClose = () => {
    //     setShow(false)
    // };
    // const handleShow = () => {
    //     setShow(true)
    // };

    // // SHOW PASSWORD


    // const [passwordType, setPasswordType] = useState('password');
    // const [passwordInput, setPasswordInput] = useState('');

    // const handlePasswordChange = evnt => {
    //     setPasswordInput(evnt.target.value);
    // }
    // const togglePassword3 = () => {
    //     if(passwordType === 'password') {
    //         setPasswordType('text');
    //         return;
    //     }
    //     setPasswordType('password')
    // }

    // // Change Password
    // const [show2, setShow2] = useState(false);
 
    // const handleClose2 = () => {
    //     setShow2(false)
    // };
    // const handleShow2 = () => {
    //     setShow2(true)
    // };

    // Edit Record

    const handleEdit = () => {
        apiClient.post(`/users/${modal.data?.id}`, {
            ...formInputs,
            role_id: formInputs.role,
            id: formInputs.profiles
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
                role_id: data.role_id,
                username: data.username,
                password: data.password
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
            role_id: '',
            username: '',
            password: ''
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    } 

    const getRolesDescription = (role_id) => {
        let role = roles.find(div => div.id === role_id);
        return role?.description;
    }
    const getProfileDescription = (position_designation) => {
        let Profiles = profiles.find(div => div.id === position_designation);
        return profiles?.position_designation;
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
                    let newData = data.filter(d => d.id !== users.id);
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
        <div class='container fluid'>
            <div className='crud bg-body rounded'> 
                <Row className= 'justify-content-end mt-4 mb-3'>
                    <Col>
                        <h1>Users</h1>
                    </Col>
                    <Col md='auto'>
                        <div className='search'>
                            <Form>
                                <Form className='mb-3' controlId=''>
                                    <Form.Control type='search' placeholder='Search' />
                                </Form>
                            </Form>
                        </div>
                    </Col>
                    <Col md='auto'>
                        <Button variant='primary' onClick={e => handleShowModal()}>
                            <FontAwesomeIcon icon={faAdd} className='addIcon'/> Add
                        </Button>
                    </Col> 
                </Row>
            </div>
            <div class='row'>
                <div class='table-responsive ' >
                    <Table striped bordered hover size='md'>
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
                            data.data.map((row,index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.username}</td>
                                    <td>{getRolesDescription(row.role_id)}</td>
                                    <td>{row.profile.position_designation}</td>
                                    <td>
                                    <Button onClick={e => handleShowModal(row)} variant='link'>
                                        <FontAwesomeIcon icon={faEdit} className='text-primary'/>
                                    </Button>
                                    {/* <Button onClick={handleShow2} variant='link'>
                                        <FontAwesomeIcon icon={faRotate} className='text-success'/></Button> */}
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
                        <Pagination className='page'>
                            <Pagination.First />
                            <Pagination.Prev />
                            <Pagination.Item>{1}</Pagination.Item>
                            <Pagination.Ellipsis />

                            <Pagination.Item>{10}</Pagination.Item>
                            <Pagination.Item>{11}</Pagination.Item>
                            <Pagination.Item active>{12}</Pagination.Item>
                            <Pagination.Item>{13}</Pagination.Item>
                            <Pagination.Item>{14}</Pagination.Item>

                            <Pagination.Ellipsis />
                            <Pagination.Item>{20}</Pagination.Item>
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination>
                    </div>
                </div>
            </div>

            {/* <!--- Model Box Add ---> */}    
            <div className='model_box'>
            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} Add Record</Modal.Title>
                </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className='margin: 40px'>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Username</Form.Label>


                                        <Form.Control 
                                        type='text' 
                                        name='username'
                                        placeholder='Enter Username'
                                        value={formInputs.username}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.username} />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                </Col>

                                {/* <Col>

                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={passwordType} 
                                                onChange={handlePasswordChange}
                                                value={passwordInput}
                                                placeholder='Enter Password'
                                                aria-describedby='basic-addon'
                                                required />
                                                <Button className='p-1' id='button-addon' variant='outline-secondary' 
                                                    onClick={togglePassword3}>
                                                        {
                                                            passwordType === 'password'? (
                                                                <FontAwesomeIcon icon={faEye}/> 
                                                            ) : (
                                                                <FontAwesomeIcon icon={faEyeSlash}/>
                                                            )
                                                        }
                                                </Button>
                                            <Form.Control.Feedback type='invalid'>Please enter password.</Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Col> */}
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select name='position_designation' aria-label='Default select example' required>
                                            <option value=''>Select Role</option>
                                            <option value='1'>Regional Director</option>
                                            <option value='2'>Chief Administrative Officer</option>
                                            <option value='3'>Secretary</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type='text' name='first_name' placeholder='Enter First Name' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter first name.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type='text' name='middle_name' placeholder='Enter Middle Name' />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type='text' name='last_name' placeholder='Enter Last Name' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter last name.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='justify-content-md'>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Prefix</Form.Label>
                                        <Form.Control type='text' name='prefix' placeholder='Prefix'/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Suffix</Form.Label>
                                        <Form.Control type='text'  name='suffix' placeholder='Enter Suffix'/>
                                        <Form.Control.Feedback type='invalid'>Please enter suffix.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Position</Form.Label>
                                        <Form.Control type='text' name='position_designation' placeholder='Enter Position' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter position.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
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
                {/* Model Box Finish */}

</div>
                <div className='model_box'>
                    <Modal
                    show={modal.show}
                    onHide={handleHideModal}
                    backdrop='static'
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Record</Modal.Title>
                    </Modal.Header>
                    <Form>
                        <Modal.Body>
                            <Row className='margin: 40px'>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Username' required/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select aria-label='Default select example'>
                                            <option>Select Role</option>
                                            <option value='1'>One</option>
                                            <option value='2'>Two</option>
                                            <option value='3'>Three</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type='text' placeholder='Enter First Name' required/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Middle Name' />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Last Name' required/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='justify-content-md'>
                                <Col >
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Prefix</Form.Label>
                                        <Form.Control type='text' placeholder='Prefix' required/>
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Suffix</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Suffix' required/>
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Position</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Position' required/>
                                    </Form.Group>
                                </Col>
                            </Row>
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
                </div>
            </div>

    );
}



export default Users;