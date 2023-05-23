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
    faCircleArrowUp,
    faFileCircleCheck,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './styles.css';
import moment from 'moment';
import Select from 'react-select';
import apiClient from '../../../helpers/apiClient';
import Validator from 'validatorjs';

function Documents() {
    const [isLoading, setIsLoading] = useState(true); //loading variable
    const [errorMessage, setErrorMessage] = useState(''); //error message variable
    const [data, setData] = useState({ data: [] });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false); //loading variable
    const navigate = useNavigate();
    const [isSelectDisabled, setIsSelectDisabled] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const date_released = moment().format('YYYY-MM-DD');

    const [activeTab, setActiveTab] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');
    const [forwardError, setForwardError] = useState('');

    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });

    const documentTabs = [
        {
            key: 'all',
            title: 'All'
        },
        {
            key: 'ongoing',
            title: 'Ongoing'
        },
        {
            key: 'releasing',
            title: 'Releasing'
        },
        {
            key: 'done',
            title: 'Done'
        }
    ];

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
        if (activeTab === 'releasing') {
            apiClient.get('/document/releasing', {
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
        if (activeTab === 'done') {
            apiClient.get('/document/done', {
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
        if (activeTab === 'releasing') {
            apiClient.get(`/document/releasing?page=${pageNumber}`, {
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
        if (activeTab === 'done') {
            apiClient.get(`/document/done?page=${pageNumber}`, {
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

    const [showModalAction, setShowModalAction] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });
    const [formInputs, setFormInputs] = useState({
        comment: '',
    });

    const [formErrors, setFormErrors] = useState({
        comment: '',
    });
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
            let newData = [...data.data].map(d => {
                if (d.id === response.data.data.id) {
                    return {
                        ...response.data.data
                    };
                }

                return {
                    ...d
                };
            });
            setData({
                ...data,
                data: newData
            });
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

    //For assigning multiple users 
    const handleUserSelection = async (selectedOption) => {
        const userId = selectedOption.value;
        setSelectedUsers(userId);
    };

    const handleShowModal = (data = null) => {
        // if (!isDisabled) {
        //     let newOptions = users.map(user => ({
        //         value: user.id,
        //         label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`,
        //         data: user,
        //         isFixed: false,
        //         isDisabled: false
        //     }));

        //     let assignedUsers = data.assign.map(da => {
        //         return da.assigned_id;
        //     });
        //     let acknowledged = data.logs.map(dl => dl.acknowledge_id);

        //     newOptions = newOptions.map(no => {
        //         if (assignedUsers.includes(no.value)) {
        //             return {
        //                 ...no,
        //                 isFixed: acknowledged.includes(no.value)
        //             };
        //         }

        //         return {
        //             ...no,
        //             isFixed: false
        //         };
        //     });

        //     let toDisable = [];
        //     for (let i = 0; i < assignedUsers.length; i++) {
        //         let findOption = newOptions.find(no => no.value === assignedUsers[i]);
        //         if (findOption.data.id !== findOption.data.role.division.role.user.id) {
        //             toDisable.push(findOption.data.role.division.role.user.id);
        //         }

        //         if (findOption.data.role.level !== findOption.data.role.division.role.level+1) {
        //             for (let j = 0; j < users.length; j++) {
        //                 if (
        //                     users[j].role.level === findOption.data.role.division.role.level+1 &&
        //                     users[j].role.division_id === findOption.data.role.division.role.division_id
        //                 ) {
        //                     toDisable.push(users[j].id);
        //                 }
        //             }
        //         }
        //     }

        //     newOptions = newOptions.map(opt => {
        //         if (toDisable.includes(opt.value)) {
        //             return {
        //                 ...opt,
        //                 isDisabled: true
        //             };
        //         }

        //         return {
        //             ...opt,
        //             isDisabled: false
        //         };
        //     });
        //     setOptions(newOptions);
        //     setSelectedUsers(assignedUsers);
        // } else {
        //     let assignedUsers = data.assign.map(da => {
        //         return da.assigned_id;
        //     });
        //     setSelectedUsers([assignedUsers]);
        //     setIsSelectDisabled(true);
        // }

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

    //RELEASE
    const showReleaseAlert = document => {
        setIsDisabled(true)
        Swal.fire({
            title: `Are you sure you want to Release the document no."${document.tracking_no}"?`,
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Release it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.post(`/document/${document.id}/release`, { date_released }).then(response => {
                    let newData = [...data.data].map(d => {
                        if (d.id === response.data.data.id) {
                            return {
                                ...response.data.data
                            };
                        }

                        return {
                            ...d
                        };
                    });
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
                }).finally(() => {
                    setIsDisabled(false)
                });
            }
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
            confirmButtonColor: '#7066e0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, acknowledge it!',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return apiClient.post(`/document/${document.id}/acknowledge`).then(response => {
                    let newData = [...data.data].map(d => {
                        if (d.id === response.data.data.id) {
                            return {
                                ...response.data.data
                            };
                        }

                        return {
                            ...d
                        };
                    });
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
                }).finally(() => {
                    setIsDisabled(false)
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
                    navigate('../')
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
        setIsDisabled(true)
        event.preventDefault();

        let assignTo = [selectedUsers];

        const formData = new FormData();

        for (let i = 0; i < assignTo.length; i++) {
            formData.append(`assign_to[${i}]`, assignTo[i]);
        }

        apiClient.post(`/document/${modal.data?.id}/forward`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            let newData = [...data.data].map(d => {
                if (d.id === response.data.data.id) {
                    return {
                        ...response.data.data
                    };
                }

                return {
                    ...d
                };
            });
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
            setForwardError(error);
        }).finally(() => {
            setIsDisabled(false)
            setIsSelectDisabled(false);
            handleHideModal();
        });
    };

    const renderButtons = row => {
        return (
            <>
                {/* {
                    activeTab === 'ongoing' && (
                        <Button>Hello</Button>
                    )
                } */}

                {
                    (row.logs[0]?.to_id === row.user_id && row.logs[0]?.acknowledge_id !== row.user_id) && (
                        <Button variant="link" size='sm' onClick={e => showAcknowledgeAlert(row)}>
                            <FontAwesomeIcon icon={faUserCheck} className='ack-btn' />
                        </Button>
                    )
                }
                {
                    ((row.logs[0]?.assigned_id === row.user_id) && (row.logs[0]?.acknowledge_id === row.user_id)) && (
                        <Button variant="link" size='sm' onClick={e => handleShowAction(row)}>
                            <FontAwesomeIcon icon={faFileCircleCheck} className='text-success' />
                        </Button>
                    )
                }
                {
                    (row.logs.length === 0 || !row.logs.some(log => log.acknowledge_id !== null)) && (
                        <>
                            {
                                (row.category.is_assignable || row.logs.length === 0) && (
                                    <Button variant="link" size='sm' onClick={e => handleShowModal(row)}>
                                        <FontAwesomeIcon icon={faShare} className="" />
                                    </Button>
                                )
                            }
                            <Button variant="link" size='sm' as={Link} to={`edit/${row.id}`} >
                                <FontAwesomeIcon icon={faEdit} className="text-success" />
                            </Button>

                            {/* To add forward button for jun magbanua */}
                        </>
                    )
                }

                {
                    (!row.logs || row.logs.length === 0) && (
                        <Button onClick={e => showDeleteAlert(row)} variant="link" size="sm">
                            <FontAwesomeIcon icon={faTrash} className="text-danger" />
                        </Button>
                    )
                }

                {
                    (
                       ( row.logs[0]?.to_id === null &&
                        row.logs[0]?.from_id !== null &&
                        row.logs[0]?.action_id !== null &&
                        row.logs[0]?.acknowledge_id === null &&
                        row.logs[0]?.approved_id !== null &&
                        row.logs[0]?.released_at === null) ||
                        ((row.logs[0].action_id !== null && 
                            row.logs[0].to_id === null))
                    ) && (
                        <Button variant="outline-success" size='sm' onClick={e => showReleaseAlert(row)}>
                            <FontAwesomeIcon icon={faCircleArrowUp} className="" /> Release
                        </Button>
                    )
                }
            </>
        );
    }


    const renderTable = () => {
        if (isTableLoading) {
            return (
                <Spinner animation='border' />
            );
        }

        if (data.data.length === 0) {
            return (
                <Alert variant='primary'>
                    No documents found.
                </Alert>
            );
        }

        return (
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
                                            {row.logs.length > 0 ? (
                                                <>
                                                    {
                                                        (row.logs[0].released_at !== null) ? (
                                                            <Badge bg="primary">Done</Badge>
                                                        ) :
                                                            (row.logs[0]?.to_id === null &&
                                                                row.logs[0]?.from_id !== null &&
                                                                row.logs[0]?.action_id !== null &&
                                                                row.logs[0]?.acknowledge_id === null &&
                                                                row.logs[0]?.approved_id !== null &&
                                                                row.logs[0]?.released_at === null)  ||
                                                                (row.logs[0].action_id !== null && 
                                                                    row.logs[0].to_id === null) ? (
                                                                <Badge bg="success">For Releasing</Badge>
                                                            ) :
                                                                (row.logs[0].approved_id !== null) ? (
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
                                                                                            {row.logs[0]?.approved_user?.profile?.name}
                                                                                        </ListGroupItem>
                                                                                    </ListGroup>
                                                                                </Popover.Body>
                                                                            </Popover>
                                                                        }
                                                                    >
                                                                        <Badge bg="success" style={{ cursor: 'pointer' }}>Approved</Badge>
                                                                    </OverlayTrigger>
                                                                ) :
                                                                    (row.logs[0].rejected_id !== null) ? (
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
                                                                                            <ListGroupItem className="custom-rejected" >
                                                                                                {row.logs[0]?.rejected_user?.profile?.name}
                                                                                            </ListGroupItem>
                                                                                        </ListGroup>
                                                                                    </Popover.Body>
                                                                                </Popover>
                                                                            }
                                                                        >
                                                                            <Badge bg="" className="custom-rejected" style={{ cursor: 'pointer' }}>Rejected</Badge>
                                                                        </OverlayTrigger>
                                                                    ) :
                                                                        (row.logs[0].action_id !== null && row.logs[0].from_id !== null && row.logs[0].to_id !== null && row.logs[0].acknowledge_id !== null) ? (
                                                                            <OverlayTrigger
                                                                                trigger={['click', 'hover']}
                                                                                placement="left"
                                                                                overlay={
                                                                                    <Popover>
                                                                                        <Popover.Header className="custom-acted text-white">
                                                                                            Acted by
                                                                                        </Popover.Header>
                                                                                        <Popover.Body>
                                                                                            <ListGroup variant="flush">
                                                                                                <ListGroupItem className="custom-acted text-white" >
                                                                                                    {row.logs[0]?.action_user?.profile?.name}
                                                                                                </ListGroupItem>
                                                                                            </ListGroup>
                                                                                        </Popover.Body>
                                                                                    </Popover>
                                                                                }
                                                                            >
                                                                                <Badge bg="" className='custom-acted' style={{ cursor: 'pointer' }}>Acted</Badge>
                                                                            </OverlayTrigger>
                                                                        ) :
                                                                            (row.logs[0].acknowledge_id !== null && row.logs[0].action_id === null) || (row.logs[0].acknowledge_id !== null && row.logs[0].action_id !== null) ? (
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
                                                                                            </Popover.Body>
                                                                                        </Popover>
                                                                                    }
                                                                                >
                                                                                    <Badge bg='' className="custom-badge" style={{ cursor: 'pointer' }}>Acknowledged</Badge>
                                                                                </OverlayTrigger>
                                                                            ) : row.logs[0].to_id !== null ? (
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
                                                                                                    {row.logs.length > 0 ? (
                                                                                                        <ListGroupItem className="bg-warning text-white"
                                                                                                            key={row.logs[0]?.user.profile.id}
                                                                                                        >
                                                                                                            {row.logs[0]?.user.profile.name}
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
                                            ) : null}
                                        </td>

                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            <Button className='me-1' variant="outline-primary" size='sm' as={Link} to={`view/${row.id}`} >
                                                <FontAwesomeIcon icon={faCircleArrowRight} className="" /> View
                                            </Button>
                                            {renderButtons(row)}
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
        );
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
                {
                    documentTabs.map(tab => (
                        <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
                            {renderTable()}
                        </Tab>
                    ))
                }
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
                            <Form.Label>
                                {!isSelectDisabled ? (
                                    <><span className=''>Forward to</span> :</>
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
                    <Button type='submit' variant='primary' onClick={handleForward} disabled={isDisabled || (selectedUsers && modal?.data?.logs?.find(l => l.to_id === +selectedUsers))}>
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


        </div>
    );
}

export default Documents;