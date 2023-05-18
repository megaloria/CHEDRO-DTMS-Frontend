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
    faEdit,
    faThumbsUp
} from '@fortawesome/free-solid-svg-icons'
import {
    Link, useLoaderData, useNavigate, useLocation
} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../../helpers/apiClient';
import Swal from 'sweetalert2';

function DocumentView() {
    const document = useLoaderData();
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
        let newTimelineData = document.logs.map(log =>
            ({ 
            text: log.rejected_id !== null && log.from_id === null ? <RejectedUsersText key={log.id} users={[log?.rejected_user?.profile]} log={log}/> : 
                    log.approved_id !== null && log.from_id === null ? <ApprovedUsersText key={log.id} users={[log?.approved_user?.profile]}log={log}/> :
                        log.action_id !== null && log.comment !== null && log.from_id === null ? <ActionedUsersText key={log.id} users={[log?.action_user?.profile]} log={log}/> :
                            log.acknowledge_id !== null && log.from_id === null ? <AcknowledgedUsersText key={log.id} users={[log?.acknowledge_user?.profile]} log={log}/> :
                                log.to_id !== null ? <ForwardedUsersText key={log.id} users={[log?.user?.profile]} /> : log.to_id === null ? 'Document for Releasing' : null,
                date: moment(log.created_at).format('MMMM DD, YYYY h:mm:ss A'),
                category: {
                    tag: log.assigned_user?.profile.name,
                    color: '#6dedd4',
                },
                circleStyle: {
                    borderColor: '#e17b77',
                },
            })
        )

        newTimelineData = newTimelineData.concat(
                document.assign.map((assign) => ({
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

        setTimelineData(newTimelineData);
    }, [document.logs, document.assign]);


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

    //For assigning multiple users 
    const handleUserSelection = async (selectedOption) => {
        const userId = selectedOption.value;
        setSelectedUsers(userId);
    };

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
                        (document.logs[0]?.to_id === document.user_id && document.logs[0]?.acknowledge_id !== document.user_id) && (
                            <Button variant="success" /*onClick={e => showAcknowledgeAlert(document)}*/>
                                <FontAwesomeIcon icon={faThumbsUp} /> <span className='d-none d-md-inline-block'>Acknowledge</span>
                            </Button>
                        )
                    }
                    {
                        (document.logs.length === 0 || !document.logs.some(log => log.acknowledge_id !== null)) && (
                            <>
                                {
                                    (document.category.is_assignable || document.logs.length === 0) && (
                                        <Button className="ms-2" onClick={e => handleShowModal(document)}>
                                            <FontAwesomeIcon icon={faShare} /> <span className='d-none d-md-inline-block'>Forward</span>
                                        </Button>
                                    )
                                }
                                <Button variant='success' className="ms-2" as={Link} to={`../edit/${document.id}`} state={{ from: 'view' }} >
                                    <FontAwesomeIcon icon={faEdit} />  <span className='d-none d-md-inline-block'>Edit</span>
                                </Button>
                            </>
                        )
                    }
                </div>
            </div>

            <div className='m-1'> 
                <Card 
                        bg="light"
                        border="light" style={{ marginRight:'auto'}}>
    
                    <Card.Body>
                        <div className='text-end'>
                            <div className="d-none d-md-block" style={{ whiteSpace: 'nowrap'}} >
                                    <FontAwesomeIcon icon={faClock} style={{color:'#545454'}}/>
                                    <i style={{color:'#545454'}}> {moment(document.created_at).format('MMMM DD, YYYY')} 
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
                                    trigger={['click', 'hover']}
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
                                                document.logs[0]?.from_id !== null &&
                                                document.logs[0]?.action_id !== null &&
                                                document.logs[0]?.acknowledge_id === null &&
                                                document.logs[0]?.approved_id !== null) ? (
                                                                <Badge bg="success" style={{ cursor: 'pointer' }}>For Releasing</Badge>
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
                                                                            <Popover.Header className="bg-success text-white">
                                                                                Rejected by
                                                                            </Popover.Header>
                                                                            <Popover.Body>
                                                                                <ListGroup variant="flush">
                                                                                        <ListGroupItem variant="success text-black" >
                                                                                            {document.logs[0]?.rejected_user?.profile?.name}
                                                                                        </ListGroupItem>
                                                                                </ListGroup>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Badge bg="success" style={{ cursor: 'pointer' }}>Rejected</Badge>
                                                                </OverlayTrigger>
                                                            ) :
                                                        (document.logs[0].action_id !== null && document.logs[0].from_id !== null && document.logs[0].to_id !== null) ? (
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
                                                                }
                                                            >
                                                                <Badge bg="success" style={{ cursor: 'pointer' }}>Acted</Badge>
                                                            </OverlayTrigger>
                                                        ) :
                                                            (document.logs[0].acknowledge_id !== null && document.logs[0].action_id === null) || (document.logs[0].acknowledge_id !== null && document.logs[0].action_id !== null) ? (
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
                                                                                    {Array.from(new Set(document.logs.map(log => log.acknowledge_user && log.acknowledge_user.profile.name)))
                                                                                        .filter(name => name !== null)
                                                                                        .map(name => (
                                                                                            <ListGroupItem className="custom-badge text-white" style={{ cursor: 'pointer' }} key={name}>
                                                                                                {name}
                                                                                            </ListGroupItem>
                                                                                        ))}
                                                                                </ListGroup>

                                                                                {document.logs.filter(log => log.to_id !== null && log.acknowledge_id === null && !document.logs.some(otherLog => otherLog.acknowledge_id === log.to_id)).length > 0 && (
                                                                                    <div>Forwarded To:</div>
                                                                                )}
                                                                                <ListGroup variant="flush">
                                                                                    {document.logs.filter(log => log.to_id !== null && log.acknowledge_id === null && !document.logs.some(otherLog => otherLog.acknowledge_id === log.to_id)).map((log, index) => (
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
                                                        ) : document.logs[0].to_id !== null ? (
                                                            <OverlayTrigger
                                                                trigger={['click', 'hover']}
                                                                placement="bottom"
                                                                overlay={
                                                                    <Popover>
                                                                        <Popover.Header className="bg-warning text-white">
                                                                            Forwarded to
                                                                        </Popover.Header>
                                                                        <Popover.Body>
                                                                            <ListGroup variant="flush">
                                                                                {document.logs.length > 0 ? (
                                                                                        <ListGroupItem
                                                                                            variant="warning text-black"
                                                                                            key={document.logs[0]?.user.profile.id}
                                                                                        >
                                                                                            {document.logs[0]?.user.profile.name}
                                                                                        </ListGroupItem>
                                                                                 ) : null}
                                                                            </ListGroup>
                                                                        </Popover.Body>
                                                                    </Popover>
                                                                }
                                                            >
                                                                <Badge bg="warning" style={{ cursor: 'pointer' }}>Forwarded to</Badge>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <Badge bg="primary">Received</Badge>
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
                                                ) : <Badge bg="primary">Received</Badge>}
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

                        {document.assign && document.assign.length > 0 ? (
                        <Row className="mb-3">
                            <Col> 
                            <FontAwesomeIcon icon={faUserCheck} className='text-dark' style={{marginRight:'18px'}}/>
                                {document.assign.map((assign, index) => (
                                    <span key={assign.assigned_user.profile.id}>
                                        {assign.assigned_user.profile.name}
                                        {index !== document.assign.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </Col>
                            </Row>    
                                ) : ( null
                                   
                                )}
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