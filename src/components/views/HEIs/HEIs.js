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

function Heis() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        uii: 0,
        name: '',
        address: '',
        head_of_institution: ''
    });

    const [formErrors, setFormErrors] = useState({ //errors for the inputs in the modal
        uii: 0,
        name: '',
        address: '',
        head_of_institution: ''
    });

    useEffect(() => {
        apiClient.get('/settings/heis').then(response => { //GET ALL function
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
            uii : 'required|integer',
            name: 'required|string|min:5',
            address: 'required|string',
            head_of_institution: 'required|string|min:5'
        });

        if (validation.fails()) {
            setFormErrors({
                uii: validation.errors.first('uii'),
                name: validation.errors.first('name'),
                address: validation.errors.first('address'),
                head_of_institution: validation.errors.first('head_of_institution')
            });
            return;
        } else {
            setFormErrors({
                uii: 0,
                name: '',
                address: '',
                head_of_institution: ''
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
        apiClient.post('/settings/heis', {
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
        apiClient.post(`/settings/heis/${modal.data?.id}`, {
            ...formInputs
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
                uii: data.uii,
                name: data.name,
                address: data.address,
                head_of_institution: data.head_of_institution
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
            uii: 0,
            name: '',
            address: '',
            head_of_institution: ''
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const showDeleteAlert = hei => {
        Swal.fire({
            title: `Are you sure you want to delete "${hei.name}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/heis/${hei.id}`).then(response => {
                    let newData = data.filter(d => d.id !== hei.id);
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

    // useEffect(() => {
    //     setData([
    //         {
    //             id: 1,
    //             uii: 122423,
    //             name: 'Roel Cristobal',
    //             address: '545, Santiago, Malvar, Batangas',
    //             headofins: 'Regional Director'
    //         },
    //         {
    //             id: 2,
    //             uii: 113243,
    //             name: 'Roel Cristobal',
    //             address: '123, Santiago, Malvar, Batangas',
    //             headofins: 'Chief Administrative Officer'
    //         },
    //         {
    //             id: 3,
    //             uii: 132423,
    //             name: 'Roel Cristobal',
    //             address: '543, Santiago, Malvar, Batangas',
    //             headofins: 'Secretary'
    //         },
    //         {
    //             id: 4,
    //             uii: 12513,
    //             name: 'Roel Cristobal',
    //             address: '636, Santiago, Malvar, Batangas',
    //             headofins: 'Assistant'
    //         },
    //     ]);
    // }, []);

    //VALIDATION ON ADDING
    // const [validated, setValidated] = useState(false);

    // const handleSubmit = event => {
    //     const form = event.currentTarget;
    //         if (form.checkValidity() === false) {
    //             event.preventDefault();
    //             event.stopPropagation();
    //         }
    //     setValidated(true);
    // };

     //MODAL ADD
    // const [show, setShow] = useState(false);

    // const handleClose = () => {
    //     setShow(false)
    // };
    // const handleShow = () => {
    //     setShow(true)
    // };

    // //MODAL EDIT
    // const [show2, setShow2] = useState(false);
 
    // const handleClose2 = () => {
    //     setShow2(false)
    // };
    // const handleShow2 = () => {
    //     setShow2(true)
    // };

    // // DELETE
    // const showAlert = () => {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: 'You won\'t be able to revert this!',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //         Swal.fire(
    //             'Deleted!',
    //             'Your file has been deleted.',
    //             'success'
    //             );
    //         }
    //     });
    // };

    return (
        <div class='container fluid'>
            <div className='crud bg-body rounded'> 
                <Row className= 'justify-content-end mt-4 mb-3'>
                    <Col>
                        <h1>HEIs</h1>
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
                                <th>UII</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Head of Institution</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.id}</td>
                                        <td>{row.uii}</td>
                                        <td>{row.name}</td>
                                        <td>{row.address}</td>
                                        <td>{row.head_of_institution}</td>
                                        <td>
                                            <Button onClick={e => handleShowModal(row)} variant='link'>
                                                <FontAwesomeIcon  icon={faEdit} className='text-primary'/>
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
            </div>

            {/* <!--- Model Box ADD and EDIT ---> */}
            <div className='model_box'>
                <Modal
                    show={modal.show}
                    onHide={handleHideModal}
                    backdrop='static'
                    keyboard={false}>
                    <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} HEI</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>UII</Form.Label>
                                        <Form.Control  
                                            type='number' 
                                            name='uii' 
                                            placeholder='Enter UII'
                                            value={formInputs.uii} 
                                            onChange={handleInputChange}
                                            isInvalid={!!formErrors.uii} />
                                        <Form.Control.Feedback type='invalid'>{formErrors.uii}.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control 
                                            type='text' 
                                            placeholder='Enter Institution Name'
                                            name='name'
                                            value={formInputs.name}
                                            isInvalid={!!formErrors.name}
                                            onChange={handleInputChange}  />
                                        <Form.Control.Feedback type='invalid'>
                                            {formErrors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control 
                                            type='text' 
                                            placeholder='Enter Institution Address' 
                                            name='address'
                                            value={formInputs.address}
                                            isInvalid={!!formErrors.address}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                             {formErrors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>City/Municipality</Form.Label>
                                        <Form.Control type='text' placeholder='Enter City/Municipality' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter city/municipality.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Province</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Province' required/>
                                        <Form.Control.Feedback type='invalid'>Please enter province.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col> */}
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Head of Institution</Form.Label>
                                        <Form.Control 
                                            type='text' 
                                            placeholder='Enter Head of Institution' 
                                            name='head_of_institution'
                                            value={formInputs.head_of_institution}
                                            isInvalid={!!formErrors.head_of_institution}
                                            onChange={handleInputChange} />
                                        <Form.Control.Feedback type='invalid'>
                                             {formErrors.head_of_institution}
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
                            {modal.data ? 'Edit' : 'Add'} 
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Model Box Finish */}

                {/* <!--- Model Box EDIT ---> */}
                {/* <div className='model_box'>
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
                                <Row>
                                    <Col md={3}>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>UII</Form.Label>
                                            <Form.Control  type='text' placeholder='Enter UII' required/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type='text' placeholder='Enter Name' required/>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>Streets/Barangay</Form.Label>
                                            <Form.Control type='text' placeholder='Streets/Barangay' required/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>City/Municipality</Form.Label>
                                            <Form.Control type='text' placeholder='Enter City/Municipality' required/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>Province</Form.Label>
                                            <Form.Control type='text' placeholder='Enter Province' required/>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className='mb-2' controlId=''>
                                            <Form.Label>Head of Institution</Form.Label>
                                            <Form.Control type='text' placeholder='Enter Head of Institution' required/>
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
                    Model Box Finish */}
                </div>
            </div>
        
    );
}

export default Heis;