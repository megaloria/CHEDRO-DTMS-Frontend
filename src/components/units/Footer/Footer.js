import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookSquare
} from '@fortawesome/free-brands-svg-icons';
import './styles.css';

function Footer(){
    return(
        <div className='footer'>
            <div>
                City Hall Compound, Barangay Marawoy, Jose P. Laurel Highway, Lipa City
            </div>
            
            <div>
                ched4a@ched.gov.ph / (043) 727-2764
            </div>

            <div>
                <a href='https://www.facebook.com/ched4/' target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faFacebookSquare} />
                </a>
            </div>
        </div>
    );  
}
export default Footer;