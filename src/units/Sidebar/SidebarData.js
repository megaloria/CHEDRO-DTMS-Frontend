import React  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faNoteSticky, faUserPlus } from '@fortawesome/free-solid-svg-icons'


 const SidebarData = [
    {
        title:"Documents",
        icon: faNoteSticky,
        link:"/documents"
    },
    {
        title:"Settings",
        icon: faGear,
        link:"/sample",
    },
    {
        title:"Users",
        icon: faUserPlus,
        link:"/Users"
    }
]



export default SidebarData