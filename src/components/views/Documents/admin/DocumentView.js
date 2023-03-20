// import React, { useEffect, useState }  from 'react';
import Timeline from '../../../units/Timeline/Timeline';
import Card from 'react-bootstrap/Card';
import React from 'react';
import {
    Button,
    Row, 
    Col, 
    Breadcrumb, 
    Badge,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faShare,
    faPaperclip,
    faCalendar,
    faCircleUser,
    faFile,
    faHashtag,
    faQuoteLeft,
    faTimeline,
    faTag,
    faBuildingUser,
    faKeyboard
} from '@fortawesome/free-solid-svg-icons'
import {
    Link, useLoaderData
} from 'react-router-dom';
import moment from 'moment';


function DocumentView() {
    const document = useLoaderData();

    return (
        <div class="container fluid">
            <div className="crud bg-body rounded"> 
                <Row className= "justify-content-end mt-4 mb-3">
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item linkAs={Link} linkProps={{  to: '../' }}>Document</Breadcrumb.Item>
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

            <div style={{margin:'0 30px', }}> 
                    <Card 
                    bg="light"
                    border="light" style={{ marginRight:'auto'}}>
                    {/* <Card.Header> </Card.Header> */}
                    <Card.Body>
                    <Card.Title> 
                    </Card.Title>
                    {/* <Card.Text> */}
                    <Row className="mb-3"> 
                            <Col> 
                            <FontAwesomeIcon 
                            icon={faHashtag} className="text-dark" style={{marginRight:'20px'}}/>
                            {document.tracking_no}
                            </Col>
                        </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faFile} className="text-dark " variant="link" style={{marginRight:'20px'}}/>
                            {document.document_type.description}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faTimeline} className="text-dark " variant="link" style={{marginRight:'20px'}}/>
                            <Badge bg="primary">Received</Badge>
                        </Col> 
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faCircleUser} className="text-dark" style={{marginRight:'20px'}}/>
                            {document.user.profile.name}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faCalendar} className="text-dark" style={{marginRight:'20px'}}/>
                            {moment(document.date_received).format('MMMM DD, YYYY')} 
                            <i> (Received {moment(document.date_received).fromNow()})</i> 
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faKeyboard} className="text-dark" style={{marginRight:'20px'}}/>
                            {moment(document.created_at).format('MMMM DD, YYYY')} 
                            <i> (Encoded {moment(document.created_at).fromNow()})</i> 
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faBuildingUser} className="text-dark" style={{marginRight:'20px'}}/>
                            {document.sender.receivable.description}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col row={5}>
                            <FontAwesomeIcon icon={faQuoteLeft} className="text-dark " variant="link" style={{marginRight:'20px'}}/>
                            {document.description}
                        </Col>
                    </Row>
    
                        {document.attachments?.file_title ? (
                            <Row className="mb-3"> 
                            <Col>
                            <FontAwesomeIcon icon={faPaperclip} className="text-dark" style={{ marginRight: "20px" }} />
                            {document.attachments.file_title}
                           </Col>
                           </Row> 
                        ) : null}
                        
                    <Row className="mb-3">
                        <Col >
                            <FontAwesomeIcon icon={faTag} className="text-dark" style={{marginRight:'20px'}}/>
                            {document.category.description}
                        </Col>
                    </Row>
                    {/* </Card.Text> */}
                    </Card.Body>
                    {/* <Card.Footer>
                    </Card.Footer> */}
                </Card>
            </div>
           
          <Timeline/>
          
        </div>
    );
}

export default DocumentView;