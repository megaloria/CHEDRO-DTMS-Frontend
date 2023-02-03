import React from 'react';
import './Mastheader.css';
import CHEDLogo from './assets/CHED-Logo.png';

function MastHeader () 
{
    return (
    <div className='Mastheader'>
        <div className='logo'>
            <a href='#!'>
                 <img src= {CHEDLogo} alt='' height={120}/>
            </a>
        </div>

        <div className='header-p'> 
            <span className='republic'> REPUBLIC OF THE PHILIPPINES </span>
            <h2 className='president'> OFFICE OF THE PRESIDENT </h2>
            <span className='ched'> COMMISION ON HIGHER EDUCATION </span>
            <h4 className='office'> REGIONAL OFFICE IV (CALABARZON) </h4>
        </div>

    </div>

        
    )
}

export default MastHeader; 