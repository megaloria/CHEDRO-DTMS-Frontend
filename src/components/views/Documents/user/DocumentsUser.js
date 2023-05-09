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
    Link, useNavigate, useLoaderData
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faThumbsUp,
    faCircleArrowRight,
    faShare,
    faSearch,
    faThumbsDown,
    faUserCheck,
    faFileCircleCheck
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './../styles.css';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../../helpers/apiClient';
import Validator from 'validatorjs';

function DocumentsUser() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const [activeTab, setActiveTab] = useState('all');

    const [showModalApprove, setShowModalApprove] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [showModalReject, setShowModalReject] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [showModalAction, setShowModalAction] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [formInputs, setFormInputs] = useState({
        comment: ''
    });

    const [formErrors, setFormErrors] = useState({
        comment: ''
    });

    useEffect(() => {
        setIsTableLoading(true);
        if (activeTab === 'all') {
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

    useEffect(() => {
        if (modal.data) {
            let newOptions = users.map(user => ({
                value: user.id,
                label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
            }));

            const assigned = modal.data.logs.map(log => log.to_id);
            const optionsFiltered = newOptions.filter(option => !assigned.includes(option.value));
            setOptions(optionsFiltered);

            if (modal.data.logs.length > 0 && modal.data.logs[0].to_id !== null && modal.data.logs.some(log => log.acknowledge_id !== null)) {
                setSelectedUsers([]);
            } else {
                let userIds = modal.data.assign.filter(l => l.assigned_id);
                userIds = userIds.map(log => {
                    return log.assigned_id;
                });
                setSelectedUsers(userIds);
            }
        }
        
    }, [modal, users])

    //For Approve Modal
    const handleCloseApprove = () => setShowModalApprove({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });
    const handleShowApprove = (data) => setShowModalApprove({ //modal variables
        show: true,
        data,
        isLoading: false
    });
    
    //For Reject Modal
    const handleCloseReject = () => setShowModalReject({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });
    const handleShowReject = (data) => setShowModalReject({ //modal variables
        show: true,
        data,
        isLoading: false
    });

    const handleReject = event => {
        event.preventDefault();

        let validation = new Validator(formInputs, {
            comment: 'nullable|string|min:5',

        });

        if (validation.fails()) {
            setFormErrors({
                comment: validation.errors.first('comment')
            });
            return;
        } else {
            setFormErrors({
                comment: ''
            });
        }

        apiClient.post(`/document/${showModalReject.data?.id}/reject`, formInputs).then(response => {
            navigate('../');
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
        }).catch(error => {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
        });
    };

    const handleInputChange = e => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    }
    //For Took Action Modal
    const handleCloseAction = () => setShowModalAction({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });
    const handleShowAction = (data) => setShowModalAction({ //modal variables
        show: true,
        data,
        isLoading: false
    });

    const handleAction = event => {
            event.preventDefault();

            let validation = new Validator(formInputs, {
                comment: 'required|string|min:5',
               
            });
    
            if (validation.fails()){
                setFormErrors({
                    comment: validation.errors.first('comment')
                });
                return;
            } else {
                setFormErrors({
                    comment: ''
                });
            }
            
            apiClient.post(`/document/${showModalAction.data?.id}/action`, formInputs).then(response => {
                navigate('../');
                Swal.fire({
                    title: 'Success',
                    text: response.data.message,
                    icon: 'success'
                })
            }).catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: error,
                    icon: 'error'
                });
            });
        };


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
                    navigate('../');
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

    const handlePageChange = (pageNumber) => {
        setIsTableLoading(true);

        if (activeTab === 'all') {
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
        if (activeTab === 'ongoing') {
            apiClient.get(`/document/ongoing?page=${pageNumber}`, {
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
    };

    const [isValid, setIsValid] = useState(true);

    //For assigning multiple users 
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
        // Update the form validity
        setIsValid(selectedOptions.length > 0);
    };

    const selectedOptions = options.filter(option => selectedUsers.includes(option.value));

    const handleShowForward = (data = null) => {
        
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


    const handleForward = event => {
        event.preventDefault();
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

    const handleApprove = event => {
        event.preventDefault();
        
        let validation = new Validator(formInputs, {
            comment: 'nullable|string|min:5',

        });

        if (validation.fails()) {
            setFormErrors({
                comment: validation.errors.first('comment')
            });
            return;
        } else {
            setFormErrors({
                comment: ''
            });
        }

        apiClient.post(`/document/${showModalApprove.data?.id}/approve`, formInputs).then(response => {
            navigate('../');
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
        }).catch(error => {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error'
            });
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

                 {/*ALL TAB*/}
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
                                                            <div className='text-truncate' style={{ width: '200px' }}>
                                                                {row.description}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {row.logs.length > 0 ? (
                                                                <>
                                                                    {
                                                                        (row.logs[0].action_id !== null && row.logs[0].from_id !== null && row.logs[0].to_id !== null) ? (
                                                                            <OverlayTrigger
                                                                                trigger={['click', 'hover']}
                                                                                placement="left"
                                                                                overlay={
                                                                                    <Popover>
                                                                                        <Popover.Header className="bg-success text-white">
                                                                                            Acted by
                                                                                        </Popover.Header>
                                                                                        <Popover.Body>
                                                                                            <ListGroup variant="flush">
                                                                                                {row.logs.filter(log => log.to_id !== null && log.from_id !== null && log.action_id !== null).map((log, index) => (
                                                                                                    <ListGroupItem variant="success text-black" key={log?.action_user?.profile?.id}>
                                                                                                        {log?.action_user?.profile?.name}
                                                                                                    </ListGroupItem>
                                                                                                ))}
                                                                                            </ListGroup>
                                                                                        </Popover.Body>
                                                                                    </Popover>
                                                                                }
                                                                            >
                                                                                <Badge bg="success" style={{ cursor: 'pointer' }}>Acted</Badge>
                                                                            </OverlayTrigger>
                                                                        ) :
                                                                            row.logs[0].acknowledge_id !== null ? (
                                                                                <OverlayTrigger
                                                                                    trigger={['click', 'hover']}
                                                                                    placement="left"
                                                                                    overlay={
                                                                                        <Popover>
                                                                                            <Popover.Header className="custom-badge text-white" style={{ cursor: 'pointer' }} >
                                                                                                Acknowledged by
                                                                                            </Popover.Header>
                                                                                            <Popover.Body>
                                                                                                <ListGroup variant="flush">
                                                                                                    {Array.from(new Set(row.logs.map(log => log.acknowledge_user && log.acknowledge_user.profile.name)))
                                                                                                        .filter(name => name !== null)
                                                                                                        .map(name => (
                                                                                                            <ListGroupItem className="custom-badge text-white" style={{ cursor: 'pointer' }} key={name}>
                                                                                                                {name}
                                                                                                            </ListGroupItem>
                                                                                                        ))}
                                                                                                </ListGroup>

                                                                                                {row.logs.filter(log => log.to_id !== null && log.acknowledge_id === null && !row.logs.some(otherLog => otherLog.acknowledge_id === log.to_id)).length > 0 && (
                                                                                                    <div>Forwarded To:</div>
                                                                                                )}
                                                                                                <ListGroup variant="flush">
                                                                                                    {row.logs.filter(log => log.to_id !== null && log.acknowledge_id === null && !row.logs.some(otherLog => otherLog.acknowledge_id === log.to_id)).map((log, index) => (
                                                                                                        <ListGroupItem variant="warning text-black" key={log?.user?.profile?.id}>
                                                                                                            {log?.user?.profile?.name}
                                                                                                        </ListGroupItem>
                                                                                                    ))}
                                                                                                </ListGroup>

                                                                                            </Popover.Body>
                                                                                        </Popover>
                                                                                    }
                                                                                >
                                                                                    <Badge bg='' className="custom-badge" style={{ cursor: 'pointer' }}>Acknowledged</Badge>
                                                                                </OverlayTrigger>
                                                                            ) : row.logs.some(log => log.to_id !== null) ? (
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
                                                                                                    {row.logs.map((log, index) => (
                                                                                                        log.to_id !== null ? (
                                                                                                            <ListGroupItem
                                                                                                                variant="warning text-black"
                                                                                                                key={log.user.profile.id}
                                                                                                            >
                                                                                                                {log.user.profile.name}
                                                                                                            </ListGroupItem>
                                                                                                        ) : null
                                                                                                    ))}
                                                                                                </ListGroup>
                                                                                            </Popover.Body>
                                                                                        </Popover>
                                                                                    }
                                                                                >
                                                                                    <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded to</Badge>
                                                                                </OverlayTrigger>
                                                                            ) : (
                                                                                null
                                                                            )}
                                                                </>
                                                            ) : row.assign.length > 0 && row.assign[0].assigned_id !== null ? (
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
                                                            ) : <Badge bg="secondary">Released</Badge>}
                                                        </td>

                                                        <td style={{ whiteSpace: 'nowrap' }}>
                                                            <Button className='me-1' variant="outline-primary" size='sm' as={Link} to={`user-view/${row.id}`} >
                                                                <FontAwesomeIcon icon={faCircleArrowRight}/> View
                                                            </Button>

                                                            {
                                                            (row.assign[0].assigned_id === loaderData.id) || (row.logs[0].to_id === loaderData.id && row.logs[0].action_id !== null )  ? (
                                                                <Button variant="link" size='sm' onClick={e => showAcknowledgeAlert(row)}>
                                                                    <FontAwesomeIcon icon={faUserCheck} className='text-success' />
                                                                </Button>
                                                            ) : null}

                                                            {(row.logs[0].to_id === row.logs.assigned_id && row.logs[0].acknowledge_id !== null) ? (
                                                                    <Button variant="link" size='sm' onClick={e => handleShowAction(row)}>
                                                                        <FontAwesomeIcon icon={faFileCircleCheck} className='text-success' />
                                                                    </Button>
                                                            ) : null} 

                                                            {row.logs.length > 0 && row.logs.some(log => log.acknowledge_id !== null && log.acknowledge_id === loaderData.id) && options.length > 0 ? (
                                                                    <Button variant="link" size='sm' onClick={e => handleShowForward(row)}>
                                                                        <FontAwesomeIcon icon={faShare} />
                                                                    </Button>
                                                            ) : null} 

                                                            {(loaderData.role.level === 3 || loaderData.role.level === 2) && row.logs.some(log => log.acknowledge_id !== null && log.acknowledge_id === loaderData.id) ? (
                                                                <Button variant="link" size='sm' onClick={e => handleShowApprove(row)}>
                                                                    <FontAwesomeIcon icon={faThumbsUp}/>
                                                                </Button>
                                                            ): null}

                                                            {(loaderData.role.level === 3 || loaderData.role.level === 2) && row.logs.some(log => log.acknowledge_id !== null && log.acknowledge_id === loaderData.id) ? (
                                                                <Button variant="link" size='sm' onClick={e => handleShowReject(row)}>
                                                                    <FontAwesomeIcon icon={faThumbsDown} className='text-danger'/>
                                                                </Button>
                                                            ): null}
                                                          
                                                        </td>
                                                    </tr>

                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>

                                {/* ALL Tab Pagination*/}            
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

                {/* ONGONG TAB*/}
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
                                                        <div className='text-truncate' style={{ width: '200px' }}>
                                                            {row.description}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {row.logs.length > 0 ? (
                                                            <>
                                                                {row.logs.some(log => log.acknowledge_id !== null) ? (
                                                                    <OverlayTrigger
                                                                        trigger={['click', 'hover']}
                                                                        placement="left"
                                                                        overlay={
                                                                            <Popover>
                                                                                <Popover.Header className="custom-badge text-white" style={{ cursor: 'pointer' }} >
                                                                                    Acknowledged by
                                                                                </Popover.Header>
                                                                                <Popover.Body>
                                                                                    <ListGroup variant="flush">
                                                                                        {Array.from(new Set(row.logs.map(log => log.acknowledge_user && log.acknowledge_user.profile.name)))
                                                                                            .filter(name => name !== null)
                                                                                            .map(name => (
                                                                                                <ListGroupItem className="custom-badge text-white" style={{ cursor: 'pointer' }} key={name}>
                                                                                                    {name}
                                                                                                </ListGroupItem>
                                                                                            ))}
                                                                                    </ListGroup>

                                                                                    {row.logs.some(log => log.to_id !== null && log.acknowledge_id === null) && (
                                                                                        <div>Forwarded To:</div>
                                                                                    )}
                                                                                    <ListGroup variant="flush">
                                                                                        {row.logs.map((log, index) => (
                                                                                            log.to_id !== null && log.acknowledge_id === null && (
                                                                                                <ListGroupItem
                                                                                                    variant="warning text-black"
                                                                                                    key={log.user.profile.id}
                                                                                                >
                                                                                                    {log.user.profile.name}
                                                                                                </ListGroupItem>
                                                                                            )
                                                                                        ))}
                                                                                    </ListGroup>
                                                                                </Popover.Body>
                                                                            </Popover>
                                                                        }
                                                                    >
                                                                        <Badge bg='' className="custom-badge" style={{ cursor: 'pointer' }}>Acknowledged</Badge>
                                                                    </OverlayTrigger>
                                                                ) : row.logs.some(log => log.to_id !== null) ? (
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
                                                                                        {row.logs.map((log, index) => (
                                                                                            log.to_id !== null ? (
                                                                                                <ListGroupItem
                                                                                                    variant="warning text-black"
                                                                                                    key={log.user.profile.id}
                                                                                                >
                                                                                                    {log.user.profile.name}
                                                                                                </ListGroupItem>
                                                                                            ) : null
                                                                                        ))}
                                                                                    </ListGroup>
                                                                                </Popover.Body>
                                                                            </Popover>
                                                                        }
                                                                    >
                                                                        <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded</Badge>
                                                                    </OverlayTrigger>
                                                                ) : (
                                                                    <Badge bg="primary">Received</Badge>
                                                                )}
                                                            </>
                                                        ) : null}

                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        <Button className='me-1' variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                            <FontAwesomeIcon icon={faCircleArrowRight}/> View
                                                        </Button>
                                                                    
                                                        {row.logs.length > 0 && row.logs.some(log => log.acknowledge_id !== null && log.acknowledge_id === loaderData.id) ? (
                                                                    <Button variant="link" size='sm' onClick={e => handleShowAction(row)}>
                                                                        <FontAwesomeIcon icon={faFileCircleCheck} className='text-success' />
                                                                    </Button>
                                                            ) : null} 

                                                        {row.logs.length > 0 && !row.logs.every(log => log.acknowledge_id !== loaderData.id) && options.length > 0 ? (
                                                            <Button variant="link" size='sm' onClick={e => handleShowForward(row)}>
                                                                <FontAwesomeIcon icon={faShare} />
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

                {/*APPROVED TAB*/}
                <Tab eventKey="approved" title="Approved" >
                    {/* {
                        releasingData.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Document found.
                            </Alert>
                        ) : ( */}
                </Tab>

                 {/*REJECTED TAB*/}
                <Tab eventKey="rejected" title="Rejected">
                    {/* {
                        doneData.data.length === 0 ? (
                            <Alert variant='primary'>
                                No Document found.
                            </Alert>
                        ) : ( */}
                </Tab>
            </Tabs>

                         {/* Forward Modal*/}
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
                                            name='forwardTo'
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

                        {/* Approve Document Modal*/}
                        <Modal show={showModalApprove.show} onHide={handleCloseApprove}>
                            <Modal.Header closeButton>
                            <Modal.Title>Approve Document</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form.Label>Add a comment</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    Required
                                    type="text" 
                                    name='comment' 
                                    placeholder="Leave a comment here." 
                                    isInvalid={!!formErrors.comment}
                                 />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.comment}
                            </Form.Control.Feedback>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseApprove}>
                                Cancel
                                </Button>
                                <Button variant="primary" onClick={handleApprove}>
                                Approve
                                </Button>
                            </Modal.Footer>
                        </Modal> 
                        
                        {/* Reject Document Modal*/}
                        <Modal show={showModalReject.show} onHide={handleCloseReject}>
                            <Modal.Header closeButton>
                            <Modal.Title>Reject Document</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form.Label>Add a comment</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    Required
                                    type="text" 
                                    name='comment' 
                                    placeholder="Leave a comment here." 
                    />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseReject}>
                                Cancel
                                </Button>
                                <Button variant="danger" onClick={handleReject}>
                                Reject
                                </Button>
                            </Modal.Footer>
                        </Modal> 
                        

                        {/* Took Action Document Modal*/}
                        <Modal show={showModalAction.show} onHide={handleCloseAction}>
                            <Modal.Header closeButton>
                            <Modal.Title>Confirm Taking Action</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form.Label>Add a comment</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    onChange={handleInputChange}
                                    type="text" 
                                    name='comment' 
                                    value={formInputs.comment}
                                    placeholder="Leave a comment here."
                                    isInvalid={!!formErrors.comment}
                                />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.comment}
                            </Form.Control.Feedback>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAction}>
                                Cancel
                                </Button>
                                <Button type='submit' variant="primary" onClick={handleAction}>
                                Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal> 
        </div>

    );
}

export default DocumentsUser;