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
    Badge,
    OverlayTrigger,
    Popover,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {
    Link, useNavigate
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faCircleArrowRight,
    faRightToBracket,
    faShare,
    faSearch,
    faThumbsUp
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './styles.css';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../helpers/apiClient';

function Documents() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState({ data: [] });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    useEffect(() => {
        setIsTableLoading(true);
        if (activeTab === 'all'){
            apiClient.get('/document', {
            params: {
                query: ''
            }
            }).then(response => { //GET ALL function
                setData(response.data.data.documents);
                setUsers(response.data.data.user);
            }).catch(error => {
                setErrorMessage(error);
            }).finally(() => {
                setIsTableLoading(false);
                setIsLoading(false);
            });
        } 
        if (activeTab === 'ongoing') {
            apiClient.get('/document/ongoing', {
                params: {
                    query: ''
                }
            }).then(response => { //GET ALL function
                setData(response.data.data.documents);
                setUsers(response.data.data.user);
            }).catch(error => {
                setErrorMessage(error);
            }).finally(() => {
                setIsTableLoading(false);
                setIsLoading(false);
            });
        }
    }, [activeTab]);

   

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        apiClient.get(`/document?page=${pageNumber}`, {
            params: {
                query: ''
            }
        }).then(response => {
            setData(response.data.data.documents);
            setUsers(response.data.data.user);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    };

    const [isValid, setIsValid] = useState(true);

    //For assigning multiple users 
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
        // Update the form validity
        setIsValid(selectedOptions.length > 0);
    };

    const options = users.map(user => ({
        value: user.id,
        label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
    }));

    const selectedOptions = options.filter(option => selectedUsers.includes(option.value));

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

        setIsValid(true);

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
        apiClient.get(`/document/${activeTab === 'all' ? '' : activeTab}`, {
            params: {
                query: searchQuery
            }
        }).then(response => { //GET ALL function
            setData(response.data.data.documents);
            setUsers(response.data.data.user);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsTableLoading(false);
        });
    }

    const handleChangeTab = (key) => {
        setActiveTab(key);
    }

   // ACKNOWLEDGE
   const showAcknowledgeAlert = document => {
    Swal.fire({
        title: `Are you sure you want to Acknowledge the document no."${document.tracking_no}"?`,
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, acknowledge it!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return apiClient.post(`/document/${document.id}/acknowledge`).then(response => {
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

    const handleForward = event => {

        const formData = new FormData();

        for (let i = 0; i < selectedUsers.length; i++) {
            formData.append(`assign_to[${i}]`, selectedUsers[i]);
        }

        apiClient.post(`/document/${modal.data?.id}/forward`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            navigate('../');
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
        }).catch(error => {
            setIsValid(false);
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
                                    <Button variant="primary" as={Link} to='receive' style={{ whiteSpace: 'nowrap' }}>
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
                activeKey={activeTab}
                id="uncontrolled-tab-example"
                className="mb-3"
                onSelect={handleChangeTab}
            >
                <Tab eventKey="all" title="All">

                    {
                        data.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Documents found.
                            </Alert>
                        ) : isTableLoading ? (
                            <Spinner animation='border' />
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
                                                        <td>{row.document_type.description}</td>
                                                        <td>{row.category.description}</td>
                                                        <td>{row.sender?.receivable?.title ?? row.sender.name}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{moment(row.date_received).format('MMM DD, YYYY')}</td>
                                                        <td >
                                                            <div className='text-truncate' style={{ width: '180px' }}>
                                                                {row.description}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {row.assign.length > 0 && row.assign[0].assigned_id !== null && row.logs.length > 0 && row.logs[0].to_id !== null ? (
                                                                <OverlayTrigger
                                                                    trigger={['click', 'hover']}
                                                                    placement="left"
                                                                    overlay={
                                                                        <Popover>
                                                                            <Popover.Header className="bg-warning text-white">
                                                                                Forwarded to
                                                                            </Popover.Header>
                                                                            <Popover.Body>
                                                                                <ListGroup variant="flush">
                                                                                    {row.assign.map((assign, index) => (
                                                                                        <ListGroupItem
                                                                                            variant="warning text-black"
                                                                                            key={assign.assigned_user.profile.id}
                                                                                        >
                                                                                            {assign.assigned_user.profile.name}
                                                                                        </ListGroupItem>
                                                                                    ))}
                                                                                </ListGroup>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded</Badge>
                                                                </OverlayTrigger>
                                                            ) : (
                                                                row.assign.length > 0 && row.assign[0].assigned_id !== null ? (
                                                                    <OverlayTrigger
                                                                        trigger={['click', 'hover']}
                                                                        placement="left"
                                                                        overlay={
                                                                            <Popover>
                                                                                <Popover.Header className="bg-primary text-white">
                                                                                    Assigned to
                                                                                </Popover.Header>
                                                                                <Popover.Body>
                                                                                    <ListGroup variant="flush">
                                                                                        {row.assign.map((assign, index) => (
                                                                                            <ListGroupItem
                                                                                                variant="primary text-black"
                                                                                                key={assign.assigned_user.profile.id}
                                                                                            >
                                                                                                {assign.assigned_user.profile.name}
                                                                                            </ListGroupItem>
                                                                                        ))}
                                                                                    </ListGroup>
                                                                                </Popover.Body>
                                                                            </Popover>
                                                                        }
                                                                    >
                                                                        <Badge bg="primary" style={{ cursor: 'pointer' }}>Received</Badge>
                                                                    </OverlayTrigger>
                                                                ) : (
                                                                    <Badge bg="primary">Received</Badge>
                                                                )
                                                            )}

                                                        </td>

                                                        <td style={{ whiteSpace: 'nowrap' }}>
                                                            <Button variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                                <FontAwesomeIcon icon={faCircleArrowRight} className="" /> View
                                                            </Button>

                                                            {row.assign.length > 0 && row.assign[0].assigned_id === row.user_id ? (
                                                            <Button variant="link" size='sm' onClick={e => showAcknowledgeAlert(row)}>
                                                                <FontAwesomeIcon icon={faThumbsUp} className='text-success'/>
                                                            </Button>
                                                            ) : null}
                                                        
                                                            {row.category_id === 1 || row.category_id === 2 ? (
                                                                <Button variant="link" size='sm' onClick={e => handleShowModal(row)}>
                                                                <FontAwesomeIcon icon={faShare} className="" />
                                                            </Button>
                                                            ) : null}

                                                            {row.logs.some(log => log.acknowledge_id !== null) ? (
                                                                null
                                                            ) : <Button variant="link" size='sm' as={Link} to={`edit/${row.id}`} >
                                                                <FontAwesomeIcon icon={faEdit} className="text-success" />
                                                            </Button>}

                                                            {!row.logs || row.logs.length === 0 ? (
                                                                <Button onClick={e => showDeleteAlert(row)} variant="link" size="sm">
                                                                    <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                                </Button>
                                                            ) : null}
                                                        </td>
                                                    </tr>

                                                ))
                                            }
                                        </tbody>
                                    </Table>
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
                <Tab eventKey="ongoing" title="Ongoing">
                    {
                        data.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Ongoing Documents found.
                            </Alert>
                        ) : isTableLoading ? (
                                <Spinner animation='border' />
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
                                        <tbody>
                                            {data.data.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="table-primary">{row.id}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{row.tracking_no}</td>
                                                    <td>{row.document_type.description}</td>
                                                    <td>{row.category.description}</td>
                                                    <td>{row.sender?.receivable?.title ?? row.sender.name}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{moment(row.date_received).format('MMM DD, YYYY')}</td>
                                                    <td>
                                                        <div className='text-truncate' style={{ width: '180px' }}>
                                                            {row.description}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {row.assign.length > 0 && row.assign[0].assigned_id !== null && row.logs.length > 0 && row.logs[0].to_id !== null ? (
                                                            <OverlayTrigger
                                                                trigger={['click', 'hover']}
                                                                placement="left"
                                                                overlay={
                                                                    <Popover>
                                                                        <Popover.Header className="bg-warning text-white">
                                                                            Forwarded to
                                                                        </Popover.Header>
                                                                        <Popover.Body>
                                                                            <ListGroup variant="flush">
                                                                                {row.assign.map((assign, index) => (
                                                                                    <ListGroupItem
                                                                                        variant="warning text-black"
                                                                                        key={assign.assigned_user.profile.id}
                                                                                    >
                                                                                        {assign.assigned_user.profile.name}
                                                                                    </ListGroupItem>
                                                                                ))}
                                                                            </ListGroup>
                                                                        </Popover.Body>
                                                                    </Popover>
                                                                }
                                                            >
                                                                <Badge bg="warning" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Forwarded</Badge>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            row.assign.length > 0 && row.assign[0].assigned_id !== null ? (
                                                                <OverlayTrigger
                                                                    trigger={['click', 'hover']}
                                                                    placement="left"
                                                                    overlay={
                                                                        <Popover>
                                                                            <Popover.Header className="bg-primary text-white">
                                                                                Assigned to
                                                                            </Popover.Header>
                                                                            <Popover.Body>
                                                                                <ListGroup variant="flush">
                                                                                    {row.assign.map((assign, index) => (
                                                                                        <ListGroupItem
                                                                                            variant="primary text-black"
                                                                                            key={assign.assigned_user.profile.id}
                                                                                        >
                                                                                            {assign.assigned_user.profile.name}
                                                                                        </ListGroupItem>
                                                                                    ))}
                                                                                </ListGroup>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg="primary" style={{ cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>Received</Badge>
                                                                </OverlayTrigger>
                                                            ) : (
                                                                <Badge bg="primary" style={{ alignItems: 'center', justifyContent: 'center' }}>Received</Badge>
                                                            )
                                                        )}
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        <Button variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                            <FontAwesomeIcon icon={faCircleArrowRight} className="" /> View
                                                        </Button>

                                                        {row.assign.length > 0 && row.assign[0].assigned_id === row.user_id ? (
                                                            <Button variant="link" size='sm' onClick={e => showAcknowledgeAlert(row)}>
                                                                <FontAwesomeIcon icon={faThumbsUp} className='text-success'/>
                                                            </Button>
                                                            ) : null}

                                                        {row.category_id === 1 || row.category_id === 2 ? (
                                                            <Button variant="link" size='sm' onClick={e => handleShowModal(row)}>
                                                                <FontAwesomeIcon icon={faShare} className="" />
                                                            </Button>
                                                        ) : null}

                                                        <Button variant="link" size='sm' as={Link} to={`edit/${row.id}`} >
                                                            <FontAwesomeIcon icon={faEdit} className="text-success" />
                                                        </Button>

                                                        {!row.logs || row.logs.length === 0 ? (
                                                            <Button onClick={e => showDeleteAlert(row)} variant="link" size="sm">
                                                                <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                            </Button>
                                                        ) : null}

                                                    </td>
                                                </tr>
                                            ))}
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
                            </div>
                        )
                    }
                </Tab>
                <Tab eventKey="releasing" title="Releasing" >
                    {/* {
                        releasingData.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Document found.
                            </Alert>
                        ) : ( */}
                </Tab>
                <Tab eventKey="done" title="Done">
                    {/* {
                        doneData.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Document found.
                            </Alert>
                        ) : ( */}
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
                            <Form.Label>Forward to:</Form.Label>
                            <Select
                                isMulti
                                name='assignTo'
                                options={options}
                                value={selectedOptions}
                                onChange={handleUserSelection}
                                Required
                            />
                            {(!isValid) && <p style={{ color: 'red' }}>Please select at least one option.</p>}
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='primary' onClick={handleForward} disabled={!isValid}>
                        Forward
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}

export default Documents;