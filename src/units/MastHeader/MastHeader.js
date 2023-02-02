import React from 'react';
import './Mastheader.css';
import CHEDlogo from './CHED-Logo.png';

function MastHeader () {
    return (
    <div className='Mastheader'>
        <div className='logo'>
        <img src= {CHEDlogo} alt='' height={150}/>
        </div>
        <p className='header-p'> 
        <h1 className='republic'> REPUBLIC OF THE PHILIPPINES</h1>
        <h2 className='president'> OFFICE OF THE PRESIDENT</h2>
        <h2 className='ched'> COMMISION ON HIGHER EDUCATION </h2>
        <h4 className='office'> REGIONAL OFFICE IV (CALABARZON)</h4>
        </p>
</div>

        
    )
}

export default MastHeader; 