import React, { useEffect, useState }  from 'react';
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
    // faPaperclip,
    faCircleArrowRight,
    faRightToBracket,
    faShare,
    faSearch,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './styles.css';
import Select from 'react-select';
import apiClient from '../../../helpers/apiClient';

function Documents() {
    const [data, setData] = useState([]);
    const [formInputs, setFormInputs] = useState({ // input inside the modal
        // forward: ''
    });
    const [modal, setModal] = useState({ //modal variables
        show: false,
        data: null,
        isLoading: false
    });
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    


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
        setFormInputs({
            description: ''
        });
        setModal({
            show: false,
            data: null,
            isLoading: false
        });
    } 

    useEffect(() => {
        setData([
            {
                tracking: 1,
                documenttype: 'Curriculum',
                category: 'Ordinary',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                // attach: 'sample file',
                datereceived: 'February 5, 2023',
                status: 'Received',
            },
            {
                tracking: 2,
                documenttype: 'CAV',
                category: 'Confidential',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                // attach: 'sample file',
                datereceived: 'March 22, 2023',
                status: 'Forwarded to RD',
            },
            {
                tracking: 3,
                documenttype: 'CAV',
                category: 'Urgent',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                // attach: 'sample file',
                datereceived: 'April 23, 2023',
                status: 'Acknowledge',
            }
        ]);
    }, []);

    //VALIDATION ON ADDING
    // const [validated, setValidated] = useState(false);

    // const handleSubmit = event => {
    //     const form = event.currentTarget;
    //         if (form.checkValidity() === false) {
    //             event.preventDefault();
    //             event.stopPropagation();
    //         }
    //         setValidated(true);
    // };

     //MODAL ADD
    // const [show, setShow] = useState(false);
    // const handleClose = () => {
    //     setShow(false)
    // };
    // const handleShow = () => {
    //     setShow(true)
    // };

    //MODAL EDIT
    // const [show2, setShow2] = useState(false);
 
    // const handleClose2 = () => {
    //     setShow2(false)
    // };
    // const handleShow2 = () => {
    //     setShow2(true)
    // };

     //Forward: assigning multiple users 
    const handleUserSelection = (selectedOptions) => {
        const userIds = selectedOptions.map(option => option.value);
        setSelectedUsers(userIds);
      };

      const options = users.map(user => ({
        value: user.id,
        label: `${user.profile.position_designation} - ${user.profile.first_name} ${user.profile.last_name}`
      }));
    
      useEffect(() => {
        apiClient.get('/document')
            .then(response => {
                setUsers(response.data.data.users);
            })
            .catch(error => {
                setErrorMessage(error);
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

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


    // DELETE
    const showAlert = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
            }
          })
    };

    return (
        <div class="container fluid">
            <div className="crud rounded">
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <h1>Documents</h1>
                    </Col>
                    <Col md="auto">
                        <div className="search">
                            <Form className="d-flex" controlId="">
                                <Form.Control 
                                    type="search" 
                                    placeholder="Search" 
                                    className="me-2"
                                />
                                <Button>
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
                <div class="row">
                    <div class="table-responsive " >
                        <Table striped bordered hover size="md">
                        <thead>
                            <tr>
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
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.tracking}</td>
                                        <td>{row.documenttype}</td>
                                        <td>{row.category}</td>
                                        <td>{row.receivedfrom}</td>
                                        <td>{row.datereceived}</td>
                                        <td>{row.description}</td>
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
                                            <Button variant="outline-primary" size='sm' as={Link} to='view' >
                                                    <FontAwesomeIcon icon={faCircleArrowRight} className=""/> View
                                                </Button>
                                                {
                                                    row.status !== 'Acknowledge' && (
                                                    <>
                                                        {
                                                            row.status === 'Received' && (
                                                               //Forward
                                                                <Button variant="link" size='sm' onClick={e => handleShowModal()}>
                                                                    <FontAwesomeIcon icon={faShare} className=""/> 
                                                                </Button>
                                                            )
                                                        }
                                            
                                                        <Button variant="link" size='sm' as={Link} to='edit'>
                                                            <FontAwesomeIcon icon={faEdit} className="text-success"/>
                                                        </Button>
                                                    
                                                        <Button onClick={showAlert} variant="link" size='sm' >
                                                            <FontAwesomeIcon icon={faTrash} className="text-danger"/>
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
                       
                            <Pagination style={{ float: 'right' }}>
                                {/* <Pagination.First onClick={e => handlePageChange(1)} disabled={data.current_page === 1} />  */}
                                <Pagination.First />
                                {/* <Pagination.Prev onClick={e => handlePageChange(data.current_page - 1)} disabled={data.current_page === 1} /> */}
                                <Pagination.Prev />
                                <Pagination.Item disabled>
                                    {/* {`${data.current_page} / ${data.last_page}`} */}
                                    /
                                </Pagination.Item>
                                {/* <Pagination.Next onClick={e => handlePageChange(data.current_page + 1)} disabled={data.current_page === data.last_page} /> */}
                                <Pagination.Next />
                                {/* <Pagination.Last onClick={e => handlePageChange(data.last_page)} disabled={data.current_page === data.last_page} /> */}
                                <Pagination.Last />
                            </Pagination>
                      
                    </div> 

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