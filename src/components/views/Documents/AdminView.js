import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faShare,
    faPaperclip,
    faCalendar,
    faUser,
    faFile,
    faHashtag
} from '@fortawesome/free-solid-svg-icons'
import {
    Button, 
    Row, 
    Col, 
    Breadcrumb, 
    Badge
} from 'react-bootstrap';

function AdminView() {
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

    const handleSubmit = event => {
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
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Document</Breadcrumb.Item>
                        <Breadcrumb.Item href="#" active>View</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col md="auto">
                    <Button>
                        <FontAwesomeIcon icon={faShare} className="text-link"/> Forward
                    </Button>
                </Col>
            </Row>
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

export default AdminView;