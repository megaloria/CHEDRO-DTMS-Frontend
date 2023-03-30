import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Table,
    Row,
    Col,
    Tab,
    Tabs,
    Pagination,
    Alert,
    Spinner,
    Badge
} from 'react-bootstrap';
import {
    Link
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faCircleArrowRight,
    faRightToBracket,
    faShare,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './styles.css';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../helpers/apiClient';

function Documents() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [documentType, setDocumentType] = useState([]); //document type variable
    const [category, setCategory] = useState([]); //category variable
    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable
    
    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    useEffect(() => {
        apiClient.get('/document', {
            params: {
                query: ''
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.documents);
            setDocumentType(response.data.data.documentType);
            setCategory(response.data.data.category);
            setUsers(response.data.data.user);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });

    }, []);
    

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        apiClient.get(`/document?page=${pageNumber}`, {
            params: {
                query: ''
            }
        }).then(response => {
            setData(response.data.data.documents);
            setDocumentType(response.data.data.documentType);
            setCategory(response.data.data.category);
            setUsers(response.data.data.user);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    };

    //For assigning multiple users 
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
    };

    const options = users.map(user => ({
        value: user.id,
        label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
    }));


    const getDocumentType = (docTypeId) => {
        let docType = documentType.find(div => div.id === docTypeId);
        return docType?.description;
    }

    const getCategory = (categoryId) => {
        let categories = category.find(div => div.id === categoryId);
        return categories?.description;
    }

    const handleShowModal = (data = null) => {

        let userIds = data.assign.filter(l => l.assigned_id);
        userIds = userIds.map(log => {
            return log.assigned_id;
        });
        setSelectedUsers(userIds);
       
        setModal({
            show: true,
            data,
            isLoading: false
        });
    }

    const handleHideModal = () => {
     
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    const handleSearchInputChange = e => {
        setSearchQuery(e.target.value)
    }

    const handleSearch = e => {
        e.preventDefault();

        setIsTableLoading(true);
        apiClient.get('/document', {
            params: {
                query: searchQuery
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.documents);
            setDocumentType(response.data.data.documentType);
            setCategory(response.data.data.category);
            setUsers(response.data.data.user);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    }

    

    // DELETE
    const showDeleteAlert = document => {
        Swal.fire({
            title: `Are you sure you want to delete document no."${document.tracking_no}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.delete(`/document/${document.id}`).then(response => {
                    let newData = data.data.filter(d => d.id !== document.id);
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
        <div className="container fluid">
            <div className="crud rounded">
                <Row className="justify-content-end mt-4">
                    <Col className='title'>
                        <h1>Documents </h1>
                    </Col>
                </Row> 

                <div>
                    <div className='d-md-flex mb-3 justify-content-end'>
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
                                <div className='ms-2'> 
                                <Button  variant="primary" as={Link} to='receive' style={{whiteSpace:'nowrap'}}>
                                    <FontAwesomeIcon icon={faRightToBracket} rotation={90} className="addIcon" /> 
                                    <span className='d-none d-md-inline-block ms-1'> Receive
                                    </span> 
                                </Button>
                                 </div>
                            </Form>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <Tabs
                defaultActiveKey="all"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="all" title="All">

             {
                        data.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Document found.
                            </Alert>
                        ) : (
                            <div className='loading-table-container'>
                        <div className={`table-overlay ${isTableLoading ? 'table-loading' : ''}`}>
                            <div className='spinner-icon'>
                                <Spinner animation='border' />
                            </div>
                        </div>
                    <div className="row">
                                <Table bordered hover responsive size="md" className={isTableLoading ? 'table-loading' : ''}>
                                <thead> 
                                    <tr className="table-primary">
                                        <th>ID</th>
                                        <th>Tracking No.</th>
                                        <th>Document Type</th>
                                        <th>Category</th>
                                        <th>Received From</th>
                                        <th>Date Received</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody >
                            {
                              
                                data.data.map((row, index) => (
                                    <tr key={index}>
                                        <td className="table-primary">{row.id}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{row.tracking_no}</td>
                                        <td>{getDocumentType(row.document_type_id)}</td>
                                        <td>{getCategory(row.category_id)}</td>
                                        <td>{row.sender?.receivable?.title ?? row.sender.name}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{moment(row.date_received).format('MMM DD, YYYY')}</td>
                                        <td >
                                            <div className='text-truncate' style={{ width:'200px' }}>
                                            {row.description}
                                            </div>
                                        </td>
                                        <td>
                                            {row.assign.length > 0 && row.assign[0].assigned_id !== null ? (
                                                <Badge bg="warning">
                                                Assigned to: {row.assign.map(a => a.assigned_user.profile.name).join(", ")}
                                                
                                                </Badge>
                                            ) : (
                                                <Badge bg="primary">Received</Badge>
                                            )}
                                        </td>
                                        
                                        
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            <Button variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                <FontAwesomeIcon icon={faCircleArrowRight} className="" /> View
                                            </Button>
                                
                                            <Button variant="link" size='sm' onClick={e => handleShowModal(row)}>
                                                <FontAwesomeIcon icon={faShare} className="" />
                                            </Button>

                                            <Button variant="link" size='sm' as={Link} to={`edit/${row.id}`} >
                                                <FontAwesomeIcon icon={faEdit} className="text-success" />
                                            </Button>

                                            <Button onClick={e =>showDeleteAlert(row)} variant="link" size='sm' >
                                                <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    </div>

                   
                    </div>

                         )
                    } 
                </Tab>
                                <Tab eventKey="ongoing" title="Ongoing">
                                    <Table bordered hover responsive size="md" className={isTableLoading ? 'table-loading' : ''}>
                                        <thead>
                                            <tr className="table-primary">
                                                <th>ID</th>
                                                <th>Tracking No.</th>
                                                <th>Document Type</th>
                                                <th>Category</th>
                                                <th>Received From</th>
                                                <th>Date Received</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.data.filter(row => row.assign.length > 0 && row.assign[0].assigned_id !== null).map((row, index) => (
                                                <tr key={index}>
                                                    <td className="table-primary">{row.id}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{row.tracking_no}</td>
                                                    <td>{getDocumentType(row.document_type_id)}</td>
                                                    <td>{getCategory(row.category_id)}</td>
                                                    <td>{row.sender?.receivable?.title ?? row.sender.name}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{moment(row.date_received).format('MMM DD, YYYY')}</td>
                                                    <td>
                                                        <div className='text-truncate' style={{ width: '200px' }}>
                                                            {row.description}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {row.assign.length > 0 && row.assign[0].assigned_id !== null ? (
                                                            <Badge bg="warning">
                                                                Assigned
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg="primary">Received</Badge>
                                                        )}
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        <Button variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                            <FontAwesomeIcon icon={faCircleArrowRight} className="" /> View
                                                        </Button>

                                                        <Button variant="link" size='sm' onClick={e => handleShowModal(row)}>
                                                            <FontAwesomeIcon icon={faShare} className="" />
                                                        </Button>

                                                        <Button variant="link" size='sm' as={Link} to={`edit/${row.id}`} >
                                                            <FontAwesomeIcon icon={faEdit} className="text-success" />
                                                        </Button>

                                                        <Button onClick={e => showDeleteAlert(row)} variant="link" size='sm' >
                                                            <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
    
                                </Tab>

                <Tab eventKey="releasing" title="Releasing" >
                </Tab>
                <Tab eventKey="done" title="Done">
                </Tab>
            </Tabs>
            
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

            <Modal
                show={modal.show}
                onHide={handleHideModal}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title> Forward Document </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col md={'auto'}>
                            <Form.Label>Assign to <span className='text-muted'>(Optional)</span>:</Form.Label>
                            <Select
                                isMulti
                                name='assignTo'
                                options={options}
                                value={options.filter(option => selectedUsers.includes(option.value))}
                                onChange={handleUserSelection}
                            />
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='primary' disabled={modal.isLoading}>
                        Forward
                    </Button>
                </Modal.Footer>
            </Modal>

           
        </div>
    );
}

export default Documents;