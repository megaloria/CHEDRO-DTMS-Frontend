import React from 'react';
import chedLogo from '../../../assets/ched-logo.png';
import foi from '../../../assets/foi.png';
import seal from '../../../assets/seal.png';
import './styles.css';

function MastHeader () {
    return (
        <div className='Mastheader'>
            
            <div className='logo' >
                <a href='#Home'>
                    <img src= {chedLogo} alt='' height={120}/>
                </a>
                
            </div>

            <div className='header-p'> 
                <span className='republic'> REPUBLIC OF THE PHILIPPINES </span>
                <h2 className='president'> OFFICE OF THE PRESIDENT </h2>
                <span className='ched'> COMMISION ON HIGHER EDUCATION </span>
                <h4 className='office'> REGIONAL OFFICE IV (CALABARZON) </h4>
            </div>
            
            <div  className='logo' style={{marginInlineStart:'27rem'}}> 
                <a href='https://www.foi.gov.ph/' style={{marginRight:'20px'}}>
                    <img src= {foi} alt='' height={120}/>
                </a>
                <a href='https://www.dbm.gov.ph/index.php/about-us/philippine-transparency-seal'>
                    <img src= {seal} alt='' height={120}/>
                </a>
            </div>
        </div>
    );
}

export default MastHeader; 