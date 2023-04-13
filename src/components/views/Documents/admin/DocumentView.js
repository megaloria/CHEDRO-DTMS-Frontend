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
    Spinner
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
    faUserCheck
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
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [isValid, setIsValid] = useState(true);
    const [isNavigationLoading, setIsNavigationLoading] = useState(true);
    const [isSelectDisabled, setIsSelectDisabled] = useState(false);
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


    const handleForward = event => {

        const formData = new FormData();

        for (let i = 0; i < selectedUsers.length; i++) {
            formData.append(`assign_to[${i}]`, selectedUsers[i]);
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
            setIsValid(false);
        });
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

    //For assigning multiple users 
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
        // Update the form validity
        setIsValid(selectedOptions.length > 0);
    };

    const handleHideModal = () => {
        setIsValid(true);
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
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item linkAs={Link} linkProps={{  to: '../' }}>Document</Breadcrumb.Item>
                            <Breadcrumb.Item href="#" active>View</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col md="auto">
                        <Button onClick={e => {
                            if (document.logs.length > 0 && document.logs.some(log => log.acknowledge_id !== null)) {
                                setIsSelectDisabled(false);
                            } else if (!document.category.is_assignable && document.logs.length > 0 && document.logs.some(log => log.to_id !== null)) {
                                setIsSelectDisabled(true);
                            } else if (!document.category.is_assignable) {
                                setIsSelectDisabled(true);
                            }
                            handleShowModal(document);
                        }}>
                            <FontAwesomeIcon icon={faShare} className="text-link"/> Forward
                        </Button>
                    </Col>
                </Row>
            </div>

            <div style={{margin:'0 30px', }}> 
                <Card 
                        bg="light"
                        border="light" style={{ marginRight:'auto'}}>
    
                    <Card.Body>
                    <Row>
                            <Col className='float-right offset-md-10'>
                                <FontAwesomeIcon icon={faClock} style={{color:'#545454'}}/>
                                <i style={{color:'#545454'}}> {moment(document.created_at).format('MMMM DD, YYYY')} 
                                 </i> 
                            </Col> 
                    </Row>
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
                                        {document.logs.some(log => log.acknowledge_id !== null) ? (
                                            <OverlayTrigger
                                                trigger={['click', 'hover']}
                                                placement="left"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Header className="bg-warning text-white">
                                                            Acknowledged by
                                                        </Popover.Header>
                                                        <Popover.Body>
                                                            <ListGroup variant="flush">
                                                                {Array.from(new Set(document.logs.map(log => log.acknowledge_user && log.acknowledge_user.profile.name)))
                                                                    .filter(name => name !== null)
                                                                    .map(name => (
                                                                        <ListGroupItem variant="warning text-black" key={name}>
                                                                            {name}
                                                                        </ListGroupItem>
                                                                    ))}
                                                            </ListGroup>
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <Badge bg="warning" style={{ cursor: 'pointer' }}>Acknowledged</Badge>
                                            </OverlayTrigger>
                                        ) : document.logs.some(log => log.to_id !== null) ? (
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
                                    <i style={{color:'#545454'}}> (Received {moment(document.date_received).fromNow()})</i> 
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
                            <FontAwesomeIcon icon={faPaperclip} className='text-dark me-4'/>
                            {document.attachments.file_title}
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
           
          <Timeline/>
          
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
                                isMulti
                                name='assignTo'
                                options={options}
                                value={selectedOptions}
                                onChange={handleUserSelection}
                                Required
                                isDisabled={isSelectDisabled}
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

export default DocumentView;