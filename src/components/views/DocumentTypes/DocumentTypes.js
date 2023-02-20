import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Modal, 
    Form, 
    Table, 
    Row, 
    Col,
    Alert
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faAdd,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './styles.css';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';

function DocumentTypes() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        code: '',
        description: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        code: '',
        description: ''
    });

    useEffect(() => {
        apiClient.get('/settings/document-types').then(response => { //GET ALL function
            setData(response.data.data.documents);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);
    
    // const handleSubmit = event => {
    //     event.preventDefault();

    //     let validation = new Validator(formInputs, {
    //         description: 'required|min:2',
    //         code: 'required|string|min:4'
    //     });

    //     if (validation.fails()) {
    //         setFormErrors({
    //             description: validation.errors.first('description'),
    //             code: validation.errors.first('code'),
    //         });
    //         return;
    //     } else {
    //         setFormErrors({
    //             description: '',
    //             code: ''
    //         });
    //     }

    //     setModal({
    //         ...modal,
    //         isLoading: true
    //     });
    //     if (modal.data !== null) {
    //         handleEdit();
    //     } else {
    //         handleAdd();
    //     }
    // };

    // const handleAdd = () => {
    //     apiClient.post('/settings/document-types', {
    //         ...formInputs,
    //         division_id: formInputs.division
    //     }).then(response => {
    //         setData([
    //             ...data,
    //             response.data.data
    //         ]);
    //         Swal.fire({
    //             title: 'Success',
    //             text: response.data.message,
    //             icon: 'success'
    //         }).then(() => {
    //             handleHideModal();
    //         });
    //     }).catch(error => {
    //         Swal.fire({
    //             title: 'Error',
    //             text: error,
    //             icon: 'error'
    //         });
    //     }).finally(() => {
    //         setModal({
    //             ...modal,
    //             isLoading: false
    //         });
    //     });
    // }

    //  const handleEdit = () => {
    //     apiClient.post(`/settings/roles/${modal.data?.id}`, {
    //         ...formInputs,
    //         division_id: formInputs.division
    //     }).then(response => {
    //         let newData = data.map(d => {
    //             if (d.id === response.data.data.id) {
    //                 return {...response.data.data};
    //             }

    //             return {...d};
    //         })
    //         setData(newData);
    //         Swal.fire({
    //             title: 'Success',
    //             text: response.data.message,
    //             icon: 'success'
    //         }).then(() => {
    //             handleHideModal();
    //         });
    //     }).catch(error => {
    //         Swal.fire({
    //             title: 'Error',
    //             text: error,
    //             icon: 'error'
    //         });
    //     }).finally(() => {
    //         setModal({
    //             ...modal,
    //             isLoading: false
    //         });
    //     });
    // }

    // const handleInputChange = e => {
    //     setFormInputs({
    //         ...formInputs,
    //         [e.target.name]: e.target.value
    //     });
    // }

    // const handleShowModal = (data = null) => {
    //     if (data !== null) {
    //         setFormInputs({
    //             ...formInputs,
    //             division: data.division_id,
    //             description: data.description,
    //             level: data.level
    //         });
    //     }

    //     setModal({
    //         show: true,
    //         data,
    //         isLoading: false
    //     });
    // }

    // const handleHideModal = () => {
    //     setFormInputs({
    //         division: '',
    //         description: '',
    //         level: 0
    //     });
    //     setModal({
    //         show: false,
    //         data: null,
    //         isLoading: false
    //     });
    // }






    // useEffect(() => {
    //     setData([
    //         {
    //             id: 1,
    //             code: 'DF3FDAS2',
    //             description: 'Regional Director'
    //         },
    //         {
    //             id: 2,
    //             code: 'SDFJS323',
    //             description: 'Chief Administrative Officer'
    //         },
    //         {
    //             id: 3,
    //             code: 'SAF311',
    //             description: 'Secretary'
    //         },
    //         {
    //             id: 4,
    //             code: 'DFS3D3',
    //             description: 'Assistant'
    //         },
    //     ]);
    // }, []);

    //VALIDATION ON ADDING
    const [validated, setValidated] = useState(false);

    const handleSubmit = event => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            setValidated(true);
    };

    //MODAL ON ADDING
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };

    //MODAL ON EDIT
    const [show2, setShow2] = useState(false);
 
    const handleClose2 = () => {
        setShow2(false)
    };
    const handleShow2 = () => {
        setShow2(true)
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
            confirmButtonText: 'Yes, delete it!',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/document-types/${document.id}`).then(response => {
                    let newData = data.filter(d => d.id !== document.id);
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
                        <h1>Document Types</h1>
                    </Col>
                    <Col md='auto'>
                        <div className='search'>
                                <Form className='mb-3' controlId=''>
                                    <Form.Control type='search' placeholder='Search' />
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
                <div class='table-responsive'>
                    <Table striped bordered hover size='md'>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Description</th>
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
                                        <td>
                                            <Button variant='link'>
                                                <FontAwesomeIcon onClick={handleShow2} icon={faEdit} className='text-primary'/>
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
                </div>   
            </div>
     
            {/* <!--- Model Box ADD ---> */}
            <div className='model_box'>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop='static'
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add</Modal.Title>
                    </Modal.Header>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className='margin: 40px'>
                                <Col md={3}>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Code' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter code.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Description' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter description.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type='submit' variant='primary'>
                                Add 
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Model Box Finish */}

        {/* <!--- Model Box EDIT ---> */}
                <div className='model_box'>
                    <Modal
                        show={show2}
                        onHide={handleClose2}
                        backdrop='static'
                        keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit</Modal.Title>
                        </Modal.Header>
                        <Form>
                            <Modal.Body>
                                <Row className='margin: 40px'>
                                    <Col>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control type='text' placeholder='Enter Description' required/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose2}>
                                    Cancel
                                </Button>
                                <Button variant='primary'>
                                    Done 
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                    {/* Model Box Finish */}

                </div>
            </div>
        </div>
    );
}

export default DocumentTypes;