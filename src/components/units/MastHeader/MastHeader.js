import React from 'react';
import {
    Row,
    Col,
} from 'react-bootstrap';
import chedLogo from '../../../assets/ched-logo.png';
import foi from '../../../assets/foi.png';
import seal from '../../../assets/seal.png';
import './styles.css';

function MastHeader () {
    return (
        
        <div className='Mastheader'> 
        <Row className='d-flex'>
            
            <Col className='d-flex ms-5 align-self-center'>
                <a className=''href='#Home'>
                    <img src= {chedLogo} alt='' height={120}/>
                </a>
                <p className='header-p ms-2'> 
                    <span className='republic'> REPUBLIC OF THE PHILIPPINES </span>
                    <h2 className='president'> OFFICE OF THE PRESIDENT </h2>
                    <span className='ched'> COMMISION ON HIGHER EDUCATION </span>
                    <h4 className='office'> REGIONAL OFFICE IV (CALABARZON) </h4>
                </p> 
            </Col>

            <Col  className='logo'> 
                <div className='d-flex justify-content-end me-5'> 
                <a href='https://www.foi.gov.ph/' style={{marginRight:'20px'}}>
                    <span className='d-none d-md-inline-block'> <img src= {foi} alt='' height={120}/></span>
                </a>
                <a href='https://www.dbm.gov.ph/index.php/about-us/philippine-transparency-seal'>
                <span className='d-none d-md-inline-block'> <img src= {seal} alt='' height={120}/> </span>
                </a>
               </div>
            </Col>
        </Row>
        </div>
    );
}

export default MastHeader; 