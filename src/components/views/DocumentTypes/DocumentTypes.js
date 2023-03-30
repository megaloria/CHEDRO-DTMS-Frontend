import React, { useEffect, useState }  from 'react';
import {
    Alert,
    Button, 
    Modal, 
    Form, 
    Table, 
    Row, 
    Col,
    Container,
    Pagination,
    Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faEdit,
    faAdd,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import Validator from 'validatorjs';
import apiClient from '../../../helpers/apiClient';
import './styles.css';


function DocumentTypes() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]); //data variable

    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable

    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({ // input inside the modal
        code: '',
        description: '',
        days: 0
    });

    const [formErrors, setFormErrors] = useState({ // input inside the modal
        code: '',
        description: '',
        days: 0
    });

    useEffect(() => {
        apiClient.get('/settings/document-types', {
            params: {
                query: ''
            }
        }).then(response => { //GET ALL function
            setData(response.data.data);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        apiClient.get(`/settings/document-types?page=${pageNumber}`, {
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

    const handleSubmit = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            code: 'required|string|min:4',
            description: 'required|min:3',
            days:'required|integer|min:1'
            
        });

        if (validation.fails()) {
            setFormErrors({
                code: validation.errors.first('code'),
                description: validation.errors.first('description'),
                days: validation.errors.first('days')
                
            });
            return;
        } else {
            setFormErrors({
                code: '',
                description: '',
                days: 0
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
        apiClient.post('/settings/document-types', {
            ...formInputs
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
        apiClient.post(`/settings/document-types/${modal.data?.id}`, {
            ...formInputs
        }).then(response => {
            let newData = data.data.map(c => {
                if (c.id === response.data.data.id) {
                    return {...response.data.data};
                }
                return {...c};
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
        setSearchQuery(e.target.value)
    }

    const handleSearch = e => {
        e.preventDefault();

        setIsTableLoading(true);
        apiClient.get('/settings/document-types', {
            params: {
                query: searchQuery
            }
        }).then(response => { //GET ALL function
            setData(response.data.data);
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
                code: data.code,
                description: data.description,
                days: data.days,
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
            days: 0
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const showDeleteAlert = DocumentTypes => {
        Swal.fire({
            title: `Are you sure you want to delete "${DocumentTypes.description}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/settings/document-types/${DocumentTypes.id}`).then(response => {
                    let newData = data.data.filter(d => d.id !== DocumentTypes.id);
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
            <Spinner animation='border' />
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
                        <h1>Document Types</h1>
                    </Col>
                </Row> 

                <div> 
                    <div className='d-md-flex mb-3 justify-content-end'>
                        <div className='search'> 
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

                                    <div className='ms-2'> 
                                        <Button variant='primary' onClick={e => handleShowModal()} style={{whiteSpace:'nowrap'}}>
                                            <FontAwesomeIcon icon={faAdd}/> 
                                            <span className='d-none d-md-inline-block ms-1'> Add </span>
                                        </Button>
                                    </div>
                            </Form>
                        </div>
                    </div>
                </div>    
            </div>

            {
                data.data.length === 0 ? (
                    <Alert variant='primary'>
                        No Document Type found.
                    </Alert>
                ) : (
                     <div className='loading-table-container'>
                <div className={`table-overlay ${isTableLoading ? 'table-loading' : ''}`}>
                    <div className='spinner-icon'>
                        <Spinner animation='border' />
                    </div>
                </div>
                <Table bordered hover responsive size='md' className={isTableLoading ? 'table-loading' : ''} >
                    <thead className='table-primary'>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Days</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.data.map((row, index) => (
                                <tr key={index}>
                                    <td className='table-primary'>{row.id}</td>
                                    <td>{row.code}</td>
                                    <td>{row.description}</td>
                                    <td>{row.days}</td>
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
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.data ? 'Edit' : 'Add'} Document Types</Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className='mb-2'>
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type='text'
                                name='code'
                                placeholder='Enter code'
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
                            <Form.Label>Days</Form.Label>
                            <Form.Control
                                type='inetger'
                                name='days'
                                placeholder='Enter number of days'
                                value={formInputs.days}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.days} />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.days}
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

export default DocumentTypes;