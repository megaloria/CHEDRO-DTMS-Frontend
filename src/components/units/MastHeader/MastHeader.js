import React from 'react';
import {
    Row,
    Col,
    Container,
} from 'react-bootstrap';
import chedLogo from '../../../assets/ched-logo.png';
import foi from '../../../assets/foi.png';
import seal from '../../../assets/seal.png';
import './styles.css';

function MastHeader () {
    return (
        
        <div className='Mastheader'> 
            <Container fluid>
                <Row className='d-flex'>
                
                    <Col className='d-flex ms-3 mt-3 align-self-center'>
                        <a className=''href='https://chedcalabarzon.com/'>
                            <img src= {chedLogo} alt='' height={120}/>
                        </a>
                        <p className='header-p ms-2'> 
                            <span className='republic'> REPUBLIC OF THE PHILIPPINES </span>
                            <h2 className='president'> OFFICE OF THE PRESIDENT </h2>
                            <span className='ched'> COMMISION ON HIGHER EDUCATION </span>
                            <h4 className='office'> REGIONAL OFFICE IV (CALABARZON) </h4>
                        </p> 
                    </Col>

                    <Col  className='logo mt-3 d-none d-md-inline-block'> 
                        <div className='d-flex justify-content-end me-3'> 
                        <a className='me-3'href='https://www.foi.gov.ph/'>
                            <img src= {foi} alt='' height={120}/>
                        </a>
                        <a href='https://www.dbm.gov.ph/index.php/about-us/philippine-transparency-seal'>
                            <img src= {seal} alt='' height={120}/> 
                        </a>
                    </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MastHeader; 