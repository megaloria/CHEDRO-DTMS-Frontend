import React, { useEffect, useState }  from 'react';
import {
    Button,
    Modal,
    Form,
    Table,
    Row,
    Col
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './styles.css';

function Roles() {
    const [data, setData] = useState([]);

    const [modal, setModal] = useState({
        show: false,
        data: null
    });

    useEffect(() => {
        setData([
            {
                id: 1,
                description: 'Regional Director'
            },
            {
                id: 2,
                description: 'Chief Administrative Officer'
            },
            {
                id: 3,
                description: 'Secretary'
            },
            {
                id: 4,
                description: 'Assistant'
            },
        ]);
    }, []);

    //VALIDATION ON ADDING RECORD
    const [validated, setValidated] = useState(false);

    const handleSubmit = event => {
        event.preventDefault();

        setValidated(true);
    };

    const handleShowModal = (data = null) => {
        setModal({
            show: true,
            data
        });
    }

    const handleHideModal = () => {
        setModal({
            show: false,
            data: null
        });
    }

    //MODAL ON ADDING
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
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
                        <h1>Roles</h1>
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
                <div class='table-responsive'>
                    <Table striped bordered hover size='md'>
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
                                            <Button variant='link'>
                                                <FontAwesomeIcon onClick={e => handleShowModal(row)} icon={faEdit} className='text-primary'/>
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
     

            {/* <!--- Model Box ---> */}
            <div className='model_box'>
                <Modal
                    show={show}
                    onHide={handleHideModal}
                    backdrop='static'
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modal.data ? 'Edit' : 'Add'} Role</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className='margin: 40px'>
                                <Col>
                                    <Form.Group className='mb-2' controlId=''>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Description' value={modal.data?.description} />
                                        <Form.Control.Feedback type='invalid'>Please enter description.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleHideModal}>
                                Cancel
                            </Button>
                            <Button type='submit' variant='primary'>
                                {modal.data ? 'Edit' : 'Add'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Model Box Finish */}

            </div>
        </div>
    );
}

export default Roles;