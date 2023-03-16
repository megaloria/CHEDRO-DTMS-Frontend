// import React, { useEffect, useState }  from 'react';
import Timeline from '../../../units/Timeline/Timeline';
import React, { useEffect, useState } from 'react';
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
    faUser,
    faFile,
    faHashtag
} from '@fortawesome/free-solid-svg-icons'
import {
    Link, useLoaderData
} from 'react-router-dom';


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
            <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faHashtag} className="text-secondary" style={{marginRight:'20px'}}/>
                            {document.tracking_no}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faFile} className="text-secondary " variant="link" style={{marginRight:'20px'}}/>
                            {document.document_type.description}
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
                            {document.user.profile.name}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FontAwesomeIcon icon={faCalendar} className="text-secondary" style={{marginRight:'20px'}}/>
                            {document.date_received}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col row={5}>
                            {document.description}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col >
                            <FontAwesomeIcon icon={faPaperclip} className="text-secondary" style={{marginRight:'20px'}}/>
                            {document.attachment}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col >
                            <FontAwesomeIcon className="text-secondary" style={{marginRight:'20px'}}/>
                            {document.category.description}
                        </Col>
                    </Row>
          <Timeline/>
          
        </div>
    );
}

export default DocumentView;