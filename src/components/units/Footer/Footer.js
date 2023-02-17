import React from 'react';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
    faFacebookSquare
  } from '@fortawesome/free-brands-svg-icons';

import './styles.css';

function Footer(){
    return(
        <div className='Footer'>
            <div className='footer'>
                City Hall Compound, Barangay Marawoy, Jose P. Laurel Highway, Lipa City
            </div>
            
            <div className='footer'>
                ched4a@ched.gov.ph / (043) 727-2764
            </div>

            <div className='footer'>
                <a href="https://www.facebook.com/ched4/">
                    <FontAwesomeIcon icon={faFacebookSquare} />
                </a>
            </div>
        </div>
    );  
}
export default Footer