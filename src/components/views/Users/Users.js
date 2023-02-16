import React,{ useEffect, useState }  from 'react';
import {
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
    faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './style.css';

function Users() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                id: 1,
                Username: 'qwerty237',
                Name: 'Cristobal Roel',
                Position: 'Regional Director',
            },
            {
                id: 2,
                Username: 'dfdhgf123',
                Name: 'Limbo Vince Brian',
                Position: 'Chief Administrative Officer',
            },
            {
                id: 3,
                Username: 'asdwrq634',
                Name: 'Baruelo Berth Anthony',
                Position: 'Secretary',
            },
            {
                id: 4,
                Username: 'vnvbnvb4473',
                Name: 'Madamba Prinz Gerard',
                Position: 'Assistant',
            },
        ]);
    }, []);

    //VALIDATION ON ADDING RECORD
    const [validated, setValidated] = useState(false);

    const handleSubmit = event => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            setValidated(true);
    };

    // SHOW PASSWORD
    const [passwordShown, setPasswordShown] = useState(false);

        const togglePassword = () => {
       
        setPasswordShown(!passwordShown);
    };

    // ADD CREATE
    const [show, setShow] = useState(false);
 
    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
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

    // Change Password
    const [show2, setShow2] = useState(false);
 
    const handleClose2 = () => {
        setShow2(false)
    };
    const handleShow2 = () => {
        setShow2(true)
    };

    // Edit Record
    const [show3, setShow3] = useState(false);
 
    const handleClose3 = () => {
        setShow3(false)
    };
    const handleShow3 = () => {
        setShow3(true)
    };

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
                        <Button variant='primary' onClick={handleShow}>
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
                                <th>Name </th>
                                <th>Position/Designation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.Username}</td>
                                    <td>{row.Name}</td>
                                    <td>{row.Position}</td>
                                    <td>
                                    <Button onClick={handleShow3} variant='link'>
                                        <FontAwesomeIcon icon={faEdit} className='text-primary'/></Button>
                                    <Button onClick={handleShow2} variant='link'>
                                        <FontAwesomeIcon icon={faRotate} className='text-success'/></Button>
                                    <Button onClick={showAlert} variant='link'>
                                        <FontAwesomeIcon icon={faTrash} className='text-danger'/></Button>
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
                    show={show}
                    onHide={handleClose}
                    backdrop='static'
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Record</Modal.Title>
                    </Modal.Header>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className='margin: 40px'>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Username' required/>
                                        <Form.Control.Feedback type='invalid'>Please choose a username.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col>
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
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select name='' aria-label='Default select example' required>
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
                                        <Form.Control type='text' placeholder='Enter First Name' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter first name.</Form.Control.Feedback>
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
                                        <Form.Control.Feedback type='invalid'>Please enter last name.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='justify-content-md'>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Prefix</Form.Label>
                                        <Form.Control type='text' placeholder='Prefix'/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Suffix</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Suffix'/>
                                        <Form.Control.Feedback type='invalid'>Please enter suffix.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Position</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Position' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter position.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type='submit' variant='primary'>
                                Add Record 
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Model Box Finish */}

                {/* <!--- Model Box Edit ---> */}
                <div className='model_box'>
                    <Modal
                        show={show3}
                        onHide={handleClose3}
                        backdrop='static'
                        keyboard={false}
                    >
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
                            <Button variant='secondary' onClick={handleClose3}>
                                Cancel
                            </Button>
                            <Button variant='primary'>
                                Done
                            </Button>
                        </Modal.Footer>
                        </Form>
                    </Modal>
                {/* Model Box Finish */}

                    <div className='model_box'>
                        <Modal
                            show={show2}
                            onHide={handleClose2}
                            backdrop='static'
                            keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Change Password</Modal.Title>
                            </Modal.Header>
                            <Form>
                                <Modal.Body>
                                    <Row className='margin: 40px'>
                                        <Col>
                                            <Form.Group className='mb-2' controlId=''>
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control 
                                                    type={passwordShown ? 'text' : 'password'} 
                                                    placeholder='Enter Password' 
                                                    required 
                                                />
                                            </Form.Group>
                                            <Form.Group className='mb-3' controlId=''>
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control 
                                                    type={passwordShown ? 'text' : 'password'} 
                                                    placeholder='Enter Confirm Password' 
                                                    required 
                                                />
                                            </Form.Group>
                                            <Form.Group className='mb-2' controlId=''>
                                                <Form.Check onClick={togglePassword} type='checkbox' label='Show Password' />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant='secondary' onClick={handleClose2}>
                                        Cancel
                                    </Button>
                                    <Button variant='primary'>
                                        Reset Password
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Users;