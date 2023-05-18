import React, { useEffect,  useState }  from 'react';
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
    Link, useLoaderData, useNavigate, useLocation, useRouteLoaderData
} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../../helpers/apiClient';
import Swal from 'sweetalert2';

function DocumentView() {
    const document = useLoaderData();
    const currentUser = useRouteLoaderData('user');
    const location = useLocation();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    let [options, setOptions] = useState([]);
    const [url, setUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [forwardError, setForwardError] = useState('');
    const [isNavigationLoading, setIsNavigationLoading] = useState(true);
    const [isSelectDisabled, setIsSelectDisabled] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [timelineData, setTimelineData] = useState([]);
    const navigate = useNavigate();

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
        let logSlice = document.logs.slice(0, logsLastIndex+1);
        let assignedIds = document.logs.filter(dl => dl.from_id === currentUser.id).map(dl => dl.assigned_id);
        let filteredLogs = logSlice.filter(log => document.logs[logsLastIndex].assigned_id ? log.assigned_id === document.logs[logsLastIndex].assigned_id : (assignedIds.indexOf(log.assigned_id) !== -1 || log.to_id === currentUser.id));
        let newTimelineData = filteredLogs.map(log => {
            return {
                text: log.rejected_id !== null && log.from_id === null ? <RejectedUsersText key={log.id} users={[log?.rejected_user?.profile]} log={log}/> : 
                        log.approved_id !== null && log.from_id === null ? <ApprovedUsersText key={log.id} users={[log?.approved_user?.profile]} log={log} /> :
                            log.action_id !== null && log.comment !== null && log.from_id === null ? <ActionedUsersText key={log.id} users={[log?.action_user?.profile]} log={log} /> :
                                log.acknowledge_id !== null && log.from_id === null ? <AcknowledgedUsersText key={log.id} users={[log?.acknowledge_user?.profile]} log={log} /> :
                                    log.to_id !== null ? <ForwardedUsersText key={log.id} users={[log?.user?.profile]} log={log} /> : log.to_id === null ? 'Document for Releasing' : null,
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
            let firstLog = filteredLogs[filteredLogs.length-1];
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
                        <FontAwesomeIcon icon={faQuoteLeft} className='quote-left'/> {log.comment} <FontAwesomeIcon icon={faQuoteRight} className='quote-left'/>
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
                        <FontAwesomeIcon icon={faQuoteLeft} className='quote-left' /> {log.comment} <FontAwesomeIcon icon={faQuoteRight} className='quote-left'/>
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
                        <FontAwesomeIcon icon={faQuoteLeft} className='quote-left' /> {log.comment} <FontAwesomeIcon icon={faQuoteRight} className='quote-left'/>
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
        setIsDisabled(true);
        const formData = new FormData();

        let assignTo = [selectedUsers];

        for (let i = 0; i < assignTo.length; i++) {
            formData.append(`assign_to[${i}]`, assignTo[i]);
        }

        apiClient.post(`/document/${document.id}/forward`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setIsDisabled(false)
            Swal.fire({
                title: 'Success',
                text: response.data.message,
                icon: 'success'
            })
            handleHideModal();
            setIsSelectDisabled(false);
            setIsNavigationLoading(true);
            navigate(`/documents/view/${document.id}`);
            
        }).catch(error => {
            setIsDisabled(false)
            setForwardError(error);
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
        let groupedLogs = [];
        for (let id in document.logs_grouped) {
            let hasUser = document.logs_grouped[id].filter(lg => lg.to_id === currentUser.id && lg.assigned_id !== null);
            if (hasUser.length > 0) {
                groupedLogs = [...document.logs_grouped[id]];
                break;
            }
        }

        let indexOfLatestReceive = groupedLogs.findIndex(log => log.to_id === currentUser.id && log.action_id === null);
        let indexOfLatestReceiveWithAction = groupedLogs.findIndex(log => log.to_id === currentUser.id && log.action_id !== null);
        let indexOfLatestForward = groupedLogs.findIndex(log => log.from_id === currentUser.id && log.action_id === null);
        let indexOfLatestForwardWithAction = groupedLogs.findIndex(log => log.from_id === currentUser.id && log.action_id !== null);
        let indexOfLatestAcknowledge = groupedLogs.findIndex(log => log.acknowledge_id === currentUser.id);
        let indexOfLatestAcknowledgeWithAction = groupedLogs.findIndex(log => log.acknowledge_id === currentUser.id && log.action_id !== null);
        let indexOfLatestRejected = groupedLogs.findIndex(log => log.to_id !== null && log.rejected_id !== null);

        let indexOfLatestApprovedBy = groupedLogs.findIndex(log => log.approved_id === currentUser.id);
        let indexOfLatestRejectedBy = groupedLogs.findIndex(log => log.rejected_id === currentUser.id);
        let actionLog = groupedLogs.find(log => log.action_id !== null);

        console.log(
           
            
            indexOfLatestReceive !== -1 &&
            indexOfLatestAcknowledge !== -1 &&
            indexOfLatestAcknowledge < indexOfLatestReceive &&
            (
                !actionLog ||
                indexOfLatestRejected > -1
            ))
        return (
            <>
                {
                    (
                        (
                            indexOfLatestReceive !== -1 &&
                            (
                                indexOfLatestAcknowledge === -1 ||
                                (
                                    indexOfLatestAcknowledge > indexOfLatestRejected &&
                                    indexOfLatestRejected !== -1 &&
                                    groupedLogs[indexOfLatestRejected].to_id === currentUser.id
                                )
                            )
                        ) || (
                            indexOfLatestReceiveWithAction !== -1 &&
                            (
                                indexOfLatestAcknowledgeWithAction === -1 ||
                                indexOfLatestReceiveWithAction < indexOfLatestAcknowledgeWithAction
                            )
                        )
                    ) ? (
                        <Button className="ms-2" variant='ack-btn' /*onClick={e => showAcknowledgeAlert(row)}*/>
                                <FontAwesomeIcon icon={faUserCheck} /> <span className='d-none d-md-inline-block'>Acknowledge</span>
                        </Button>
                        
                    ) : (
                        (
                            indexOfLatestForward === -1 || (
                                indexOfLatestAcknowledge < indexOfLatestForward
                            )
                        ) &&
                        (
                            indexOfLatestForwardWithAction === -1 ||
                            indexOfLatestAcknowledge < indexOfLatestForwardWithAction
                        ) &&
                        indexOfLatestReceive !== -1 &&
                        indexOfLatestAcknowledge !== -1 &&
                        indexOfLatestAcknowledge < indexOfLatestReceive &&
                        (
                            !actionLog ||
                            indexOfLatestRejected > -1
                        )
                    ) ? (
                        <>
                             <Button className="ms-2" variant='success' /*onClick={e => handleShowAction(document)}*/>
                                    <FontAwesomeIcon icon={faCircleCheck} /> <span className='d-none d-md-inline-block'>Action</span>
                            </Button>
                            {
                                users.length > 0 && (
                                    <Button className="ms-2" onClick={e => handleShowModal(document)}>
                                            <FontAwesomeIcon icon={faShare} /> <span className='d-none d-md-inline-block'>Forward</span>
                                    </Button>
                                )
                            }
                        </>
                    ) : null
                }
                {
                    (
                        indexOfLatestReceiveWithAction !== -1 &&
                        groupedLogs[indexOfLatestReceiveWithAction].rejected_id === null &&
                        // groupedLogs[indexOfLatestForward].rejected_id === null &&
                        (
                            (indexOfLatestApprovedBy === -1 && indexOfLatestRejectedBy === -1) || (
                                (indexOfLatestApprovedBy !== -1 && indexOfLatestRejectedBy !== -1) && (
                                    (
                                        indexOfLatestApprovedBy < indexOfLatestRejectedBy && (
                                            (
                                                indexOfLatestApprovedBy < indexOfLatestRejectedBy &&
                                                indexOfLatestReceiveWithAction < indexOfLatestApprovedBy
                                            )
                                        )
                                    ) || (
                                        indexOfLatestApprovedBy > indexOfLatestRejectedBy && (
                                            (
                                                indexOfLatestApprovedBy > indexOfLatestRejectedBy &&
                                                indexOfLatestReceiveWithAction < indexOfLatestRejectedBy
                                            )
                                        )
                                    )
                                )
                            ) || (
                                indexOfLatestApprovedBy !== -1 && indexOfLatestRejectedBy === -1 && (
                                    (
                                        indexOfLatestReceiveWithAction < indexOfLatestApprovedBy
                                    )
                                )
                            ) || (
                                indexOfLatestRejectedBy !== -1 && indexOfLatestApprovedBy === -1 && (
                                    (
                                        indexOfLatestReceiveWithAction < indexOfLatestRejectedBy
                                    )
                                )
                            )
                        ) &&
                        indexOfLatestAcknowledgeWithAction !== -1 &&
                        indexOfLatestReceiveWithAction > indexOfLatestAcknowledgeWithAction
                    ) ? (
                        <>
                            <Button className="ms-2" /*onClick={e => handleShowApprove(row)}*/>
                                    <FontAwesomeIcon icon={faThumbsUp} /> <span className='d-none d-md-inline-block'>Approve</span>
                            </Button>
                            <Button className="ms-2" variant='danger' /*onClick={e => handleShowReject(row)}*/>
                                    <FontAwesomeIcon icon={faThumbsDown} /> <span className='d-none d-md-inline-block'>Reject</span>
                            </Button>
                        </>
                    ) : null
                }
            </>
        )
    }
   
    return (
        <div className="container fluid">
            <div className="crud bg-body rounded"> 
                <div className='mt-3'>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{  to: '../' }}>Document</Breadcrumb.Item>
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
                        border="light" style={{ marginRight:'auto'}}>
    
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
                                        <FontAwesomeIcon icon={faClock} style={{color:'#545454'}}/>
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>

                        <Row className="mb-3"> 
                            <Col> 
                                <FontAwesomeIcon 
                                icon={faHashtag} className='text-dark me-4'/>
                                {document.tracking_no}
                            </Col>
                        </Row>
                        
                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faTimeline} className='text-dark me-3'/>
                                {document.logs.length > 0 ? (
                                    <>
                                        {
                                            (document.logs[0]?.to_id === null &&
                                                document.logs[0]?.action_id === null &&
                                                document.logs[0]?.acknowledge_id === null) ? (
                                                <OverlayTrigger
                                                    trigger={['click', 'hover']}
                                                    placement="left"
                                                    overlay={
                                                        <Popover>
                                                            <Popover.Header className="bg-success text-white">
                                                                For Releasing
                                                            </Popover.Header>
                                                            <Popover.Body>
                                                                <ListGroup variant="flush">
                                                                    {/* {row.logs.filter(log => log.to_id !== null && log.from_id !== null && log.action_id !== null).map((log, index) => (
                                                                                    <ListGroupItem variant="success text-black" key={log?.action_user?.profile?.id}>
                                                                                        {log?.action_user?.profile?.name}
                                                                                    </ListGroupItem>
                                                                                ))} */}
                                                                </ListGroup>
                                                            </Popover.Body>
                                                        </Popover>
                                                    }
                                                >
                                                    <Badge bg="success" style={{ cursor: 'pointer' }}>For Releasing</Badge>
                                                </OverlayTrigger>
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
                                                        (document.logs[0].action_id !== null && document.logs[0].acknowledge_id === null) ? (
                                                            <OverlayTrigger
                                                                trigger={['click', 'hover']}
                                                                placement="left"
                                                                overlay={
                                                                    <Popover>
                                                                        <Popover.Header className="bg-success text-white">
                                                                            Acted by
                                                                        </Popover.Header>
                                                                        <Popover.Body>
                                                                            {/* <ListGroup variant="flush">
                                                                                {row.logs.filter(log => log.to_id !== null && log.from_id !== null && log.action_id !== null).map((log, index) => (
                                                                                    <ListGroupItem variant="success text-black" key={log?.action_user?.profile?.id}>
                                                                                        {log?.action_user?.profile?.name}
                                                                                    </ListGroupItem>
                                                                                ))}
                                                                            </ListGroup> */}
                                                                            <ListGroup variant="flush">
                                                                                <ListGroupItem variant="success text-black" >
                                                                                    {document.logs[0]?.action_user?.profile?.name}
                                                                                </ListGroupItem>
                                                                            </ListGroup>
                                                                        </Popover.Body>
                                                                    </Popover>
                                                                    // <Popover>
                                                                    //     <Popover.Header className="bg-success text-white">
                                                                    //         Acted by
                                                                    //     </Popover.Header>
                                                                    //     <Popover.Body>
                                                                    //         <ListGroup variant="flush">
                                                                    //             {row.logs.filter(log => log.to_id !== null && log.from_id !== null && log.action_id !== null).map((log, index) => (
                                                                    //                 <ListGroupItem variant="success text-black" key={log?.action_user?.profile?.id}>
                                                                    //                     {log?.action_user?.profile?.name}
                                                                    //                 </ListGroupItem>
                                                                    //             ))}
                                                                    //         </ListGroup>
                                                                    //     </Popover.Body>
                                                                    // </Popover>
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
                                                                                            key={document.logs[0]?.acknowledge_user.profile.id}
                                                                                        >

                                                                                            {document.logs[0]?.acknowledge_user.profile.name}
                                                                                        </ListGroupItem>
                                                                                    ) : null}
                                                                                </ListGroup>

                                                                                {/* {row.logs.filter(log => log.to_id !== null && log.acknowledge_id === null && !row.logs.some(otherLog => otherLog.acknowledge_id === log.to_id)).length > 0 && (
                                                                                    <div>Forwarded To:</div>
                                                                                )}
                                                                                <ListGroup variant="flush">
                                                                                    {row.logs.filter(log => log.to_id !== null && log.acknowledge_id === null && !row.logs.some(otherLog => otherLog.acknowledge_id === log.to_id)).map((log, index) => (
                                                                                        <ListGroupItem variant="warning text-black" key={log?.user?.profile?.id}>
                                                                                            {log?.user?.profile?.name}
                                                                                        </ListGroupItem>
                                                                                    ))}
                                                                                </ListGroup> */}

                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg='' className="custom-badge" style={{ cursor: 'pointer' }}>Acknowledged</Badge>
                                                                </OverlayTrigger>
                                                            ) : document.logs[0].from_id === currentUser.id ? (
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
                                                                                    {document.logs.map((log, index) => (
                                                                                        (currentUser.id === log.from_id) ? (
                                                                                            <ListGroupItem
                                                                                                variant="warning text-black"
                                                                                                key={log.user?.profile.id}
                                                                                            >
                                                                                                {log.user?.profile.name}
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
                                                            ) : document.logs[0].to_id ? (
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
                                                                                    <ListGroupItem>
                                                                                        {document.logs.map((log, index) => (
                                                                                            (currentUser.id === log.to_id) ? (
                                                                                                <ListGroupItem
                                                                                                    variant="warning text-black"
                                                                                                    key={log?.from_user?.profile.id}
                                                                                                >
                                                                                                    {log?.from_user?.profile.name}
                                                                                                </ListGroupItem>
                                                                                            ) : null
                                                                                        ))}
                                                                                    </ListGroupItem>
                                                                                </ListGroup>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded from</Badge>
                                                                </OverlayTrigger>
                                                            ) :
                                                                (
                                                                    null
                                                                )}
                                    </>
                                ) : document.assign.length > 0 && document.assign[0].assigned_id !== null ? (
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
                                                        {document.assign.map((assign, index) => (
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
                            </Col> 
                         </Row>

                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faFile} className="text-dark" style={{marginRight:'25px'}}/>
                                {document.document_type.description}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                                <Col>
                                    <FontAwesomeIcon icon={faCalendar} className='text-dark me-4'/>
                                    {moment(document.date_received).format('MMMM DD, YYYY')} 
                                    {/* <i style={{color:'#545454'}}> (Received {moment(document.date_received).fromNow()})</i>  */}
                                </Col>
                        </Row>

                        

                        <Row className="mb-3">
                            <Col>
                                <FontAwesomeIcon icon={faBuildingUser} className="text-dark" style={{marginRight:'18px'}}/>
                                {document.sender?.receivable?.title ?? document.sender.name}
                            </Col>
                        </Row>

                        {
                            (document.assign && document.assign.length > 0 && document.assign.filter(da => da.assigned_user?.role.level >= currentUser?.role.level).length > 0) && (
                                <Row className="mb-3">
                                    <Col>
                                        <FontAwesomeIcon icon={faUserCheck} className='text-dark' style={{marginRight:'18px'}}/>
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
                                <FontAwesomeIcon icon={faTag} className='text-dark me-4'/>
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
                                <FontAwesomeIcon icon={faQuoteLeft} className='text-dark me-4'/>
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

        </div>
    );
}

export default DocumentView;