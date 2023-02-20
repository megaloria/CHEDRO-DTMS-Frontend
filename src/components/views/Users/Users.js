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
    InputGroup
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd,
    faSpinner,
    faRotate,
    faEye,
    faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function Roles() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]); //data variable
    const [username, setUsers] = useState([]); //division variable

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        username: '',
        password: '',
        role: '',
        firstname: '',
        middlename: '',
        lastname: '',
        prefix: '',
        suffix: '',
        position: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        username: '',
        password: '',
        role: '',
        firstname: '',
        middlename: '',
        lastname: '',
        prefix: '',
        suffix: '',
        position: ''
    });

    useEffect(() => {
        apiClient.get('/home/users').then(response => { //GET ALL function
            setData(response.data.data.users);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            username: 'min:1',
            password: 'min:1',
            role: 'min:1',
            firstname: 'min:2',
            middlename: 'min:1',
            lastname: 'min:1',
            prefix: 'min:2',
            suffix: 'min:1',
            position: 'min:1'
        });

        if (validation.fails()) {
            setFormErrors({
                username: validation.errors.first('username'),
                password: validation.errors.first('password'),
                role: validation.errors.first('role'),
                firstname: validation.errors.first('firstname'),
                middlename: validation.errors.first('middlename'),
                lastname: validation.errors.first('lastname'),
                prefix: validation.errors.first('prefix'),
                suffix: validation.errors.first('suffix'),
                position: validation.errors.first('position')
            });
            return;
        } else {
            setFormErrors({
                username: '',
                password: '',
                role: '',
                firstname: '',
                middlename: '',
                lastname: '',
                prefix: '',
                suffix: '',
                position: ''
            });
        }

        setModal({
            ...modal,
            isLoading: true
        });
        if (modal.data === null) {
            handleAdd();
        }
    };

    const handleAdd = () => {
        apiClient.post('/home/users', {
            ...formInputs,
            user_id: formInputs.users
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
        apiClient.post(`/settings/roles/${modal.data?.id}`, {
            ...formInputs,
            division_id: formInputs.division
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
                division: data.division_id,
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
        let division = username.find(div => div.id === divisionId);
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
                return apiClient.delete(`/home/users/${role.id}`).then(response => {
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

    // SHOW PASSWORD
    const [passwordType, setPasswordType] = useState('password');
    const [passwordInput, setPasswordInput] = useState('');

    const handlePasswordChange = evnt => {
        setPasswordInput(evnt.target.value);
    }
    const togglePassword3 = () => {
        if(passwordType === 'password') {
            setPasswordType('text');
            return;
        }
        setPasswordType('password')
    }

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
                        data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{getDivisionDescription(row.division_id)}</td>
                                <td>{row.description}</td>
                                <td>{row.level}</td>
                                <td>
                                    <Button onClick={""} variant='link'>
                                        <FontAwesomeIcon icon={faEdit} className='text-primary'/>
                                    </Button>
                                    <Button onClick={""} variant='link'>
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
                    <Modal.Title>Add role</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                    <Row className='margin: 40px'>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter Username' 
                                name='username' 
                                value={formInputs.username}/>
                                <Form.Control.Feedback type='invalid'>
                                {formErrors.username}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={passwordType} 
                                        onChange={handlePasswordChange}
                                        placeholder='Enter Password'
                                        aria-describedby='basic-addon'
                                        name='password' 
                                        value={formInputs.password} />
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
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.password}
                                        </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2' controlId=''>
                                <Form.Label>Role</Form.Label>
                                <Form.Select name='' aria-label='Default select example' >
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
                            <Form.Group className='mb-2'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter First Name' 
                                name='firstname'
                                value={formInputs.firstname}/>
                                <Form.Control.Feedback type='invalid'>
                                {formErrors.firstname}
                            </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter Middle Name'
                                name='middlename'
                                value={formInputs.middlename}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter Last Name' name='lastname'
                                value={formInputs.lastname}/>
                                <Form.Control.Feedback type='invalid'>
                                {formErrors.lastname}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='justify-content-md'>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Prefix</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Prefix'
                                name='prefix'
                                value={formInputs.prefix}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Suffix</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter Suffix'
                                name='suffix'
                                value={formInputs.suffix}/>
                                <Form.Control.Feedback type='invalid'>
                                {formErrors.suffix}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-2'>
                                <Form.Label>Position</Form.Label>
                                <Form.Control 
                                type='text' 
                                placeholder='Enter Position' 
                                name='position'
                                value={formInputs.position}/>
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
                        <Button type='submit' variant='primary' disabled={modal.isLoading}>
                            {modal.data} Add
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default Roles;