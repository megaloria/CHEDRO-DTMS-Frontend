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
    Badge,
    Pagination,
    Alert
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
    faSearch,
    faSpinner
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
    const [dateReceived, setDateReceived] = useState([]);
    const [documentType, setDocumentType] = useState([]); //document type variable
    const [category, setCategory] = useState([]); //category variable
    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable
    
    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({});

    //For assigning multiple users 
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
    };

    const options = users.map(user => ({
        value: user.id,
        label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
    }));

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
            setDateReceived(response.data.data.dateReceived);
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
            setDateReceived(response.data.data.dateReceived);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    };

    const getDocumentType = (docTypeId) => {
        let docType = documentType.find(div => div.id === docTypeId);
        return docType?.description;
    }

    const getCategory = (categoryId) => {
        let categories = category.find(div => div.id === categoryId);
        return categories?.description;
    }

    const handleShowModal = (data = null) => {
        if (data !== null) {
            setFormInputs({
                ...formInputs,
                // description: data.description
            });
        }

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
            setDateReceived(response.data.data.dateReceived);
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
        <div class="container fluid">
            <div className="crud rounded">
                <Row className="justify-content-end mt-4 mb-3">
                    <Col>
                        <h1>Documents</h1>
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
                    <Col md="auto">
                        <Button variant="primary" as={Link} to='receive'>
                            <FontAwesomeIcon icon={faRightToBracket} rotation={90} className="addIcon" /> Received
                        </Button>
                    </Col>
                </Row>
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
                                <FontAwesomeIcon icon={faSpinner} spin size='lg' />
                            </div>
                        </div>
                    <div class="row">
                        <div class="table-responsive " >
                                <Table striped bordered hover size="md" className={isTableLoading ? 'table-loading' : ''}>
                                <thead>
                                    <tr>
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
                            {
                                data.data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.id}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{row.tracking_no}</td>
                                        <td>{getDocumentType(row.document_type_id)}</td>
                                        <td>{getCategory(row.category_id)}</td>
                                        <td>{row.sender.receivable.description || row.sender.receivable.name}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{moment(row.date_received).format('MMM DD, YYYY')}</td>
                                        <td >
                                            <div className='text-truncate' style={{ width:'200px' }}>
                                            {row.description}
                                            </div>
                                        </td>
                                        {/* <td className="p-0 m-2">
                                    <Button variant="link">
                                        <FontAwesomeIcon icon={faPaperclip} className="text-primary ml-2"/> {row.attach}
                                    </Button>
                                    </td> */}

                                                <td>{
                                                    row.status === 'Acknowledge' & (
                                                        <>
                                                            <Badge bg="info" >
                                                                {row.status}
                                                            </Badge>
                                                        </>
                                                    ) || row.status === 'Forwarded to RD' & (
                                                        <>
                                                            <Badge bg="warning" >
                                                                {row.status}
                                                            </Badge>
                                                        </>
                                                    )
                                                    || row.status === 'Received' & (
                                                        <>
                                                            <Badge bg="primary">
                                                                {row.status}
                                                            </Badge>
                                                        </>
                                                    )
                                                }
                                                </td>

                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    <Button variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                        <FontAwesomeIcon icon={faCircleArrowRight} className="" /> View
                                                    </Button>
                                                    {
                                                        row.status !== 'Acknowledge' && (
                                                            <>
                                                                {
                                                                    row.status === 'Received' && (
                                                                        //Forward
                                                                        <Button variant="link" size='sm' onClick={e => handleShowModal()}>
                                                                            <FontAwesomeIcon icon={faShare} className="" />
                                                                        </Button>
                                                                    )
                                                                }

                                                                <Button variant="link" size='sm' onClick={e => handleShowModal()}>
                                                                    <FontAwesomeIcon icon={faShare} className="" />
                                                                </Button>

                                                                <Button variant="link" size='sm' as={Link} to={`edit/${row.id}`} >
                                                                    <FontAwesomeIcon icon={faEdit} className="text-success" />
                                                                </Button>

                                                                <Button onClick={e =>showDeleteAlert(row)} variant="link" size='sm' >
                                                                    <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                                </Button>

                                                            </>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>

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
                    
                </Tab>
                <Tab eventKey="ongoing" title="Ongoing" >
                </Tab>
                <Tab eventKey="releasing" title="Releasing" >
                </Tab>
                <Tab eventKey="done" title="Done">
                </Tab>
            </Tabs>

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
                            <Form.Label>Select assign to:</Form.Label>
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