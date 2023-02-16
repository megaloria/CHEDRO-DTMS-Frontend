import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash, 
    faEdit,
    faPaperclip,
    faCircleArrowRight,
    faRightToBracket,
    faShare,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import {
    Button, 
    Form, 
    Table, 
    Row, 
    Col, 
    Breadcrumb,
    Tab,
    Tabs,
    Badge,
    Modal,
} from 'react-bootstrap';
import Swal from 'sweetalert2'; 
import './Documents-styles.css';


function AdminDocu() {
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
                status: 'Acknowledge by OIC',
            }
        ]);
    }, []);

    //VALIDATION ON ADDING
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
    };

     //MODAL FORWARD
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
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
            <h1>Admin-View-Documents</h1>
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
            <Breadcrumb>
                <Breadcrumb.Item href="#">
                    <Button variant="primary">  
                        <FontAwesomeIcon 
                        icon={faRightToBracket} 
                        rotation = {90} 
                        className="" 
                        /> Receive
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
                                row.status === 'Acknowledge by OIC' && (
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
                                                <Button variant="link" size='sm' onClick={handleShow}>
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
  
        <Modal 
        style={{width:'fitContent'}}
        show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Forward</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <p> You're about to forward this document to Dr. Virginia Akiate (Regional Director)</p>
                    <p> Are you sure you want to continue?</p>
                
                </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
                No
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Yes
            </Button>
            </Modal.Footer>
      </Modal>
   </div>
    );
}

export default AdminDocu;