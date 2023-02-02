import React  from 'react';
import "./Sidebar.css";
import  SidebarData from './SidebarData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    
} from 'react-bootstrap'

function Sidebar() {
    return( 
     <div className="Sidebar">
        <ul className="SidebarList">
            {SidebarData.map((val, key) => {
            return ( 
            <li key={key}
            className="row"
            onClick={()=>{
                window.location.pathname = val.link;
                }}
                > 
                <div id="icon">
                &nbsp;<FontAwesomeIcon icon={val.icon}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{val.title}
                </div>
            </li>
            );
            })}
        </ul>
    </div>
    );
}
export default Sidebar;