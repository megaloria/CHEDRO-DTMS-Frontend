import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {
    FontAwesomeIcon, 
} from '@fortawesome/react-fontawesome'
import {
    faThumbsUp,
    faSquareCheck,
    faPaperclip,
    faCircleArrowRight,
    faUserCheck,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import {
    Button, 
    Modal, 
    Form, 
    Table, 
    Row, 
    Col, 
    Tab,
    Tabs,
    Badge
} from 'react-bootstrap';
import './userdocu-styles.css';


function UserDocu() {
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
                status: 'Forwarded from RD',
            },
            {
                tracking: 2,
                documenttype: 'CAV',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                attach: 'sample file',
                datereceived: 'March 22, 2023',
                status: 'Approved by OIC',
            },
            {
                tracking: 3,
                documenttype: 'CAV',
                receivedfrom: 'Roel Cristobal',
                description: 'Lorem ipsum dolor',
                attach: 'sample file',
                datereceived: 'April 23, 2023',
                status: 'Rejected by ES II',
            }
        ]);
    }, []);

     // 2 buttons will show
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [btnShow, setShowbtn] = useState(false);
    
    const showButton = event => {
        setShowbtn(current => !current);
        setShow(false);
    };

    return (
        <div class="container fluid">
          <div className="crud bg-body rounded">
            
          <Row className= "justify-content-end mt-4 mb-3">
            <Col>
            <h1>User-View-Documents</h1>
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
            {/* <Col md="auto">
            <Breadcrumb>
                <Breadcrumb.Item href="#">
                    <Button variant="primary">  
                        <FontAwesomeIcon icon={faRightToBracket} rotation = {90} className="addIcon"/> Receive
                    </Button>
              </Breadcrumb.Item>
            </Breadcrumb>
             </Col>  */}
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
                <th>Actions</th>
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
                                row.status === 'Forwarded from RD' && (
                                    <>
                                    <Badge bg="warning" >
                                     {row.status}
                                    </Badge>
                                    </>
                                ) || row.status === 'Approved by OIC' && (
                                    <>
                                    <Badge bg="success" >
                                     {row.status}
                                    </Badge>
                                    </>
                                )
                                || row.status === 'Rejected by ES II' && (
                                    <>
                                    <Badge bg="danger">
                                     {row.status}
                                    </Badge>
                                    </>
                                )
                            }
                        </td>

                        <td className="column" >
                                <Button variant="outline-primary" size='sm' className="me-2">
                                    <FontAwesomeIcon icon={faCircleArrowRight} className=""/> View
                                </Button>
                                {
                                row.status === 'Forwarded from RD' && (
                                    <>
                                {btnShow ? (
                                    <Col className="mt-2" >
                                    <Button className="me-1" size='sm' variant="outline-warning">
                                        <FontAwesomeIcon icon={faUserCheck} className="link" />
                                    </Button>
                                    <Button className="" size='sm' variant="outline-success">
                                        <FontAwesomeIcon icon={faSquareCheck} className="link" />
                                    </Button> 
                                    </Col>
                                ) : (
                                    <Button variant="outline-primary" size='sm' className="me-2" onClick={handleShow}>
                                        <FontAwesomeIcon icon={faThumbsUp} className=""/>
                                    </Button>
                                )
                                    } 
                                    </>
                                 )
                                }
                                {
                                row.status === 'Rejected by ES II' && (
                                    <>
                                    <Button variant="outline-success" size='sm' className="me-2">
                                        <FontAwesomeIcon icon={faSquareCheck} className=""/>
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

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Acknowledge</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to acknowledge the receipt of this document?</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
                No
            </Button>
            <Button variant="primary" onClick={showButton}>
                Yes
            </Button>
            </Modal.Footer>
        </Modal>
            </Tab>

            
            <Tab eventKey="new" title="New" >
            </Tab>

            <Tab eventKey="reject" title="Rejected" >

            </Tab>

            <Tab eventKey="approved" title="Approved">
            </Tab>
            </Tabs> 
     
   </div>
    );
}

export default UserDocu;