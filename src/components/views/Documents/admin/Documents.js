import React, { useEffect, useState }  from 'react';
import {
    Button, 
    Modal, 
    Form, 
    Table, 
    Row, 
    Col, 
    Breadcrumb,
    Tab,
    Tabs,
    Badge
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faPaperclip,
    faCircleArrowRight,
    faRightToBracket,
    faShare
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import './styles.css';

function Documents() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                tracking: 1,
                documenttype: 'Curriculum',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                attach: 'sample file',
                datereceived: 'February 5, 2023',
                status: 'Received',
            },
            {
                tracking: 2,
                documenttype: 'CAV',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                attach: 'sample file',
                datereceived: 'March 22, 2023',
                status: 'Forwarded to RD',
            },
            {
                tracking: 3,
                documenttype: 'CAV',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                attach: 'sample file',
                datereceived: 'April 23, 2023',
                status: 'Acknowledge',
            }
        ]);
    }, []);

    //VALIDATION ON ADDING
    const [validated, setValidated] = useState(false);

    const handleSubmit = event => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            setValidated(true);
    };

     //MODAL ADD
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };

    //MODAL EDIT
    const [show2, setShow2] = useState(false);
 
    const handleClose2 = () => {
        setShow2(false)
    };
    const handleShow2 = () => {
        setShow2(true)
    };

    // DELETE
    const showAlert = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
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
            <div className="crud bg-body rounded">
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <h1>Documents</h1>
                    </Col>
                    <Col md="auto">
                    <div className="search">
                            <Form className="mb-3" controlId="">
                                <Form.Control type="search" placeholder="Search" />
                            </Form>
                    </div>
                    </Col>
                    <Col md="auto">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">
                                <Button variant="primary">  
                                    <FontAwesomeIcon icon={faRightToBracket} rotation = {90} className="addIcon"/> Receive
                                </Button>
                            </Breadcrumb.Item>
                        </Breadcrumb>
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
                            <th>Received From</th>
                            <th>Description</th>
                            <th>Attachment</th>
                            <th>Date Received</th>
                            <th>Status</th>
                            <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.tracking}</td>
                                        <td>{row.documenttype}</td>
                                        <td>{row.receivedfrom}</td>
                                        <td>{row.description}</td>
                                        <td className="p-0 m-2">
                                            <Button variant="link">
                                                <FontAwesomeIcon icon={faPaperclip} className="text-primary ml-2"/> {row.attach}
                                            </Button>
                                        </td>
                                        <td>{row.datereceived}</td>

                                        <td>{
                                                row.status === 'Acknowledge' && (
                                                    <>
                                                    <Badge bg="info" >
                                                    {row.status}
                                                    </Badge>
                                                    </>
                                                ) || row.status === 'Forwarded to RD' && (
                                                    <>
                                                    <Badge bg="warning" >
                                                    {row.status}
                                                    </Badge>
                                                    </>
                                                )
                                                || row.status === 'Received' && (
                                                    <>
                                                    <Badge bg="primary">
                                                    {row.status}
                                                    </Badge>
                                                    </>
                                                )
                                            }
                                        </td>

                                        <td style={{ whiteSpace: 'nowrap' }}>
                                                <Button variant="outline-primary" size='sm' >
                                                    <FontAwesomeIcon icon={faCircleArrowRight} className=""/> View
                                                </Button>
                                                {
                                                    row.status !== 'Acknowledge' && (
                                                    <>
                                                        {
                                                            row.status === 'Received' && (
                                                                <Button variant="link" size='sm'>
                                                                    <FontAwesomeIcon icon={faShare} className=""/>
                                                                </Button>
                                                            )
                                                        }
                                            
                                                        <Button variant="link" size='sm' >
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
                </Tab>
                <Tab eventKey="ongoing" title="Ongoing" >
                </Tab>
                <Tab eventKey="releasing" title="Releasing" >
                </Tab>
                <Tab eventKey="done" title="Done">
                </Tab>
            </Tabs>

            {/* <!--- Model Box ADD ---> */}
            <div className="model_box">
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add</Modal.Title>
                    </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>UII</Form.Label>
                                    <Form.Control  type="text" placeholder="Enter UII" required/>
                                    <Form.Control.Feedback type="invalid">Please enter UII.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Name" required/>
                                    <Form.Control.Feedback type="invalid">Please enter name.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Streets/Barangay</Form.Label>
                                    <Form.Control type="text" placeholder="Streets/Barangay" required/>
                                    <Form.Control.Feedback type="invalid">Please enter street/barangay.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>City/Municipality</Form.Label>
                                    <Form.Control type="text" placeholder="Enter City/Municipality" required/>
                                    <Form.Control.Feedback type="invalid">Please enter city/municipality.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Province</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Province" required/>
                                    <Form.Control.Feedback type="invalid">Please enter province.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-2" controlId="">
                                    <Form.Label>Head of Institution</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Head of Institution" required/>
                                    <Form.Control.Feedback type="invalid">Please enter head of institution.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Add 
                            </Button>
                        </Modal.Footer>
                </Form>
                </Modal>
                {/* Model Box Finish */}


                {/* <!--- Model Box EDIT ---> */}
                <div className="model_box">
        <Modal
            show={show2}
            onHide={handleClose2}
            backdrop="static"
            keyboard={false}
        >
        <Modal.Header closeButton>
            <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
                <Row>
                    <Col md={3}>
                        <Form.Group className="mb-2" controlId="">
                            <Form.Label>UII</Form.Label>
                            <Form.Control  type="text" placeholder="Enter UII" required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2" controlId="">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" required/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-2" controlId="">
                            <Form.Label>Streets/Barangay</Form.Label>
                            <Form.Control type="text" placeholder="Streets/Barangay" required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2" controlId="">
                            <Form.Label>City/Municipality</Form.Label>
                            <Form.Control type="text" placeholder="Enter City/Municipality" required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2" controlId="">
                            <Form.Label>Province</Form.Label>
                            <Form.Control type="text" placeholder="Enter Province" required/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-2" controlId="">
                            <Form.Label>Head of Institution</Form.Label>
                            <Form.Control type="text" placeholder="Enter Head of Institution" required/>
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                    Cancel
                </Button>
                <Button variant="primary">
                    Done 
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>

   {/* Model Box Finish */}
                </div>
            </div>
        </div>
    );
}

export default Documents;