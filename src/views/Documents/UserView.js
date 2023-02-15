import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faUserCheck,
    faThumbsUp,
    faPaperclip,
    faCalendar,
    faUser,
    faFile,
    faHashtag,
    faSquareCheck
} from '@fortawesome/free-solid-svg-icons'
import {Button, Modal, Input, Form, Table, Row, Col, Breadcrumb, InputGroup, Badge} from 'react-bootstrap';
import Swal from 'sweetalert2';


function Home() {

    const [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                id: 1,
                description: 'Regional Director'
            },
            {
                id: 2,
                description: 'Chief Administrative Officer'
            },
            {
                id: 3,
                description: 'Secretary'
            },
            {
                id: 4,
                description: 'Assistant'
            },
        ]);
    }, []);

    //VALIDATION ON ADDING RECORD
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
    };

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
                <Breadcrumb>
                    <Breadcrumb.Item href="#">Document</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>View</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
                <Col md="auto">
                    {btnShow ? (
                    <Col>
                        <Button className="me-2" variant="warning">
                            <FontAwesomeIcon icon={faUserCheck} className="text-link" /> Assign 
                        </Button>

                        <Button className="" variant="success">
                            <FontAwesomeIcon icon={faSquareCheck} className="text-link" /> Take Action 
                        </Button> 
                    </Col>
                    ) : (
                        <Button onClick={handleShow} variant="primary">
                            <FontAwesomeIcon icon={faThumbsUp} className="text-link"/> Acknowledge    
                        </Button>
                    )
                }
                </Col>
            </Row>

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

            </div>
                <Row className="mb-3">
                    <Col>
                        <FontAwesomeIcon icon={faHashtag} className="text-secondary" style={{marginRight:'20px'}}/>
                        23-000
                    </Col>
                
                </Row>

                <Row className="mb-3">
                    <Col>
                        <FontAwesomeIcon icon={faFile} className="text-secondary " variant="link" style={{marginRight:'20px'}}/>
                        sample file 
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Badge bg="primary" style={{width: 120}}>received</Badge>
                    </Col> 
                </Row>

                <Row className="mb-3">
                    <Col>
                        <FontAwesomeIcon icon={faUser} className="text-secondary" style={{marginRight:'20px'}}/>
                        user
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <FontAwesomeIcon icon={faCalendar} className="text-secondary" style={{marginRight:'20px'}}/>
                        mm/dd/yyy
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col row={5}>
                        Description
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col >
                        <FontAwesomeIcon icon={faPaperclip} className="text-secondary" style={{marginRight:'20px'}}/>
                        sample.docx
                    </Col>
                </Row>

            <div>
            
        </div>
        </div>
    
        
    );
}

export default Home;