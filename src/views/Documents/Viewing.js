import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faRotate,
    faCalendar,
    faUser,
    faFile,
    faHashtag
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
   

    return (
        <div class="container fluid">
          <div className="crud bg-body rounded"> 

        <Row className= "justify-content-end mt-4 mb-3">
            <h1>View</h1>
        </Row>


        </div>
            <Row className="mb-3">
            {/* <Button>
                forward
            </Button> */}
                <Col>
                    <FontAwesomeIcon icon={faHashtag} className="text-secondary"/>
                    23-000
                </Col>
            
            </Row>

            <Row className="mb-3">
                <Col>
                    <FontAwesomeIcon icon={faFile} className="text-secondary" variant="link"/>
                    sample file
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <Badge bg="primary">received</Badge>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FontAwesomeIcon icon={faUser} className="text-secondary"/>
                    user
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FontAwesomeIcon icon={faCalendar} className="text-secondary"/>
                    user
                </Col>
            </Row>

        <div>
            
        </div>

    </div>
        
    );
}

export default Home;