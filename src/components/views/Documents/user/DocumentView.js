import React, { useEffect, useState } from 'react';
import Timeline from '../../../units/Timeline/Timeline';
import Card from 'react-bootstrap/Card';
import {
    Button,
    Row,
    Col,
    Breadcrumb,
    Badge,
    OverlayTrigger,
    Popover,
    ListGroup,
    ListGroupItem,
    Modal,
    Form,
    Alert,
    Spinner,
    Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faShare,
    faPaperclip,
    faCalendar,
    faFile,
    faHashtag,
    faQuoteLeft,
    faTimeline,
    faTag,
    faBuildingUser,
    faClock,
    faUserCheck,
    faQuoteRight,
    faCircleCheck,
    faThumbsUp,
    faThumbsDown
} from '@fortawesome/free-solid-svg-icons'
import {
    Link, useLoaderData, useLocation, useRouteLoaderData
} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../../helpers/apiClient';
import Swal from 'sweetalert2';
import Validator from 'validatorjs';

function DocumentView() {
    const loaderData = useLoaderData();
    const [document, setDocument] = useState(loaderData);
    const currentUser = useRouteLoaderData('user');
    const location = useLocation();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [url, setUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [forwardError, setForwardError] = useState('');
    const [isNavigationLoading, setIsNavigationLoading] = useState(true);
    const [isSelectDisabled, setIsSelectDisabled] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [timelineData, setTimelineData] = useState([]);

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const [showModalAction, setShowModalAction] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

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

    const [formInputs, setFormInputs] = useState({
        comment: ''
    });

    const [formErrors, setFormErrors] = useState({
        comment: ''
    });

    const handleAction = event => {
        setIsDisabled(true)
        event.preventDefault();

        let validation = new Validator(formInputs, {
            comment: 'required|string|min:5',

        });

        if (validation.fails()) {
            setIsDisabled(false)
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
            setDocument(response.data.data)
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
        }).finally(() => {
            setIsDisabled(false)
            handleCloseAction();
        });
    };

    const handleApprove = event => {
        setIsDisabled(true)
        event.preventDefault();

        let validation = new Validator(formInputs, {
            comment: 'string|min:5',

        });

        if (validation.fails()) {
            setIsDisabled(false)
            setFormErrors({
                comment: validation.errors.first('comment')
            });
            return;
        } else {
            setFormErrors({
                comment: ''
            });
        }

        apiClient.post(`/document/${showModalApprove.data?.id}/approve`, {
            ...formInputs
        }).then(response => {
            setDocument(response.data.data)
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
        }).finally(() => {
            setIsDisabled(false)
            handleCloseApprove();
        });
    };

    const handleReject = event => {
        setIsDisabled(true)
        event.preventDefault();

        let validation = new Validator(formInputs, {
            comment: 'string|min:5',

        });

        if (validation.fails()) {
            setIsDisabled(false)
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
            setDocument(response.data.data)
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
        }).finally(() => {
            setIsDisabled(false)
            handleCloseReject();
        });
    };

    const handleInputChange = e => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        apiClient.get('/document', {
            params: {
                query: ''
            }
        }).then(response => { //GET ALL function
            setUsers(response.data.data.user);
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
            setIsNavigationLoading(false);
        });

    }, [location]);

    useEffect(() => {
        apiClient.get(`/document/${document.id}`, {
            params: {
                query: ''
            }
        }).then(response => { //GET ALL function
            setUrl(response.data.data.url);
        }).catch(error => {
            setErrorMessage(error);
        });

    }, [document.id]);

    useEffect(() => {
        let logsLastIndex = document.logs.findLastIndex(dl => dl.to_id === currentUser.id);
        let logSlice = document.logs.slice(0, logsLastIndex + 1);
        let assignedIds = document.logs.filter(dl => dl.from_id === currentUser.id).map(dl => dl.assigned_id);
        let filteredLogs = logSlice.filter(log => document.logs[logsLastIndex].assigned_id ? log.assigned_id === document.logs[logsLastIndex].assigned_id : (assignedIds.indexOf(log.assigned_id) !== -1 || log.to_id === currentUser.id));
        let newTimelineData = filteredLogs.map(log => {
            return {
                text: log.rejected_id !== null && log.from_id === null ? <RejectedUsersText key={log.id} users={[log?.rejected_user?.profile]} log={log} /> :
                    log.approved_id !== null && log.from_id === null ? <ApprovedUsersText key={log.id} users={[log?.approved_user?.profile]} log={log} /> :
                        log.action_id !== null && log.comment !== null && log.from_id === null ? <ActionedUsersText key={log.id} users={[log?.action_user?.profile]} log={log} /> :
                            log.acknowledge_id !== null && log.from_id === null ? <AcknowledgedUsersText key={log.id} users={[log?.acknowledge_user?.profile]} log={log} /> :
                                log.to_id !== null ? <ForwardedUsersText key={log.id} users={[log?.user?.profile]} log={log} /> : log.to_id === null && log.released_at !== null? <p>Document <span className='released-text'>Released</span></p>
                                : log.to_id === null ? <p>Document <span className='for-releasing-text'>For Releasing</span></p> : null,
                date: moment(log.created_at).format('MMMM DD, YYYY h:mm:ss A'),
                category: {
                    tag: currentUser?.role.level > log?.assigned_user?.role.level ? '' : log.assigned_user?.profile.name,
                    color: '#6dedd4',
                },
                circleStyle: {
                    borderColor: '#e17b77',
                },
            };
        })

        if (filteredLogs.length > 0) {
            let firstLog = filteredLogs[filteredLogs.length - 1];
            newTimelineData = newTimelineData.concat({
                text: (
                    <>
                        Document <span className='forwarded-text'>Forwarded</span> from:{" "}
                        <p>
                            {firstLog?.from_user?.profile?.name} - <i>{firstLog?.from_user?.profile?.position_designation}</i>
                        </p>
                    </>
                ),
                date: moment(firstLog.created_at).format('MMMM DD, YYYY h:mm:ss A'),
                category: {
                    tag: '',
                    color: '#6dedd4',
                },
                circleStyle: {
                    borderColor: '#e17b77',
                },
            });
        }

        let isAssignedToUser = document.assign.filter(da => da.assigned_id === currentUser.id || (da.assigned_user.role?.division_id === currentUser.role?.division_id && da.assigned_user.role.level > currentUser.role.level));

        if (isAssignedToUser) {
            newTimelineData = newTimelineData.concat(
                isAssignedToUser.map((assign) => ({
                    text: <UsersText key={assign.id} users={[assign.assigned_user.profile]} />,
                    date: moment(assign.created_at).format('MMMM DD, YYYY h:mm:ss A'),
                    category: {
                        tag: '',
                        color: '#6dedd4',
                    },
                    circleStyle: {
                        borderColor: '#e17b77',
                    },
                }))
            );
        }

        setTimelineData(newTimelineData);
    }, [document.logs, document.assign, currentUser]);


    const ForwardedUsersText = ({ users }) => (
        <>
            Document <span className='forwarded-text'>Forwarded</span> to:{" "}
            {users.map((user, index) => (
                <p key={user?.id}>
                    {user?.name} - <i>{user?.position_designation}</i>
                    {index !== users.length - 1 ? ", " : ""}
                </p>
            ))}
        </>
    );

    const AcknowledgedUsersText = ({ users }) => (
        <>
            Document <span className='ack-text'>Acknowledged</span> by:{" "}
            {users.map((user, index) => (
                <p key={user?.id}>
                    {user?.name} - <i>{user?.position_designation}</i>
                    {index !== users.length - 1 ? ", " : ""}
                </p>
            ))}
        </>
    );

    const ActionedUsersText = ({ users, log }) => (
        <>
            Document <span className='act-approve-text'>Acted</span> by:{" "}
            {users.map((user, index) => (
                <p key={user?.id}>
                    {user?.name} - <i>{user?.position_designation}</i>
                    {index !== users.length - 1 ? ", " : ""}
                </p>
            ))}
            {
                log.comment && (
                    <span className='comment-text'>
                        <FontAwesomeIcon icon={faQuoteLeft} className='quote-left' /> {log.comment} <FontAwesomeIcon icon={faQuoteRight} className='quote-left' />
                    </span>
                )
            }
        </>
    );

    const ApprovedUsersText = ({ users, log }) => (
        <>
            Document <span className='act-approve-text'>Approved</span> by:{" "}
            {users.map((user, index) => (
                <p key={user?.id}>
                    {user?.name} - <i>{user?.position_designation}</i>
                    {index !== users.length - 1 ? ", " : ""}
                </p>
            ))}
            {
                log.comment && (
                    <span className='comment-text'>
                        <FontAwesomeIcon icon={faQuoteLeft} className='quote-left' /> {log.comment} <FontAwesomeIcon icon={faQuoteRight} className='quote-left' />
                    </span>
                )
            }
        </>
    );

    const RejectedUsersText = ({ users, log }) => (
        <>
            Document <span className='reject-text'>Rejected</span> by:{" "}
            {users.map((user, index) => (
                <p key={user?.id}>
                    {user?.name} - <i>{user?.position_designation}</i>
                    {index !== users.length - 1 ? ", " : ""}
                </p>
            ))}
            {
                log.comment && (
                    <span className='comment-text'>
                        <FontAwesomeIcon icon={faQuoteLeft} className='quote-left' /> {log.comment} <FontAwesomeIcon icon={faQuoteRight} className='quote-left' />
                    </span>
                )
            }
        </>
    );

    const UsersText = ({ users }) => (
        <>
            Document <span className='assign-text'>Assigned</span> to:{" "}
            {users.map((user, index) => (
                <p key={user.id}>
                    {user.name} - <i>{user?.position_designation}</i>
                    {index !== users.length - 1 ? ", " : ""}
                </p>
            ))}
        </>
    );


    const handleForward = event => {
        setIsDisabled(true)
        event.preventDefault();

        let assignTo = [selectedUsers];

        const formData = new FormData();

        for (let i = 0; i < assignTo.length; i++) {
            formData.append(`assign_to[${i}]`, assignTo[i]);
        }

        apiClient.post(`/document/${document.id}/forward`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setDocument(response.data.data)
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
            handleHideModal();
            setIsSelectDisabled(false)
        }).catch(error => {
            setForwardError(error);
        }).finally(() => {
            setIsDisabled(false)
            handleHideModal();
        });
    };

    // ACKNOWLEDGE
    const showAcknowledgeAlert = document => {
        setIsDisabled(true)
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
                    setDocument(response.data.data)
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
                }).finally(() => {
                    setIsDisabled(false)
                });
            }
        });
    };

    //For assigning multiple users 
    const handleUserSelection = async (selectedOption) => {
        const userId = selectedOption.value;
        setSelectedUsers(userId);
    };

    const handleShowModal = (data = null) => {

        if (data.category.is_assignable) {
            setOptions(users.filter(user => user.role.level !== 2).map(user => ({
                value: user.id,
                label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
            })));
        } else {
            setOptions(users.map(user => ({
                value: user.id,
                label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
            })))
            setIsSelectDisabled(true)
        }


        let userIds = data.assign.map(log => {
            return log.assigned_id;
        });
        setSelectedUsers(userIds.length > 0 ? userIds[0] : '');

        setModal({
            show: true,
            data,
            isLoading: false
        });
    }


    const handleHideModal = () => {
        setForwardError('');
        setIsSelectDisabled(false);
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    }

    if (isLoading || isNavigationLoading) {
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

    const renderButtons = document => {
        return (
            <>
                {
                    (document.logs[0]?.to_id === currentUser.id && document.logs[0]?.acknowledge_id !== currentUser.id) && (
                        <Button className="ms-2 custom-badge" onClick={e => showAcknowledgeAlert(document)}>
                            <FontAwesomeIcon icon={faUserCheck} /> <span className='d-none d-md-inline-block'>Acknowledge</span>
                        </Button>
                    )
                }

                {
                    document.logs[0]?.action_id === null && document.logs[0]?.acknowledge_id === currentUser.id && (
                        <>
                            <Button className="ms-2" variant="success" onClick={e => handleShowAction(document)}>
                                <FontAwesomeIcon icon={faCircleCheck} /> <span className="d-none d-md-inline-block">Action</span>
                            </Button>
                            {
                                users.length > 0 && (
                                    <Button className="ms-2" onClick={e => handleShowModal(document)}>
                                        <FontAwesomeIcon icon={faShare} /> <span className="d-none d-md-inline-block">Forward</span>
                                    </Button>
                                )
                            }
                        </>
                    )
                }

                {
                    document.logs[0]?.action_id !== null && document.logs[0]?.acknowledge_id === currentUser.id &&
                    document.logs[0]?.approved_id === null && document.logs[0]?.rejected_id === null && (
                        <>
                            <Button className="ms-2" onClick={e => handleShowApprove(document)}>
                                <FontAwesomeIcon icon={faThumbsUp} /> <span className='d-none d-md-inline-block'>Approve</span>
                            </Button>
                            <Button className="ms-2" variant='danger' onClick={e => handleShowReject(document)}>
                                <FontAwesomeIcon icon={faThumbsDown} /> <span className='d-none d-md-inline-block'>Reject</span>
                            </Button>
                        </>
                    )
                }
            </>
        )
    }

    return (
        <div className="container fluid">
            <div className="crud bg-body rounded">
                <div className='mt-3'>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '../' }}>Document</Breadcrumb.Item>
                        <Breadcrumb.Item href="#" active>View</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className='text-end mb-3 m-1'>
                    {
                        renderButtons(document)
                    }
                </div>
            </div>

            <div className='m-1'>
                <Card
                    bg="light"
                    border="light" style={{ marginRight: 'auto' }}>

                    <Card.Body>
                        <div className='text-end'>
                            <div className="d-none d-md-block" style={{ whiteSpace: 'nowrap' }} >
                                <FontAwesomeIcon icon={faClock} style={{ color: '#545454' }} />
                                <i style={{ color: '#545454' }}> {moment(document.created_at).format('MMMM DD, YYYY')}
                                </i>
                            </div>

                            <div className='d-block d-md-none'>
                                <OverlayTrigger
                                    placement='bottom'
                                    overlay={
                                        <Tooltip>
                                            {moment(document.created_at).format('MMMM DD, YYYY')}
                                        </Tooltip>
                                    }
                                >
                                    <Button size='sm' variant='outline'>
                                        <FontAwesomeIcon icon={faClock} style={{ color: '#545454' }} />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>

                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon
                                    icon={faHashtag} className='text-dark me-4' />
                                {document.tracking_no}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faTimeline} className='text-dark me-3' />
                                {document.logs.length > 0 ? (
                                    <>
                                        {(document.logs[0].released_at !== null) ? (
                                                <Badge bg="primary">Done</Badge>
                                            ) :
                                            (document.logs[0]?.to_id === null &&
                                                document.logs[0]?.from_id !== null &&
                                                document.logs[0]?.action_id !== null &&
                                                document.logs[0]?.acknowledge_id === null &&
                                                document.logs[0]?.approved_id !== null) ? (
                                                <Badge bg="success" style={{ cursor: '' }}>For Releasing</Badge>
                                            ) :
                                                (document.logs[0].approved_id !== null) ? (
                                                    <OverlayTrigger
                                                        trigger={['click', 'hover']}
                                                        placement="left"
                                                        overlay={
                                                            <Popover>
                                                                <Popover.Header className="bg-success text-white">
                                                                    Approved by
                                                                </Popover.Header>
                                                                <Popover.Body>
                                                                    <ListGroup variant="flush">
                                                                        <ListGroupItem variant="success text-black" >
                                                                            {document.logs[0]?.approved_user?.profile?.name}
                                                                        </ListGroupItem>
                                                                    </ListGroup>
                                                                </Popover.Body>
                                                            </Popover>
                                                        }
                                                    >
                                                        <Badge bg="success" style={{ cursor: 'pointer' }}>Approved</Badge>
                                                    </OverlayTrigger>
                                                ) :
                                                    (document.logs[0].rejected_id !== null) ? (
                                                        <OverlayTrigger
                                                            trigger={['click', 'hover']}
                                                            placement="left"
                                                            overlay={
                                                                <Popover>
                                                                    <Popover.Header className="custom-rejected">
                                                                        Rejected by
                                                                    </Popover.Header>
                                                                    <Popover.Body>
                                                                        <ListGroup variant="flush">
                                                                            <ListGroupItem className="custom-rejected">
                                                                                {document.logs[0]?.rejected_user?.profile?.name}
                                                                            </ListGroupItem>
                                                                        </ListGroup>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            }
                                                        >
                                                            <Badge bg='' className="custom-rejected" style={{ cursor: 'pointer' }}>Rejected</Badge>
                                                        </OverlayTrigger>
                                                    ) :
                                                        // (row.logs[0].action_id !== null && row.logs[0].from_id === null && row.logs[0].to_id === null) ? (
                                                            
                                                        (document.logs[0].action_id !== null && document.logs[0].from_id !== null && document.logs[0].to_id !== null && document.logs[0].action_id !== currentUser.id) || (document.logs[0].from_id === document.logs[0].action_id && document.logs[0].action_id !== null && currentUser.role.level === 2) ? (
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
                                                                                <ListGroupItem variant="success text-black" >
                                                                                    {document.logs[0]?.action_user?.profile?.name}
                                                                                </ListGroupItem>
                                                                            </ListGroup>
                                                                        </Popover.Body>
                                                                    </Popover>
                                                                }
                                                            >
                                                                <Badge bg="success" style={{ cursor: 'pointer' }}>Acted</Badge>
                                                            </OverlayTrigger>
                                                        ) :
                                                            document.logs[0].acknowledge_id !== null ? (
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
                                                                                    {document.logs.length > 0 ? (
                                                                                        <ListGroupItem className="custom-badge text-white"
                                                                                        >

                                                                                            {document.logs[0]?.acknowledge_user.profile.name}
                                                                                        </ListGroupItem>
                                                                                    ) : null}
                                                                                </ListGroup>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg='' className="custom-badge" style={{ cursor: 'pointer' }}>Acknowledged</Badge>
                                                                </OverlayTrigger>

                                                            )  : document.logs[0].to_id && document.logs[0].from_id === null ? (
                                                                <Badge bg="warning">Forwarded from RO</Badge>

                                                            ) : document.logs[0].from_id === currentUser.id || document.logs[0].action_id === currentUser.id || currentUser.role.level <= 2 ? (
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
                                                                                    <ListGroupItem variant="warning text-black">
                                                                                        {document.logs[0]?.user?.profile.name}
                                                                                    </ListGroupItem>
                                                                                </ListGroup>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded to</Badge>
                                                                </OverlayTrigger>

                                                            ) : document.logs[0].to_id && currentUser.role.level >=2 ? (
                                                                    <OverlayTrigger
                                                                        trigger={['click', 'hover']}
                                                                        placement="left"
                                                                        overlay={
                                                                            <Popover>
                                                                                <Popover.Header className="bg-warning text-white">
                                                                                    Forwarded from
                                                                                </Popover.Header>
                                                                                <Popover.Body>
                                                                                <ListGroup variant="flush">
                                                                                    <ListGroupItem variant="warning text-black">
                                                                                        {document.logs[0]?.from_user.profile.name}
                                                                                    </ListGroupItem>
                                                                                </ListGroup>
                                                                                </Popover.Body>
                                                                            </Popover>
                                                                        }
                                                                    >
                                                                        <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded from</Badge>
                                                                    </OverlayTrigger>
                                                                ) : null
                                        }
                                    </>
                                ) : <Badge bg="secondary">Released</Badge>}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faFile} className="text-dark" style={{ marginRight: '25px' }} />
                                {document.document_type.description}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faCalendar} className='text-dark me-4' />
                                {moment(document.date_received).format('MMMM DD, YYYY')}
                                {/* <i style={{color:'#545454'}}> (Received {moment(document.date_received).fromNow()})</i>  */}
                            </Col>
                        </Row>



                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faBuildingUser} className="text-dark" style={{ marginRight: '18px' }} />
                                {document.sender?.receivable?.title ?? document.sender.name}
                            </Col>
                        </Row>

                        {
                            (document.assign && document.assign.length > 0 && document.assign.filter(da => da.assigned_user?.role.level >= currentUser?.role.level).length > 0) && (
                                <Row className="mb-3">
                                    <Col>
                                        <FontAwesomeIcon icon={faUserCheck} className='text-dark' style={{ marginRight: '18px' }} />
                                        {
                                            document.assign.filter(da => da.assigned_user.role.level >= currentUser?.role.level).map((assign, index) => (
                                                <span key={assign.assigned_user.profile.id}>
                                                    {assign.assigned_user.profile.name}
                                                    {index !== document.assign.length - 1 ? ', ' : ''}
                                                </span>
                                            ))
                                        }
                                    </Col>
                                </Row>
                            )
                        }
                        {/* <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faUserCheck} className="text-dark" style={{marginRight:'18px'}}/>
                                {document.user.profile.name}
                            </Col>
                        </Row> */}

                        <Row className="mb-3">
                            <Col >
                                <FontAwesomeIcon icon={faTag} className='text-dark me-4' />
                                {document.category.description}
                            </Col>
                        </Row>

                        {document.attachments?.file_title ? (
                            <Row className="mb-3">
                                <Col>
                                    <FontAwesomeIcon icon={faPaperclip} className='text-dark me-4' />
                                    <Link to={url} target="_blank" download>{document.attachments.file_title}</Link>
                                </Col>
                            </Row>
                        ) : null}


                        <Row className="mb-3">
                            <Col row={5}>
                                <FontAwesomeIcon icon={faQuoteLeft} className='text-dark me-4' />
                                {document.description}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>

            <Timeline data={timelineData} />

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
                            <Form.Label>
                                {!isSelectDisabled ? (
                                    <><span className='text-muted'>Forward to</span> :</>
                                ) : (
                                    <>Forward to <span className='text-muted'>(Disabled because the document is confidential)</span>:</>
                                )}
                            </Form.Label>
                            <Select
                                name='assignTo'
                                options={options}
                                value={options.find(option => option.value === selectedUsers)}
                                onChange={handleUserSelection}
                                isDisabled={isSelectDisabled}
                            />
                            {
                                forwardError && (
                                    <p style={{ color: 'red' }}>{forwardError}</p>
                                )
                            }
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleHideModal} disabled={modal.isLoading}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='primary' onClick={handleForward} disabled={isDisabled}>
                        Forward
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
                    <Button type='submit' variant="primary" onClick={handleAction} disabled={isDisabled}>
                        Confirm
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
                    <Button variant="secondary" onClick={handleCloseApprove}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleApprove} disabled={isDisabled}>
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
                    <Button variant="secondary" onClick={handleCloseReject}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleReject} disabled={isDisabled}>
                        Reject
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default DocumentView;